import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['member_added', 'member_removed', 'document_uploaded', 'team_updated']
    },
    message: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    relatedDocument: { type: Schema.Types.ObjectId, ref: "Document" }, 
    relatedUser: { type: Schema.Types.ObjectId, ref: "User" }, 
    expiresAt: { 
      type: Date, 
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);


notificationSchema.index({ team: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

