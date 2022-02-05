const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator/check");

const router = express.Router();

router.get("/", auth, async (request, response) => {
    try {
        const user = await User.findById(request.user.id).select("-password");
        response.json(user);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
] ,async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    const {email, password} = request.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return response.status(400).json({
                msg: "Invalid Credentials"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(400).json({
                msg: "Invalid Credentials"
            })
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) {
                throw err;
            }
            else {
                response.json({token});
            }
        })
    }
    catch (err) {
        console.log(err.message);
        response.status(500).json("Server Error");
    }
});

module.exports = router;