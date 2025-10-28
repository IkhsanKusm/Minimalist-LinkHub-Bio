# Onesi (Minimalist LinkHub) - Full-Stack SaaS

[![Vercel Deployment Status](https://vercel.com/miwyzards-projects/linkhub-frontend/badge)](https://linkhub-frontend-mauve.vercel.app/)

A minimalist, full-stack SaaS application built as a developer portfolio piece. It provides users with a single, customizable, and professional landing page for all their links, similar to Linktree or Beacons, with a focus on a zero-capital, scalable MVP approach.

**Live Demo:** [https://linkhub-frontend-mauve.vercel.app/](https://linkhub-frontend-mauve.vercel.app/)

---

## ✨ Features

* **User Authentication:** Secure Sign Up, Login, Logout using JWT and password hashing (Bcrypt).
* **Dashboard:** Private, authenticated area for managing profile, links, products, and collections.
* **Profile Management:** Update username, bio, and profile picture (via external URL).
* **Link Management:** Full CRUD (Create, Read, Update, Delete) for links..js]
    * Supports Standard, Image, and Video link types.
    * Drag & Drop reordering.
    * Hover preview for Image and Video links.
* **Collections:** Organize links into user-defined collections..js]
* **Shop Management (Pro):** Dedicated section to manage products (CRUD)..js]
* **Theme Customization:** Apply different visual themes to the public profile.
* **Analytics (Pro):** Track link and product clicks, view performance over time, and see top content.
* **Public Profile Page:** Dynamic, responsive page (`/:username`) displaying user's profile, links, products, and collections with theme support..js]
* **Contact Form:** Integrated Google Form with automated responses via Google Apps Script.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Swiper, Recharts, @dnd-kit
* **Backend:** Node.js (via Vercel Serverless Functions)
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Deployment:** Vercel

---

## 🚀 Getting Started Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/IkhsanKusm/Minimalist-LinkHub-Bio.git](https://github.com/IkhsanKusm/Minimalist-LinkHub-Bio.git)
    cd Minimalist-LinkHub-Bio-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    * Create a `.env` file in the root directory.
    * Add your MongoDB connection string and JWT secret:
        ```env
        MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
        JWT_SECRET=YOUR_SUPER_SECRET_KEY
        ```
4.  **Link to Vercel & Pull Dev Variables:**
    * Install Vercel CLI: `npm install -g vercel`
    * Login: `vercel login`
    * Link project: `vercel link` (Follow prompts, link to a new or existing Vercel project)
    * Pull variables: `vercel env pull .env.development.local`
5.  **Run the development server:**
    ```bash
    vercel dev
    ```
    The application will be available at `http://localhost:3000` (or another port if 3000 is busy).

---

## ☁️ Deployment

This project is configured for easy deployment to Vercel. Deployments are automatically triggered upon pushing to the main branch connected to the Vercel project.

Ensure `MONGO_URI` and `JWT_SECRET` environment variables are set in the Vercel project settings for the **Production** environment.

---

## 🤝 Contributing

This project is primarily a portfolio piece. Contributions, issues, and feature requests are welcome but may be addressed based on personal availability.

---

## 📄 License

[Specify your license here, e.g., MIT License](https://choosealicense.com/licenses/mit/)