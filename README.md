# NITHU FASHION WORLD 👑✨

> **Traditional Craftsmanship For A Brighter You**  
> *Stitching Dreams, Creating You*

A luxury fashion, bridal boutique, and custom tailoring e-commerce web application with **MongoDB Atlas Cloud Database** integration, designed with a luxury royal burgundy, cream, blush pink, and antique gold aesthetic.

---

## 🌸 Key Highlights & Architecture

- **Database**: Cloud-hosted **MongoDB Atlas** with singleton cached Mongoose connection for fast, serverless performance.
- **Product Catalog Management**: Real-time product creation, updating, stock toggling, and deletion synced with MongoDB Atlas.
- **Customer Directory & Profiles**: Customer registrations, profile edits, delivery addresses, lifetime order tracking, and direct WhatsApp messaging stored in MongoDB Atlas.
- **Instant Checkout**: Interactive Cart & Direct Checkout with automated WhatsApp order message drafting, UPI payment QR, and transaction persistence.
- **Tailoring Consultations**: Measurement bookings and Aari/Zardozi work inquiries with instant contact workflows.
- **Store Administration Console (`/admin`)**:
  - Live **MongoDB Atlas Connection Status** indicator with quick health checks.
  - 1-Click **"Seed Atlas"** catalog populate button.
  - Interactive **Customer Directory** with search by name, phone, address, and city.
  - Product catalog CRUD manager with live image selection and category filters.
  - Order fulfillment pipeline with status updates (*Processing → In Tailoring → Dispatched → Delivered*).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom luxury design tokens
- **Icons**: Lucide React
- **Animations & Effects**: Framer Motion, Canvas Confetti

---

## 🔑 Portal Access & Authentication

### 👑 Administrator Account
- **URL**: `/admin`
- Administrator access is strictly protected. Authorized admins authenticate via manual email & password verification backed by salted scrypt cryptographic hashing in MongoDB Atlas.
- No administrator credentials or bypass shortcuts are exposed publicly.

### 🛍️ Customer Account (Demo)
- **URL**: `/account`
- **Email**: `priya@example.com`
- **Password**: `user123`
- *(Or use the 1-click **Customer Demo Account** button in the Sign In modal)*

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/CodeDemon777/nithu-fashion-world.git
cd nithu-fashion-world
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.4hww0d3.mongodb.net/nithu_fashion_world?retryWrites=true&w=majority
```
*(Reference provided in `.env.example`)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel (Recommended Hosting)

This project is optimized for deployment on [Vercel](https://vercel.com):

1. **Import Repository**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select `nithu-fashion-world` from your GitHub account.

2. **Add Environment Variable**:
   - In the **Environment Variables** section, add:
     - **Key**: `MONGODB_URI`
     - **Value**: `mongodb+srv://<username>:<db_password>@cluster0.4hww0d3.mongodb.net/nithu_fashion_world?retryWrites=true&w=majority`

3. **Deploy**:
   - Click **"Deploy"**. Vercel will automatically build the Next.js application with zero configuration.

4. **Whitelist Vercel in MongoDB Atlas**:
   - Ensure your MongoDB Atlas cluster has IP `0.0.0.0/0` in **Network Access** so your Vercel deployment can query the database.

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── customers/       # Customer list, registration, profile update & login
│   │   ├── db-status/       # Live MongoDB Atlas connection & stats check
│   │   ├── orders/          # Order placement & customer spend sync
│   │   ├── products/        # Product catalog CRUD & auto-seeding
│   │   └── seed/            # 1-Click database seeder
│   ├── account/             # Customer profile & order tracking portal
│   ├── admin/               # Store Admin console, Customer directory & Catalog manager
│   ├── globals.css          # Design system, tokens, and animations
│   ├── layout.tsx           # Root layout with fonts, providers & modals
│   └── page.tsx             # Luxury storefront homepage
├── components/
│   ├── home/                # Hero, categories, services, featured, testimonials, Instagram
│   ├── layout/              # Navbar, announcement bar, mobile bottom navigation, footer
│   ├── modals/              # AuthModal, WhatsAppCheckout, CartDrawer, QuickView, BookService
│   ├── products/            # Product card with badges & quick actions
│   └── ui/                  # Floating WhatsApp button, logo, badges
├── context/
│   ├── AuthContext.tsx      # User authentication & MongoDB customer state
│   └── ShopContext.tsx      # Products, cart, wishlist, orders, & Atlas sync
├── lib/
│   ├── data.ts              # Seed data for categories, products, & services
│   ├── mongodb.ts           # Cached singleton MongoDB Atlas connection manager
│   └── types.ts             # TypeScript interfaces for Product, Customer, Order
├── models/
│   ├── Customer.ts          # Mongoose model for customer records
│   ├── Order.ts             # Mongoose model for customer orders
│   └── Product.ts           # Mongoose model for product catalog
├── .env.example             # Template for MongoDB Atlas connection
├── vercel.json              # Vercel deployment configuration
└── package.json
```

---

© 2024–2026 **NITHU FASHION WORLD**. All rights reserved.
