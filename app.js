require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { connectToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const { restrictToLoggedinUserOnly } = require("./middelwares/auth");

const app = express();

app.set("trust proxy", 1);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MongoDB connection for serverless requests
const MONGO_URI = process.env.MONGO_URI;

let dbConnectionPromise;

async function ensureDBConnection() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!MONGO_URI) {
        throw new Error("MONGO_URI is missing in environment variables");
    }

    if (!dbConnectionPromise) {
        dbConnectionPromise = connectToMongoDB(MONGO_URI).catch((error) => {
            dbConnectionPromise = null;
            throw error;
        });
    }

    await dbConnectionPromise;
}

// Ensure database connection before handling routes
app.use(async (req, res, next) => {
    try {
        await ensureDBConnection();
        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        res.status(503).json({
            error: "Database connection unavailable",
        });
    }
});

// Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

// Redirect route
app.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;

    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { returnDocument: "after" }
        );

        if (!entry) {
            return res.status(404).json({
                error: "Short URL not found",
            });
        }

        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("Redirect error:", error.message);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

module.exports = app;
