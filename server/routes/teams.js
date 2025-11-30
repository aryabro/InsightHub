import express from "express";
import Team from "../models/Team.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { createNotification } from "./notifications.js";

const router = express.Router();

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function getUniqueInviteCode() {
  let code;
  // In practice collision risk is tiny, but loop for safety
  // eslint-disable-next-line no-constant-condition
  while (true) {
    code = generateInviteCode();
    const existing = await Team.findOne({ inviteCode: code }).lean();
    if (!existing) break;
  }
  return code;
}

// POST /api/teams
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      mission,
      standupTime,
      timezone,
      isPrivate
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Team name is required" });
    }

    const inviteCode = await getUniqueInviteCode();

    const team = await Team.create({
      name,
      description,
      mission,
      standupTime,
      timezone,
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      inviteCode,
      members: [req.user.id],
      createdBy: req.user.id
    });

    return res.status(201).json({
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        mission: team.mission,
        standupTime: team.standupTime,
        timezone: team.timezone,
        inviteCode: team.inviteCode,
        isPrivate: team.isPrivate
      }
    });
  } catch (err) {
    console.error("Create team error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/teams/my - MUST come before /:id route
router.get("/my", requireAuth, async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = teams.map((t) => ({
      id: t._id,
      name: t.name,
      description: t.description,
      mission: t.mission,
      standupTime: t.standupTime,
      timezone: t.timezone,
      inviteCode: t.inviteCode,
      isPrivate: t.isPrivate,
      memberCount: t.members?.length || 0
    }));

    return res.json({ teams: mapped });
  } catch (err) {
    console.error("My teams error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/teams/public - MUST come before /:id route
router.get("/public", requireAuth, async (req, res) => {
  try {
    const teams = await Team.find({ isPrivate: false })
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .lean();

    // Filter out teams the user is already a member of
    const publicTeams = teams.filter((t) => 
      !t.members.some((m) => m.toString() === req.user.id)
    );

    const mapped = publicTeams.map((t) => ({
      id: t._id,
      name: t.name,
      description: t.description,
      mission: t.mission,
      memberCount: t.members?.length || 0,
      createdAt: t.createdAt,
      createdBy: t.createdBy ? {
        name: t.createdBy.fullName,
        email: t.createdBy.email
      } : null
    }));

    return res.json({ teams: mapped });
  } catch (err) {
    console.error("Get public teams error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teams/join - MUST come before /:id route
router.post("/join", requireAuth, async (req, res) => {
  try {
    const { inviteCode, teamId } = req.body;

    let team;
    
    if (inviteCode) {
      // Join by invite code
      team = await Team.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
      if (!team) {
        return res.status(404).json({ error: "Invalid invite code" });
      }
    } else if (teamId) {
      // Join public team by ID
      team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      if (team.isPrivate) {
        return res.status(403).json({ error: "This team is private. Please use an invite code." });
      }
    } else {
      return res.status(400).json({ error: "Either inviteCode or teamId is required" });
    }

    // Check if user is already a member
    if (team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(400).json({ error: "You are already a member of this team" });
    }

    // Add user to team
    team.members.push(req.user.id);
    await team.save();

    // Create notification for member added
    const newMember = await User.findById(req.user.id).lean();
    if (newMember) {
      await createNotification({
        team: team._id,
        type: 'member_added',
        message: `${newMember.fullName} joined the team`,
        createdBy: req.user.id,
        relatedUser: req.user.id
      });
    }

    return res.json({
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        mission: team.mission,
        standupTime: team.standupTime,
        timezone: team.timezone,
        inviteCode: team.inviteCode,
        isPrivate: team.isPrivate,
        memberCount: team.members?.length || 0
      }
    });
  } catch (err) {
    console.error("Join team error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/teams/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if user is a member
    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this team" });
    }

    return res.json({
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        mission: team.mission,
        standupTime: team.standupTime,
        timezone: team.timezone,
        slackChannel: team.slackChannel,
        email: team.email,
        inviteCode: team.inviteCode,
        isPrivate: team.isPrivate,
        memberCount: team.members?.length || 0,
        createdAt: team.createdAt
      }
    });
  } catch (err) {
    console.error("Get team error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/teams/:id
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if user is a member
    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to modify this team" });
    }

    const {
      name,
      description,
      mission,
      standupTime,
      timezone,
      slackChannel,
      email,
      isPrivate
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (mission !== undefined) updateData.mission = mission;
    if (standupTime !== undefined) updateData.standupTime = standupTime;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (slackChannel !== undefined) updateData.slackChannel = slackChannel;
    if (email !== undefined) updateData.email = email;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const hasUpdates = Object.keys(updateData).length > 0;
    Object.assign(team, updateData);
    await team.save();

    // Create notification for team update (only if description was updated)
    if (hasUpdates && (updateData.description !== undefined || updateData.name !== undefined)) {
      await createNotification({
        team: team._id,
        type: 'team_updated',
        message: `Team details were updated`,
        createdBy: req.user.id
      });
    }

    return res.json({
      team: {
        id: team._id,
        name: team.name,
        description: team.description,
        mission: team.mission,
        standupTime: team.standupTime,
        timezone: team.timezone,
        slackChannel: team.slackChannel,
        email: team.email,
        inviteCode: team.inviteCode,
        isPrivate: team.isPrivate,
        memberCount: team.members?.length || 0,
        createdAt: team.createdAt
      }
    });
  } catch (err) {
    console.error("Update team error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/teams/:id/members
router.get("/:id/members", requireAuth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'fullName email role timezone phone createdAt').lean();
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Check if user is a member
    if (!team.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to view this team" });
    }

    const members = team.members.map((member) => ({
      id: member._id,
      name: member.fullName,
      email: member.email,
      role: member.role || 'Member',
      timezone: member.timezone || '',
      phone: member.phone || '',
      joined: member.createdAt
    }));

    return res.json({
      members,
      createdBy: team.createdBy.toString(),
      currentUserId: req.user.id
    });
  } catch (err) {
    console.error("Get team members error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/teams/:id/members
router.post("/:id/members", requireAuth, async (req, res) => {
  try {
    const { emails } = req.body;
    const teamId = req.params.id;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "emails array is required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Only allow if the user is already a member
    if (!team.members.some((m) => m.toString() === req.user.id)) {
      return res.status(403).json({ error: "Not authorized to modify this team" });
    }

    const uniqueEmails = [...new Set(emails.map((e) => e.toLowerCase()))];
    const users = await User.find({ email: { $in: uniqueEmails } });

    const emailToUser = new Map(users.map((u) => [u.email.toLowerCase(), u]));

    const added = [];
    const notFound = [];

    for (const email of uniqueEmails) {
      const user = emailToUser.get(email);
      if (!user) {
        notFound.push(email);
        continue;
      }
      if (!team.members.some((m) => m.toString() === user._id.toString())) {
        team.members.push(user._id);
        added.push({ email, userId: user._id.toString() });
      }
    }

    await team.save();

    // Create notifications for each added member
    for (const addedMember of added) {
      const user = await User.findById(addedMember.userId).lean();
      if (user) {
        await createNotification({
          team: teamId,
          type: 'member_added',
          message: `${user.fullName} was added to the team`,
          createdBy: req.user.id,
          relatedUser: addedMember.userId
        });
      }
    }

    return res.json({ added, notFound });
  } catch (err) {
    console.error("Add team members error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/teams/:id/members/:userId
router.delete("/:id/members/:userId", requireAuth, async (req, res) => {
  try {
    const { id: teamId, userId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Only creator can remove members
    if (team.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only team creator can remove members" });
    }

    // Cannot remove yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot remove yourself from the team" });
    }

    // Get user info before removing
    const removedUser = await User.findById(userId).lean();
    
    // Remove member from team
    team.members = team.members.filter((m) => m.toString() !== userId);
    await team.save();

    // Create notification for member removed
    if (removedUser) {
      await createNotification({
        team: teamId,
        type: 'member_removed',
        message: `${removedUser.fullName} was removed from the team`,
        createdBy: req.user.id,
        relatedUser: userId
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Remove team member error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


