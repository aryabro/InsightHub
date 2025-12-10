import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { requireAuth } from "../middleware/auth.js";
import Document from "../models/Document.js";
import DocumentChunk from "../models/DocumentChunk.js";
import Team from "../models/Team.js";
import { createNotification } from "./notifications.js";
import { processTextToChunks } from "../services/embeddings.js";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// POST /api/documents
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const { teamId, title, tag, summary } = req.body;
    const file = req.file;

    if (!teamId || !title) {
      return res.status(400).json({ error: "teamId and title are required" });
    }

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    const isPDF = file.mimetype === 'application/pdf' || 
                  file.originalname.toLowerCase().endsWith('.pdf');
    
    if (!isPDF) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to upload to this team" });
    }

    let fileName = file.originalname;
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
      fileName = `${nameWithoutExt}.pdf`;
    }

    const doc = await Document.create({
      team: teamId,
      title,
      tag,
      summary,
      fileName: fileName, 
      fileSize: file.size,
      fileContent: file.buffer, 
      mimeType: 'application/pdf', 
      uploadedBy: req.user.id
    });

    try {
      console.log(`📄 Processing PDF for RAG: ${title}`);
      

      const parser = new PDFParse({ data: file.buffer });
      const pdfResult = await parser.getText();
      const extractedText = pdfResult.text;

      await parser.destroy();
      
      if (extractedText && extractedText.trim().length > 0) {
        console.log(`📝 Extracted ${extractedText.length} characters from PDF`);
        
        const chunksWithEmbeddings = await processTextToChunks(extractedText);
        
        console.log(`🔢 Generated ${chunksWithEmbeddings.length} chunks with embeddings`);
        
        if (chunksWithEmbeddings.length > 0) {
          const chunkDocs = chunksWithEmbeddings.map(chunk => ({
            document: doc._id,
            team: teamId,
            text: chunk.text,
            embedding: chunk.embedding,
            chunkIndex: chunk.chunkIndex
          }));
          
          await DocumentChunk.insertMany(chunkDocs);
          console.log(`✅ Saved ${chunkDocs.length} document chunks for RAG`);
        }
      } else {
        console.log(`⚠️ No text extracted from PDF: ${title}`);
      }
    } catch (ragError) {
      console.error("RAG processing error (non-fatal):", ragError);
    }

    await createNotification({
      team: teamId,
      type: 'document_uploaded',
      message: `${title} was uploaded`,
      createdBy: req.user.id,
      relatedDocument: doc._id
    });

    return res.status(201).json({
      document: {
        id: doc._id,
        team: doc.team,
        title: doc.title,
        tag: doc.tag,
        summary: doc.summary,
        fileName: doc.fileName
      }
    });
  } catch (err) {
    console.error("Upload document error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/team/:teamId - 
router.get("/team/:teamId", requireAuth, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this team's documents" });
    }

    const docs = await Document.find({ team: teamId })
      .populate('uploadedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      documents: docs.map((d) => ({
        id: d._id,
        team: d.team,
        title: d.title,
        tag: d.tag,
        summary: d.summary,
        fileName: d.fileName,
        createdAt: d.createdAt,
        uploadedBy: d.uploadedBy ? {
          id: d.uploadedBy._id,
          name: d.uploadedBy.fullName,
          email: d.uploadedBy.email
        } : null
      })),
      createdBy: team.createdBy.toString(),
      currentUserId: req.user.id
    });
  } catch (err) {
    console.error("Get team documents error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/recent
router.get("/recent", requireAuth, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const teams = await Team.find({ members: req.user.id }, { _id: 1 }).lean();
    const teamIds = teams.map((t) => t._id);

    if (!teamIds.length) {
      return res.json({ documents: [] });
    }

    const docs = await Document.find({ team: { $in: teamIds } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({
      documents: docs.map((d) => ({
        id: d._id,
        team: d.team,
        title: d.title,
        tag: d.tag,
        summary: d.summary,
        fileName: d.fileName,
        createdAt: d.createdAt
      }))
    });
  } catch (err) {
    console.error("Recent documents error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/:id/preview
router.options("/:id/preview", (req, res) => {
  const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.status(200).end();
});

router.get("/:id/preview", (req, res, next) => {
  if (req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  requireAuth(req, res, next);
}, async (req, res) => {
  try {
    console.log('Preview request received for document:', req.params.id);
    const doc = await Document.findById(req.params.id)
      .select('+fileContent')
      .populate('uploadedBy', 'fullName email');
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const team = await Team.findById(doc.team).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this document" });
    }

    if (doc.fileContent && doc.fileContent.length > 0) {
      const fileBuffer = Buffer.isBuffer(doc.fileContent) 
        ? doc.fileContent 
        : Buffer.from(doc.fileContent);
      
      let fileName = doc.fileName || doc.title;
      if (!fileName.toLowerCase().endsWith('.pdf')) {
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        fileName = `${nameWithoutExt}.pdf`;
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('Content-Length', fileBuffer.length);
      
      const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
      
      return res.end(fileBuffer);
    }

    return res.status(404).json({ error: "File content not available" });
  } catch (err) {
    console.error("Preview document error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/:id/download
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    
    const doc = await Document.findById(req.params.id)
      .select('+fileContent') // Explicitly include fileContent
      .populate('uploadedBy', 'fullName email');
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const team = await Team.findById(doc.team).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to download this document" });
    }

    if (doc.fileContent && doc.fileContent.length > 0) {
      const fileBuffer = Buffer.isBuffer(doc.fileContent) 
        ? doc.fileContent 
        : Buffer.from(doc.fileContent);
      
      let fileName = doc.fileName || doc.title;
      if (!fileName.toLowerCase().endsWith('.pdf')) {
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        fileName = `${nameWithoutExt}.pdf`;
      }
      
      res.setHeader('Content-Type', 'application/pdf');

      const safeFileName = fileName.replace(/"/g, '\\"');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
      res.setHeader('Content-Length', fileBuffer.length);
      
      return res.end(fileBuffer);
    }

    const content = `Document: ${doc.title}
${doc.tag ? `Type: ${doc.tag}` : ''}
${doc.summary ? `\nSummary:\n${doc.summary}` : ''}
${doc.fileName ? `\nOriginal File: ${doc.fileName}` : ''}
${doc.uploadedBy ? `\nUploaded by: ${doc.uploadedBy.fullName}` : ''}
${doc.createdAt ? `\nUploaded on: ${new Date(doc.createdAt).toLocaleString()}` : ''}

---
Note: File content not available.
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName || doc.title}.txt"`);
    res.send(content);
  } catch (err) {
    console.error("Download document error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/documents/:id 
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
      .populate('uploadedBy', 'fullName email')
      .lean();
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const team = await Team.findById(doc.team).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this document" });
    }

    await Document.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    return res.json({
      document: {
        id: doc._id,
        team: doc.team,
        title: doc.title,
        tag: doc.tag,
        summary: doc.summary,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        createdAt: doc.createdAt,
        viewCount: (doc.viewCount || 0) + 1,
        uploadedBy: doc.uploadedBy ? {
          id: doc.uploadedBy._id,
          name: doc.uploadedBy.fullName,
          email: doc.uploadedBy.email
        } : null,
        createdBy: team.createdBy.toString(),
        currentUserId: req.user.id
      }
    });
  } catch (err) {
    console.error("Get document error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/documents/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const team = await Team.findById(doc.team).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only team creator can delete documents" });
    }

    await Document.findByIdAndDelete(req.params.id);
    
    await DocumentChunk.deleteMany({ document: req.params.id });

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete document error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


