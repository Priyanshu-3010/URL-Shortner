const bcrypt = require("bcrypt");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send("Password must be at least 8 characters long");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).send("Email already registered");
    }

    return res.status(500).send("Signup failed");
  }
}

async function handleUserLogout(req, res) {
  return res.clearCookie("uid").redirect("/login");
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        error: "Email and password are required",
      });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(401).render("login", {
        error: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).render("login", {
        error: "Invalid email or password",
      });
    }

    const token = setUser(foundUser);

    return res
      .cookie("uid", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send("Login failed");
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
};
