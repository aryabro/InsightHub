import mongoose from "mongoose";

const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    title: { type: String, required: true },
    tag: { type: String },
    summary: { type: String },
    fileName: { type: String },
    fileSize: { type: Number }, 
    fileContent: { type: Buffer }, 
    mimeType: { type: String }, 
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    viewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;


