# 🎯 CodeClash

A modern full-stack authentication system with a beautiful UI, built with the MERN stack (MongoDB, Express, React, Node.js).

![CodeClash](https://img.shields.io/badge/Status-Active-success)
![Node](https://img.shields.io/badge/Node-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🎨 **Modern UI** - Beautiful, responsive design with peach theme
- 📱 **Mobile-Friendly** - Fully responsive across all devices
- 🔒 **Password Security** - Bcrypt hashing with 10 rounds
- ✅ **Input Validation** - Email format & password length validation
- 🚀 **Fast Development** - Vite for lightning-fast frontend builds
- 🔄 **Auto-Refresh** - Nodemon for backend hot-reloading

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **CSS3** - Custom styling

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Divyanshu-s13/CodeClash.git
cd CodeClash
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret

# Start backend server
npm run dev
# Server runs on http://localhost:3000
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
# App runs on http://localhost:5173
```

### 4. Open your browser
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
codeClash/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── index.js           # Configuration management
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   └── user.js            # User schema
│   ├── routes/
│   │   └── auth.js            # Authentication routes
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   ├── package.json
│   └── server.js              # Express server entry
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx      # Login form
    │   │   ├── Register.jsx   # Registration form
    │   │   └── Profile.jsx    # User profile
    │   ├── api.js             # API client
    │   ├── App.jsx            # Root component
    │   ├── main.jsx           # React entry point
    │   └── styles.css         # Global styles
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Protected Routes
- `GET /api/profile` - Get user profile (requires JWT token)
  - Header: `Authorization: Bearer <token>`

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend**: Deploy to [Render](https://render.com)
**Frontend**: Deploy to [Vercel](https://vercel.com)

Both platforms offer free tiers perfect for getting started!

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=1h
MONGO_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing

### Test Backend API
```bash
# Test server is running
curl http://localhost:3000

# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'
```

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Divyanshu Singh**
- GitHub: [@Divyanshu-s13](https://github.com/Divyanshu-s13)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Render & Vercel for easy deployment
- React & Vite communities for excellent tools



---

Made with ❤️ by Divyanshu Singh
