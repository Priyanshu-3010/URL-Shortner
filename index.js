// const express = require("express");

// const urlRoute = require('./routes/url');
// const URL = require('./models/url');

// const { connectToMongoDB } = require("./connect");
// const app = express();

// const PORT = 8001;
// connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("connected to mongodb"));


// app.use(express.json());
// app.use("/url", urlRoute);

// app.get('/:shortId', async (req, res) => {
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate({
//         shortId
//     } , {$ push: {
//         visitHistory:Date.now(),
//     }})
// })

// app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));


const express = require("express");

const urlRoute = require("./routes/url");
const URL = require("./models/url");

const { connectToMongoDB } = require("./connect");

const app = express();
const PORT = 8001;

// Connect MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/url", urlRoute);

// Redirect route
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

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
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({
                error: "Short URL not found",
            });
        }

        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`server started at PORT: ${PORT}`);
});