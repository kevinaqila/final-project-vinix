# Vinix Freelance Platform# 🚀 VINIX - Platform Freelance Marketplace Keuangan



A modern freelance marketplace platform built with React, Node.js, Express, and MongoDB.**Status:** ✅ PRODUCTION READY



## 🚀 Features## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)

- **User Authentication**: Secure signup/login for clients and freelancers- [Tech Stack](#-tech-stack)

- **Service Marketplace**: Browse and purchase digital services- [Fitur Utama](#-fitur-utama)

- **Order Management**: Complete workflow from ordering to delivery- [Setup & Installation](#-setup--installation)

- **Real-time Messaging**: Instant communication between clients and freelancers- [Struktur Project](#-struktur-project)

- **Review System**: Rate and review completed services- [API Endpoints](#-api-endpoints)

- **Wallet System**: Secure payment handling with escrow- [Development](#-development)

- **File Uploads**: Cloud storage for service deliverables

- **Responsive Design**: Mobile-friendly interface---



## 🛠️ Tech Stack## 🎯 Tentang Project



### Frontend**VINIX** adalah platform marketplace freelance yang khusus melayani jasa keuangan (laporan keuangan, konsultasi pajak, audit internal, dll). Platform ini menghubungkan clients yang membutuhkan jasa keuangan dengan freelancer yang berpengalaman.

- **React 18** with Vite

- **Zustand** for state management### Fitur Utama

- **Tailwind CSS** for styling- ✅ User Authentication dengan JWT

- **React Router** for navigation- ✅ Role-based System (Client & Freelancer)

- **Socket.io Client** for real-time features- ✅ Service Management (Create, Update, Delete, Browse)

- ✅ Order Management (Full Workflow)

### Backend- ✅ Payment & Wallet System

- **Node.js** with Express- ✅ Real-time Messaging dengan Socket.io

- **MongoDB** with Mongoose- ✅ Review & Rating System

- **JWT** for authentication- ✅ File Upload & Management

- **Socket.io** for real-time messaging- ✅ Responsive Design (Mobile-friendly)

- **Cloudinary** for file uploads

- **Nodemailer** for email notifications---



## 📦 Installation## 🛠️ Tech Stack



### Prerequisites### Backend

- Node.js 18+- **Node.js** & **Express.js** - RESTful API

- MongoDB Atlas account- **MongoDB** & **Mongoose** - Database

- Git- **JWT** - Authentication

- **Socket.io** - Real-time messaging

### Local Development- **Multer** - File uploads

- **Bcryptjs** - Password hashing

1. **Clone the repository**- **Dotenv** - Environment variables

   ```bash

   git clone https://github.com/yourusername/vinix-freelance.git### Frontend

   cd vinix-freelance- **React 18** - UI Framework

   ```- **React Router v6** - Navigation

- **Zustand** - State Management

2. **Setup Backend**- **Axios** - HTTP Client

   ```bash- **Tailwind CSS** - Styling

   cd backend- **Lucide React** - Icons

   npm install- **React Hot Toast** - Notifications

   cp .env.example .env- **Vite** - Build tool

   # Edit .env with your configuration

   npm run dev---

   ```

## 📁 Struktur Project

3. **Setup Frontend**

   ```bash```

   cd ../frontendFinalProject_WebDev/

   npm install├── backend/

   cp .env.example .env│   ├── src/

   # Edit .env with your configuration│   │   ├── controllers/         # Request handlers

   npm run dev│   │   ├── routes/              # API routes

   ```│   │   ├── models/              # Database schemas

│   │   ├── middleware/          # Auth & validation

4. **Access the application**│   │   ├── lib/                 # Utilities

   - Frontend: http://localhost:5173│   │   └── index.js             # Server entry

   - Backend: http://localhost:5050│   └── package.json

│

## 🚀 Deployment├── frontend/

│   ├── src/

### Vercel Monorepo Deployment│   │   ├── pages/               # Page components

│   │   ├── components/          # Reusable components

1. **Push to GitHub**│   │   ├── store/               # Zustand stores

   ```bash│   │   ├── lib/                 # Utilities

   git add .│   │   ├── hooks/               # Custom hooks

   git commit -m "Ready for deployment"│   │   ├── App.jsx              # App router

   git push origin main│   │   └── main.jsx             # Entry point

   ```│   └── package.json

│

2. **Deploy to Vercel**└── README.md

   - Go to [vercel.com](https://vercel.com)```

   - Import your GitHub repository

   - Vercel will auto-detect the `vercel.json` configuration---



3. **Environment Variables**## 🚀 Setup & Installation

   Add these in Vercel project settings:

### Prerequisites

   ```- Node.js (v16+)

   # Database- MongoDB (local atau Atlas)

   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/vinix_prod- npm atau yarn



   # JWT### Backend Setup

   JWT_SECRET=your_super_secure_jwt_secret_here

```bash

   # Email (optional)cd backend

   EMAIL_USER=your_email@gmail.comnpm install

   EMAIL_PASS=your_app_password

# Create .env file

   # Frontendcat > .env << EOF

   VITE_API_URL=https://your-vercel-domain.vercel.appPORT=5050

   ```MONGODB_URI=mongodb://localhost:27017/vinix-platform

JWT_SECRET=your_secret_key_here

4. **Database Setup**JWT_EXPIRE=7d

   - Create MongoDB Atlas clusterNODE_ENV=development

   - Import sample data if neededEOF

   - Update connection string in environment variables

npm start

## 🔧 Configuration```



### Environment Variables### Frontend Setup



#### Backend (.env)```bash

```bashcd frontend

NODE_ENV=productionnpm install

PORT=5050npm run dev

MONGODB_URL=mongodb+srv://...```

JWT_SECRET=your_secret_here

EMAIL_USER=your_email@gmail.com**Access:** http://localhost:5174

EMAIL_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=...---

CLOUDINARY_API_KEY=...

CLOUDINARY_API_SECRET=...## 🔌 API Endpoints

```

### Auth

#### Frontend (.env)- `POST /api/auth/signup` - Register user

```bash- `POST /api/auth/login` - Login user

VITE_API_URL=https://your-vercel-domain.vercel.app- `GET /api/auth/verify` - Verify token

```

### Services

## 📁 Project Structure- `GET /api/services` - Get all services

- `GET /api/services/:id` - Get service detail

```- `POST /api/services` - Create service (freelancer)

vinix-freelance/- `PUT /api/services/:id` - Update service

├── backend/- `DELETE /api/services/:id` - Delete service

│   ├── server.js          # Vercel serverless entry point

│   ├── src/### Orders

│   │   ├── controllers/   # Route handlers- `GET /api/orders` - Get user orders

│   │   ├── models/        # MongoDB schemas- `GET /api/orders/:id` - Get order detail

│   │   ├── routes/        # API routes- `POST /api/orders` - Create order

│   │   ├── middleware/    # Custom middleware- `PUT /api/orders/:id/accept` - Accept order

│   │   └── lib/           # Utilities- `PUT /api/orders/:id/submit` - Submit work

│   ├── uploads/           # File uploads- `PUT /api/orders/:id/approve` - Approve order

│   └── package.json

├── frontend/### Reviews

│   ├── src/- `GET /api/reviews/:serviceId` - Get reviews

│   │   ├── components/    # Reusable components- `POST /api/reviews` - Create review

│   │   ├── pages/         # Page components

│   │   ├── store/         # Zustand stores### Wallet

│   │   ├── lib/           # Utilities- `GET /api/wallet/balance` - Get balance

│   │   └── hooks/         # Custom hooks- `POST /api/wallet/withdraw` - Request withdrawal

│   ├── public/            # Static assets

│   └── package.json### Messages

├── vercel.json            # Vercel configuration- `GET /api/messages/:orderId` - Get messages

└── README.md- `POST /api/messages` - Send message (Socket.io)

```

---

## 🔒 Security

## 💻 Development

- JWT authentication with secure secrets

- Password hashing with bcrypt### Running Both Server & Client

- CORS configuration for production

- Input validation and sanitization**Terminal 1 (Backend):**

- File upload restrictions```bash

cd backend

## 📱 API Endpointsnpm start

```

### Authentication

- `POST /api/auth/signup` - User registration**Terminal 2 (Frontend):**

- `POST /api/auth/login` - User login```bash

- `GET /api/auth/verify` - Token verificationcd frontend

npm run dev

### Services```

- `GET /api/services` - Get all services

- `POST /api/services` - Create service (freelancers only)### Build Production

- `GET /api/services/:id` - Get service details

**Backend:**

### Orders```bash

- `POST /api/orders` - Create ordercd backend

- `GET /api/orders/my-orders` - Get user ordersnpm start

- `PUT /api/orders/:id/accept` - Accept order (freelancers)```



### Messages**Frontend:**

- `GET /api/messages/conversations` - Get conversations```bash

- `GET /api/messages/:orderId` - Get messages for ordercd frontend

- `POST /api/messages` - Send messagenpm run build

# Output: dist/

## 🤝 Contributing```



1. Fork the repository---

2. Create a feature branch

3. Commit your changes## 🧪 Testing

4. Push to the branch

5. Open a Pull RequestLihat `COMPREHENSIVE_TESTING_GUIDE.md` untuk detailed test cases.



## 📄 License### Quick Test Flow

1. Register sebagai client

This project is licensed under the ISC License.2. Register sebagai freelancer

3. Browse services

## 📞 Support4. Create service (sebagai freelancer)

5. Order service (sebagai client)

For support, email support@vinix.com or open an issue on GitHub.6. Accept order (sebagai freelancer)

7. Submit work dengan file

---8. Approve (sebagai client)

9. Leave review

**Built with ❤️ for the freelance community**
---

## 📝 Code Standards

- ✅ ES6+ syntax
- ✅ Consistent naming conventions
- ✅ Error handling di setiap endpoint
- ✅ Input validation
- ✅ Clean code practices
- ✅ Responsive design

---

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing dengan bcrypt
- ✅ File upload validation
- ✅ Input sanitization
- ✅ CORS configured
- ✅ Error handling

---

## 📞 Support

Untuk pertanyaan atau issues, silakan check dokumentasi atau kontak developer.

---

**Last Updated:** November 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
