import mongoose from "mongoose";

const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    standupTime: { type: String },
    timezone: { type: String },
    mission: { type: String },
    slackChannel: { type: String },
    email: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    inviteCode: { type: String, unique: true },
    isPrivate: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;


