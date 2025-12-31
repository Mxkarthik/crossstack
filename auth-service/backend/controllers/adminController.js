import TryCatch from "../middlewares/TryCatch.js";
import { Invite } from "../models/Invite.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendMail from "../config/sendMail.js"; // Assuming similar mailer usage

export const createInvite = TryCatch(async (req, res) => {
    const { email, role } = req.body;

    // Ensure the requester has an organization (admin must belong to an org to invite to it)
    // For the very first super-admin, this might need a check, but per rules: "Only authenticated admins can invite".
    // We assume the admin has an orgId.
    const adminOrgId = req.user.orgId;

    if (!adminOrgId) {
        return res.status(400).json({
            message: "You must belong to an organization to invite users.",
        });
    }

    if (!email || !role) {
        return res.status(400).json({
            message: "Please provide email and role.",
        });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);

    const invite = await Invite.create({
        email,
        orgId: adminOrgId,
        role,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/accept-invite?token=${token}&inviteId=${invite._id}`;

    // In production, send this via email.
    console.log(`Invite Link for ${email}: ${inviteLink}`);

    // Attempt to send email if mailer is configured, otherwise fallback to console is already done
    try {
        await sendMail({
            email,
            subject: "You have been invited to join an Organization",
            html: `<p>You have been invited to join. Click <a href="${inviteLink}">here</a> to accept.</p>`,
        });
    } catch (error) {
        console.log("Email sending failed:", error.message);
        // We don't fail the request if email fails, but we logged the link.
    }

    res.status(201).json({
        message: `Invite sent to ${email}`,
        inviteId: invite._id,
        // debug: token // Do not return token in production response, accessing logs or email is required.
    });
});
