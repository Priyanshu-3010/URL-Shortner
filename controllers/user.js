
const { v4: uuid4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        await User.create({ name, email, password });

        return res.redirect("/login");
    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return res.status(409).send("Email already registered");
        }

        return res.status(500).send("Signup failed");
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email, password });

        if (!foundUser) {
            return res.status(401).render("login", {
                error: "Invalid email or password",
            });
        }

        const sessionId = uuid4();

        setUser(sessionId, foundUser);
        res.cookie("uid", sessionId, {
            httpOnly: true,
            sameSite: "lax",
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send("Login failed");
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
