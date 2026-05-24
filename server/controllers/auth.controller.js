import genToken from "../config/token.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
    try {

        const { name, email } = req.body;

        // Find user
        let user = await User.findOne({ email });

        // Create user if not exists
        if (!user) {
            user = await User.create({
                name,
                email
            });
        }

        // Generate JWT token
        const token = await genToken(user._id);

        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true only in production with HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        return res.status(500).json({
            message: `Google auth error: ${error.message}`
        });

    }
};

export const logOut = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Logout Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: `Logout error: ${error.message}`
        });

    }
};