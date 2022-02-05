const express = require("express");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {check, validationResult} = require("express-validator/check");

const router = express.Router();

router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({
        min: 6
    })
], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    const {name, email, password} = request.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return response.status(400).json({
                errors: [{msg: "User already exists"}]
            })
        }
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        })
        user = new User({
            name,
            email,
            avatar,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.get("jwtSecret"), {
            expiresIn: 360000
        }, (err, token) => {
            if (err) {
                throw err;
            }
            else {
                response.status(200).json({
                    token
                })
            }
        });

    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
})

module.exports = router;