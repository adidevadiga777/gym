const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../services/mail.service');

async function registerController(req, res) {
    const { email, username, password, profileImage } = req.body;
    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })
    if (isUserAlreadyExist) {
        return res.status(409)
            .json({
                message: 'User already exists ' + (isUserAlreadyExist.email === email ? 'Email already exists' : 'Username already exists')
            })
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        email,
        username,
        password: hash,
        profileImage
    })
    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    res.cookie('token', token)

    let emailSent = false;
    try {
        await sendMail({
            to: email,
            subject: "Welcome to Apna Member",
            html: `<p>Hello ${username},</p>
                <p>Thank you for joining Apna Member!</p>
            <p>Best regards,<br>Apna Member Team</p>`
        })
        emailSent = true;
    } catch (error) {
        console.error("Email could not be sent to: " + email, error)
    }

    res.status(201).json({
        message: 'User registered successfully' + (emailSent ? '' : ' (but welcome email could not be sent)'),
        emailSent,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }
    })
}


async function loginController(req, res) {
    const { username, email, password } = req.body

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "password invalid"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)


    res.status(200)
        .json({
            message: "User loggedIn successfully.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        })
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id).select("-password")
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ user })
}

module.exports = {
    registerController,
    loginController,
    getMeController
}