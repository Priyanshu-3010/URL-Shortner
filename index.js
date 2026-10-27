
require("dotenv").config();

const app = require("./app");
const { connectToMongoDB } = require("./connect");

const PORT = process.env.PORT || 8001;
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/short-url";

async function startServer() {
    try {
        await connectToMongoDB(MONGO_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server started at PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
