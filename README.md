# Shortly — URL Shortener 🔗

A full-stack URL shortener built with **Node.js, Express.js, MongoDB, and EJS**. Create short links, customize aliases, track click analytics, and manage your URLs through a responsive dashboard.

## 🚀 Live Demo

**Live Website:** [Add Your Vercel Deployment URL Here](https://url-shortner-one-navy.vercel.app/)

## ✨ Features

* **URL Shortening:** Convert long URLs into short, shareable links.
* **Custom Aliases:** Create personalized short links.
* **User Authentication:** Secure signup and login functionality using JWT.
* **Password Security:** Hash passwords with bcrypt before storing them.
* **Click Analytics:** Track clicks and maintain visit history for each short URL.
* **Auto-Refreshing Analytics:** Update dashboard click counts every 5 seconds without reloading the page.
* **URL Management:** Copy and delete short links directly from the dashboard.
* **Input Validation:** Validate destination URLs and custom aliases.
* **Rate Limiting:** Help protect authentication endpoints against excessive requests.
* **Database Integration:** Store users, short URLs, and click history in MongoDB Atlas.
* **Responsive Dashboard:** Manage links through a clean, responsive interface.

## 🛠️ Tech Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | Backend framework and routing |
| MongoDB Atlas      | Cloud database                |
| Mongoose           | MongoDB object modeling       |
| EJS                | Server-side rendering         |
| HTML & CSS         | User interface and styling    |
| JavaScript         | Client-side interactions      |
| JWT                | Authentication                |
| bcrypt             | Password hashing              |
| cookie-parser      | Cookie handling               |
| express-rate-limit | Request rate limiting         |
| Vercel             | Deployment                    |

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/)
* npm
* A MongoDB database, such as MongoDB Atlas
* Git

### 1. Clone the repository

```bash
git clone https://github.com/Priyanshu-3010/URL-Shortner.git
cd URL-Shortner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=8001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
```

Replace the placeholder values with your own credentials.

**Never commit your `.env` file or expose database credentials and JWT secrets publicly.**

### 4. Start the application

```bash
npm start
```

If your project uses a different start script, check the `scripts` section of `package.json`.

Open your browser and visit:

```text
http://localhost:8001
```

## 📊 How It Works

1. A user signs up or logs in.
2. The authenticated user submits a destination URL.
3. The backend validates the URL and generates a short ID or accepts a custom alias.
4. The short URL and associated information are stored in MongoDB.
5. When someone visits the short URL, the application records the visit timestamp and redirects them to the original destination.
6. The dashboard retrieves analytics through an API endpoint and refreshes click counts automatically.

## 🔐 Security

* Passwords are hashed before storage.
* Authentication uses JWT-based sessions.
* Protected routes require authentication.
* URL creation and deletion are restricted to authenticated users.
* Input validation helps reject invalid URLs and aliases.
* Environment variables are used for sensitive configuration.

> **Deployment note:** Configure MongoDB Atlas Network Access to allow connections from your deployment environment without unnecessarily exposing the database.

## 🧪 Testing

Run the project's test suite with:

```bash
npm test
```

Ensure the test script in `package.json` is configured correctly for your environment.

## 📁 Project Structure

```text
URL-Shortner/
├── controllers/
│   └── url.js
├── middlewares/
│   └── auth.js
├── models/
│   ├── url.js
│   └── user.js
├── routes/
│   ├── staticRouter.js
│   ├── url.js
│   └── user.js
├── views/
│   ├── home.ejs
│   ├── login.ejs
│   └── signup.ejs
├── app.js
├── connect.js
├── index.js
├── package.json
└── .env
```

*Note: Adjust the folder and file names above to match your actual repository. Keep `.env` out of version control.*

## 🔮 Future Improvements

* QR code generation for short links
* Expiring links
* Password-protected short URLs
* Advanced analytics and charts
* Improved automated test coverage
* Bulk URL management

## 👨‍💻 Author

**Priyanshu Singh Shekhawat**

* GitHub: [@Priyanshu-3010](https://github.com/Priyanshu-3010)

---

If you find this project useful, consider giving the repository a ⭐.
