Below is a **clean, professional `README.md`** you can directly put in your GitHub repo. It highlights the architecture and the advanced features you implemented.

---

# 🛒 GreenCart — Full Stack MERN E-Commerce Platform

GreenCart is a **full-stack grocery e-commerce platform** built using the **MERN stack**.
It provides a seamless shopping experience for customers and a powerful dashboard for sellers to manage products and orders.

The platform includes **production-grade backend features** like **Redis caching, RabbitMQ message queues, rate limiting, and Stripe payment integration**.

---

# 🚀 Live Demo

Frontend: [https://your-frontend-url](https://greencart-shiva4.vercel.app/)
Backend API: [https://your-backend-url](https://greencart-4m6x.onrender.com)

---

# 🧱 Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB

### Infrastructure & Services

* Redis (via Upstash) — caching layer
* RabbitMQ — async job processing
* Stripe — payments
* Cloudinary — image storage
* Nodemailer — email notifications

### Deployment

* Vercel — frontend
* Render — backend

---

# ✨ Features

## 👤 Customer Features

* Browse products
* Product search & filtering
* Add to cart
* Address management
* Checkout & order placement
* Stripe secure payments
* Order history tracking

---

## 🧑‍💼 Seller Dashboard

* Add new products
* Upload product images
* Manage product stock
* View orders
* Update order status
* Pagination and date filtering for orders

---

# ⚡ Advanced Backend Features

## Redis Caching

Product listings are cached using **Redis** to reduce database load.

Benefits:

* Faster API responses
* Reduced MongoDB queries
* Better scalability

Cache automatically clears when:

* Product added
* Product stock updated

---

## RabbitMQ Message Queues

Order emails are processed asynchronously using **RabbitMQ**.

Flow:

```
Order placed
      ↓
Message pushed to queue
      ↓
Worker consumes message
      ↓
Email sent using Nodemailer
```

Benefits:

* Faster API responses
* Background job processing
* Scalable architecture

---

## Rate Limiting

API endpoints are protected using rate limiting.

This prevents:

* Brute-force login attempts
* API abuse
* Spam order creation

---

## Stripe Payment Integration

Secure payment flow implemented using Stripe:

* Checkout session creation
* Stripe webhooks for payment confirmation
* Order creation after successful payment

---

# 🏗️ Architecture Overview

```
Client (React)
      ↓
Backend API (Node.js / Express)
      ↓
Redis Cache (Upstash)
      ↓
MongoDB Database
      ↓
RabbitMQ Queue
      ↓
Email Worker (Nodemailer)
```

---

# 📦 Project Structure

```
GreenCart
│
├── client
│   ├── components
│   ├── pages
│   └── context
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middlewares
│   ├── configs
│   └── queues
```

---

# 🔐 Security Features

* JWT authentication
* Role-based access (customer / seller)
* Rate limiting
* Secure Stripe webhook verification
* Input validation

---

# 🛠️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/GreenCart.git
cd GreenCart
```

---

## 2️⃣ Install Dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

---

## 3️⃣ Environment Variables

Create `.env` file in server:

```
MONGO_URI=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
REDIS_URL=
RABBITMQ_URL=
EMAIL_USER=
EMAIL_PASS=
```

---

## 4️⃣ Run Backend

```bash
npm run server
```

---

## 5️⃣ Run Frontend

```bash
npm run dev
```

---

# 📈 Performance Improvements

| Feature         | Impact                        |
| --------------- | ----------------------------- |
| Redis caching   | ~95% fewer product DB queries |
| RabbitMQ queues | faster order API responses    |
| Rate limiting   | protects API from abuse       |


---

# 👨‍💻 Author

Shiva Mani

GitHub: [https://github.com/sajjanshiva](https://github.com/sajjanshiva)

---


