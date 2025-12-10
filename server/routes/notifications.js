import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Notification from "../models/Notification.js";
import Team from "../models/Team.js";

const router = express.Router();

export async function createNotification(data) {
  try {
    const notification = await Notification.create({
      team: data.team,
      type: data.type,
      message: data.message,
      createdBy: data.createdBy,
      relatedDocument: data.relatedDocument,
      relatedUser: data.relatedUser
    });
    return notification;
  } catch (err) {
    console.error("Create notification error", err);
    return null;
  }
}

// GET /api/notifications/team/:teamId
router.get("/team/:teamId", requireAuth, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this team's notifications" });
    }

    const notifications = await Notification.find({
      team: teamId,
      expiresAt: { $gt: new Date() }
    })
      .populate('createdBy', 'fullName email')
      .populate('relatedUser', 'fullName email')
      .populate('relatedDocument', 'title fileName')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({
      notifications: notifications.map((n) => ({
        id: n._id,
        type: n.type,
        message: n.message,
        createdAt: n.createdAt,
        createdBy: n.createdBy ? {
          id: n.createdBy._id,
          name: n.createdBy.fullName,
          email: n.createdBy.email
        } : null,
        relatedUser: n.relatedUser ? {
          id: n.relatedUser._id,
          name: n.relatedUser.fullName,
          email: n.relatedUser.email
        } : null,
        relatedDocument: n.relatedDocument ? {
          id: n.relatedDocument._id,
          title: n.relatedDocument.title,
          fileName: n.relatedDocument.fileName
        } : null
      }))
    });
  } catch (err) {
    console.error("Get notifications error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/notifications/:id 
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).lean();
    
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const team = await Team.findById(notification.team).lean();
    if (!team || !team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    return res.json({ success: true });
  } catch (err) {
    console.error("Delete notification error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/notifications/cleanup
router.post("/cleanup", async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      expiresAt: { $lt: new Date() }
    });

    return res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error("Cleanup notifications error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

