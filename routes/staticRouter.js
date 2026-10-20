
const express = require("express");
const URL = require("../models/url");
const { restrictToLoggedinUserOnly } = require("../middelwares/auth");

const router = express.Router();

router.get("/", restrictToLoggedinUserOnly, async (req, res) => {
    try {
        const allUrls = await URL.find({
            createdBy: req.user._id,
        });

        return res.render("home", {
            urls: allUrls,
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Failed to fetch URLs");
    }
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

module.exports = router;
