const postModel = require('../models/post.model')
const Imagekit = require("@imagekit/nodejs");
const { sendMail } = require('../services/mail.service');

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
})

async function createPostController(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded (ensure key is 'chacha')" });
    }

    try {
        const file = await imagekit.files.upload({
            file: req.file.buffer.toString('base64'),
            fileName: req.file.originalname || "upload",
            folder: "gym-member"
        })

        const dateOfJoin = req.body.dateOfJoin ? new Date(req.body.dateOfJoin) : new Date();
        let expiryDate = new Date(dateOfJoin);
        const plan = (req.body.planName || "Monthly").toLowerCase();

        if (plan === 'monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
        else if (plan === 'quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
        else if (plan === 'yearly') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        else expiryDate.setMonth(expiryDate.getMonth() + 1);

        const post = await postModel.create({
            imgUrl: file.url,
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            planName: req.body.planName,
            dateOfJoin: dateOfJoin,
            expiryDate: expiryDate,
            user: req.user.id
        })

        // Send Email in the background so the request doesn't hang
        sendMail({
            to: req.body.email,
            subject: "Gym Membership Confirmed!",
            html: `
                <h2>Hello ${req.body.name}!</h2>
                <p>Your gym membership has been successfully activated.</p>
                <p><strong>Membership Details:</strong></p>
                <ul>
                    <li><strong>Plan:</strong> ${req.body.planName}</li>
                    <li><strong>Joining Date:</strong> ${dateOfJoin.toDateString()}</li>
                    <li><strong>Expiry Date:</strong> ${expiryDate.toDateString()}</li>
                </ul>
                <p>Team ${req.user.username}</p>
            `
        }).catch(mailError => {
            console.error("Background Notification Error: Could not send joining email to " + req.body.email, mailError.message);
        });

        res.status(201).json({
            message: "Member added and confirmation email attempted.",
            post
        })
    } catch (error) {
        console.error("Error creating member:", error);
        res.status(500).json({
            message: "Failed to create member record",
            error: error.message
        });
    }
}

async function getPostsController(req, res) {
    const userId = req.user.id;
    const posts = await postModel.find({ user: userId }).populate('user', 'username email profileImage')
    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })
}

async function getPostDetailsController(req, res) {
    const postId = req.params.postId

    const post = await postModel.findById(postId).populate('user', 'username email profileImage')

    if (!post) {
        return res.status(404).json({
            message: "post not found."
        })
    }

    return res.status(200).json({
        message: "Post fetched sucessfully.",
        post
    })
}

async function getUserPostsController(req, res) {
    const userId = req.params.userId
    const posts = await postModel.find({ user: userId }).populate('user', 'username email profileImage')
    res.status(200)
        .json({
            message: "User's posts fetched successfully.",
            posts
        })
}

module.exports = {
    createPostController,
    getPostsController,
    getPostDetailsController,
    getUserPostsController
}
