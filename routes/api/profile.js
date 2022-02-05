const express = require("express");
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const {check, validationResult} = require("express-validator/check");

const router = express.Router();

router.get("/me", auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({user: request.user.id}).populate("user", ["name", "avatar"]);
        if (!profile) {
            return response.status(400).json({
                msg: "There is no profile for this user"
            })
        }
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.post("/", [auth, [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin} = request.body;
    const profileFields = {};
    profileFields.user = request.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
        let profile = await Profile.findOne({user: request.user.id});
        if (profile) {
            profile = await Profile.findOneAndUpdate({user: request.user.id}, {$set: profileFields}, {new: true});
            return response.json(profile);
        }
        profile = new Profile(profileFields);
        await profile.save();
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.get("/", async (request, response) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        response.json(profiles);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.get("/user/:user_id", async (request, response) => {
    try {
        const profile = await Profile.findOne({user: request.params.user_id}).populate("user", ["name", "avatar"]);
        if (!profile) {
            return response.status(400).json({
                msg: "Profile not found"
            })
        }
        response.json(profile);
    }
    catch (err) {
        if (err.kind === "ObjectId") {
            return response.status(400).json({
                msg: "Profile not found"
            })
        }
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.delete("/", auth, async (request, response) => {
    try {
        await Post.deleteMany({user: request.user.id});
        await Profile.findOneAndRemove({user: request.user.id});
        await User.findOneAndRemove({_id: request.user.id});
        response.json({msg: "User deleted"});
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.put("/experience", [auth, [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty()
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    const {title, company, location, from, to, current, description} = request.body;
    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try {
        const profile = await Profile.findOne({user: request.user.id});
        profile.experience.unshift(newExperience);
        await profile.save();
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.delete("/experience/:exp_id", auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({user: request.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(request.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.put("/education", [auth, [
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldofstudy", "Field of study is required").not().isEmpty(),
    check("from", "From date is required")
]], async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({
            errors: errors.array()
        })
    }
    const {school, degree, fieldofstudy, from, to, current, description} = request.body;
    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };
    try {
        const profile = await Profile.findOne({user: request.user.id});
        profile.education.unshift(newEducation);
        await profile.save();
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.delete("/education/:edu_id", auth, async (request, response) => {
    try {
        const profile = await Profile.findOne({user: request.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(request.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        response.json(profile);
    }
    catch (err) {
        console.log(err.message);
        response.status(500).send("Server Error");
    }
});

router.get("/github/:username", async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubClientSecret")}`,
            method: "GET",
            headers: {"user-agent": "node.js"}
        };
        request(options, (err, response, body) => {
            if (err) {
                console.error(err);
            }
            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: "No Github profile found"
                })
            };
            res.json(JSON.parse(body));
        })
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;