import mongoose from "mongoose";

const { Schema } = mongoose;

const documentChunkSchema = new Schema(
  {
    document: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    chunkIndex: { type: Number, required: true }
  },
  { timestamps: true }
);

documentChunkSchema.index({ team: 1 });
documentChunkSchema.index({ document: 1 });

const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);

export default DocumentChunk;
