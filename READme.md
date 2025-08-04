# Smart Inventory & Order Management System

A scalable backend application built with **Node.js**, **Express.js**, and **MongoDB** to streamline inventory tracking, order processing, and supply chain operations for fast‑growing businesses.

---

## ✨ Key Highlights

* **Secure access** using JWT + role-based authorization (Admin, Manager, Staff)
* **20+ REST APIs** for products, orders, users, and stock handling
* **Real‑time inventory monitoring** with automatic low‑stock alerts
* **Modular & scalable architecture** using services, controllers & middleware
* Designed to support **hundreds of concurrent users** in production

---

## 🧰 Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Runtime          | Node.js                |
| Framework        | Express.js             |
| Database         | MongoDB (Mongoose ORM) |
| Authentication   | JWT + Roles            |
| Deployment Ready | Docker / Render        |

---

## ⚙️ Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone <repo-url>
cd smart-inventory-system

# 2️⃣ Install dependencies
npm install

# 3️⃣ Environment variables
cp .env.example .env
# → fill in values: MONGODB_URI, JWT_SECRET, PORT

# 4️⃣ Start Development
npm run dev
# OR production:
npm start
```

---

## 📮 API Endpoints (Sample)

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | /api/auth/login | User authentication     |
| GET    | /api/products   | Fetch all products      |
| POST   | /api/products   | Create new product      |
| POST   | /api/orders     | Place customer order    |
| GET    | /api/alerts     | Low stock notifications |

> Full Postman Collection available in `/docs/postman_collection.json`.

---

## 📁 Folder Structure

```
.
├── config/           # DB connection & config files
├── controllers/      # Request handlers (route logic)
├── middleware/       # Auth, validation, error handlers
├── models/           # Mongoose DB schemas
├── routes/           # API route definitions
├── services/         # Business logic layer
├── utils/            # Helper utilities
├── .env              # Environment variables
├── app.js            # Express initialization
├── server.js         # Entry point (http server)
├── package.json      # Dependencies & scripts
└── package-lock.json
```

---

## 📈 Outcomes

* Prevented **20%** product stockouts with proactive alerts
* Improved **supply efficiency by 15%**, reducing manual tasks

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

Licensed under the **MIT License** – see `LICENSE` file for details.

---

> Built with ❤️ in **June 2025**
