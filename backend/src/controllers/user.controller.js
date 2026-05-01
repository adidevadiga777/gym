const userModel = require('../models/user.model');
const Imagekit = require("@imagekit/nodejs");

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_Y+GOnG8K6fE/Y+6B4R5G7X+6B4R5G7X=",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/hnoglyswo0"
});

async function updateProfileController(req, res) {
    try {
        const { username } = req.body;
        const userId = req.user.id;
        
        const updateData = {};
        if (username) updateData.username = username;
        
        if (req.file) {
            const uploadResponse = await imagekit.files.upload({
                file: req.file.buffer.toString('base64'),
                fileName: `profile-${userId}-${Date.now()}`,
                folder: "user-profiles"
            });
            updateData.profileImage = uploadResponse.url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    updateProfileController
};
