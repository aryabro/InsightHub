import mongoose from "mongoose";

const { Schema } = mongoose;

const documentChunkSchema = new Schema(
  {
    document: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    text: { type: String, required: true },
    // Embedding vector (array of numbers)
    embedding: { type: [Number], required: true },
    chunkIndex: { type: Number, required: true } // To maintain order if needed
  },
  { timestamps: true }
);

// Index for faster retrieval by team
documentChunkSchema.index({ team: 1 });
documentChunkSchema.index({ document: 1 });

const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);

export default DocumentChunk;
