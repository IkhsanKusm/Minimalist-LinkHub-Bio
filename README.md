# Onesi - Minimalist Link-in-Bio SaaS (Zero-Capital MVP)

[![Vercel Deployment Status](https://vercel.com/miwyzards-projects/linkhub-frontend/deploy-status)](https://onesi.vercel.app/)

Live Demo: [https://onesi.vercel.app/]

## Overview

Onesi (formerly LinkHub) is a full-stack SaaS application built as a portfolio project demonstrating end-to-end development skills and strategic business thinking. It provides users with a single, customizable, and professional landing page for all their links, similar to Linktree or Beacons, but built with a focus on a zero-capital, scalable MVP.

This project was built from scratch, covering the entire software development lifecycle, including planning, design, backend/API development, frontend development, and deployment.

## Key Features

### User Features (Freemium Model)

* **Authentication:** Secure user sign-up, log-in, and log-out with email/password.
* **Dashboard:** Private area to manage profile, links, collections, and view analytics.
* **Profile Management:** Update username, bio, and profile picture (via external URL).
* **Link Management:**
    * Unlimited links (Standard, Image, Video [Pro]).
    * Intuitive drag-and-drop reordering.
    * CRUD operations (Create, Read, Update, Delete).
    * Live URL validation and preview in the editor.
    * Hover previews for links in the dashboard.
* **Collections:** Organize links into categories.
* **Theme Customization:** Choose from several themes to personalize the public page.
* **Public Profile Page:**
    * Unique URL (`/username`).
    * Displays profile info, links, and products.
    * Dynamic layout featuring stories, carousels (videos, image gallery), product grid, and standard links.
    * Collection tabs for filtering content.
    * Image download feature.
* **Contact Form:** Integrated Google Form with automated responses via Apps Script.

### Pro Features

* **Mini-Shop:** Dedicated dashboard section to manage and display products (image, title, price, description, external purchase link).
* **Detailed Analytics:** Track clicks over time (7d, 30d, 90d), view top-performing links and products.
* **Premium Themes:** Access to exclusive themes.
* **(Manual Upgrade Process):** Implemented via Google Form/direct contact to validate the business model without payment gateway costs.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Swiper, Recharts, dnd-kit
* **Backend:** Node.js Serverless Functions (on Vercel)
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens), bcryptjs for password hashing
* **Deployment:** Vercel (Frontend & Serverless Functions)
* **Contact Form Automation:** Google Forms + Google Apps Script

## Getting Started Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/IkhsanKusm/Minimalist-LinkHub-Bio.git](https://github.com/IkhsanKusm/Minimalist-LinkHub-Bio.git)
    cd Minimalist-LinkHub-Bio/Minimalist-LinkHub-Bio-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * Create a `.env` file in the root directory.
    * Add your MongoDB connection string and JWT secret:
        ```env
        MONGO_URI=your_mongodb_atlas_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        ```
4.  **Sync environment variables with Vercel CLI (for `vercel dev`):**
    * Install Vercel CLI: `npm i -g vercel`
    * Log in: `vercel login`
    * Link project: `vercel link` (Follow prompts, link to your Vercel project)
    * Pull dev variables: `vercel env pull .env.development.local`
5.  **Run the development server:**
    ```bash
    vercel dev
    ```
    The application will be available at `http://localhost:3000` (or the port specified by `vercel dev`).

## Deployment

This project is configured for easy deployment to Vercel:
1.  Ensure your `MONGO_URI` and `JWT_SECRET` are set as **Production** Environment Variables in your Vercel project settings.
2.  Make sure MongoDB Atlas Network Access allows connections from `0.0.0.0/0`.
3.  Push your code to the connected GitHub branch, or run:
    ```bash
    vercel --prod
    ```

## Project Structure

* `/api`: Contains Vercel Serverless Functions handling backend logic.
* `/public`: Static assets.
* `/src`: Frontend React application source code.
    * `/src/backend`: Shared backend logic (models, DB connection, utils, middleware) used by serverless functions.
    * `/src/components`: Reusable React components.
    * `/src/context`: React Context for global state (e.g., Auth).
    * `/src/pages`: Top-level page components.
    * `/src/utils`: Frontend utility functions.
* `vercel.json`: Vercel configuration (rewrites, headers).

## Future Development Ideas

* Persist drag-and-drop order for links, products, and collections.
* More advanced analytics (e.g., referrers, locations).
* Custom domain support.
* Social logins.
* Automated payment gateway integration.