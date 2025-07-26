# 🎯 PathConnect – Senior-Guided Career Planning Platform

**PathConnect** helps college students plan their careers by learning from the **verified journeys of their own seniors** and generating **personalized AI-based roadmaps**.

> *"Follow real paths, not random advice."*

---

## ✅ What It Does

* Shows **career paths of seniors** with their projects, certifications, internships, and learning resources.
* Allows **filtering by domain/goal** (e.g., Software Development, Data Science).
* Generates an **AI roadmap** based on the user’s goals, year of study, and skills.
* Supports **secure login** using official college emails (`@vishnu.edu.in`).

---

## 🖥️ Pages & Navigation

1. **Landing Page**

   * Simple headline, subheading, and a CTA → *Login/Register*.

2. **Login/Register**

   * Fields: Name, Branch, Year, College Email.
   * Firebase Authentication (Email/Password + Google).

3. **Dashboard**

   * **Explore Career Paths** → Filter + list of seniors.
   * **AI Career Path Generator** → Form + generated roadmap.
   * **Profile** → User details and saved plans.

4. **Senior Detail Page**

   * Timeline layout with:

     * Certifications
     * Projects
     * Internships
     * Resources followed

---

## 🔧 Tech Stack

* **Frontend:** React (built in Cursor AI)
* **Backend:** Node.js with Gemini API (roadmap generation)
* **Authentication & Database:** Firebase (Auth + Firestore)
* **Hosting:** Firebase Hosting

---

## 🚀 Setup

### Prerequisites

* Node.js installed
* Firebase project configured
* Gemini API key

### Installation

```bash
git clone https://github.com/your-username/pathconnect.git
cd pathconnect
npm install
npm run dev
```

Backend:

```bash
cd gemini-backend
npm install
npm start
```

Add `firebaseConfig.js` and `.env`:

```env
GEMINI_API_KEY=your_key_here
```

---

## 🔒 Security

* Senior data stored in **Firebase Firestore** with access rules.
* `.env` files are excluded from version control.
* Only college email (`@vishnu.edu.in`) accounts can register.

---

## 📈 Future Enhancements

* Roadmap saving and bookmarking
* Analytics for most-followed paths
* Advanced filters (skills, companies, packages)

---
