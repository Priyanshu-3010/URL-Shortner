
const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    try {
        const { url, customAlias } = req.body;

        // Validate URL input
        if (!url || typeof url !== "string" || !url.trim()) {
            return res.status(400).json({
                error: "URL is required",
            });
        }

        let parsedURL;

        try {
            parsedURL = new globalThis.URL(url.trim());
        } catch {
            return res.status(400).json({
                error: "Invalid URL format",
            });
        }

        if (!["http:", "https:"].includes(parsedURL.protocol)) {
            return res.status(400).json({
                error: "Only HTTP and HTTPS URLs are allowed",
            });
        }

        const hostname = parsedURL.hostname;

        if (
            !hostname.includes(".") ||
            hostname.startsWith(".") ||
            hostname.endsWith(".") ||
            hostname.split(".").some(
                (label) =>
                    !label ||
                    label.startsWith("-") ||
                    label.endsWith("-")
            )
        ) {
            return res.status(400).json({
                error: "Please provide a valid domain name",
            });
        }

        // Use custom alias or generate a random short ID
        let shortId;

        if (customAlias !== undefined && customAlias !== "") {
            if (
                typeof customAlias !== "string" ||
                !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)
            ) {
                return res.status(400).json({
                    error: "Custom alias must be 3-30 characters and contain only letters, numbers, hyphens or underscores",
                });
            }

            shortId = customAlias;
        } else {
            shortId = nanoid(8);
        }

        // Check whether alias is already taken
        const existingURL = await URL.findOne({ shortId });

        if (existingURL) {
            return res.status(409).json({
                error: "This short URL is already taken",
            });
        }

        const newURL = await URL.create({
            shortId,
            redirectURL: parsedURL.href,
            visitHistory: [],
            createdBy: req.user._id,
        });

        return res.status(201).json({
            id: newURL.shortId,
            shortURL: `${req.protocol}://${req.get("host")}/${newURL.shortId}`,
        });
    } catch (error) {
        console.error("URL creation error:", error);

        // Handle duplicate IDs in case of concurrent requests
        if (error.code === 11000) {
            return res.status(409).json({
                error: "This short URL is already taken",
            });
        }

        return res.status(500).json({
            error: "Failed to create short URL",
        });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;

        const result = await URL.findOne({
            shortId,
            createdBy: req.user._id,
        });

        if (!result) {
            return res.status(404).json({
                error: "Short URL not found",
            });
        }

        return res.status(200).json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error("Analytics error:", error);

        return res.status(500).json({
            error: "Failed to fetch analytics",
        });
    }
}

// for url deletion
async function handleDeleteURL(req, res) {
    try {
        const { shortId } = req.params;

        const deletedURL = await URL.findOneAndDelete({
            shortId,
            createdBy: req.user._id,
        });

        if (!deletedURL) {
            return res.status(404).json({
                error: "URL not found",
            });
        }

        return res.status(200).json({
            message: "URL deleted successfully",
            id: deletedURL.shortId,
        });
    } catch (error) {
        console.error("Delete URL error:", error);

        return res.status(500).json({
            error: "Failed to delete URL",
        });
    }
}


module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL,
};
