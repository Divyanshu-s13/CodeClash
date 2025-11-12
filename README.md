<<<<<<< HEAD
<<<<<<< HEAD
# Authentication App - Full Stack

A complete authentication application with Node.js/Express backend and React frontend.


## Project Structure

```
codeClash/
├── server/          # Node.js Express backend
│   ├── models/      # MongoDB schemas (User)
│   ├── routes/      # API routes (auth)
│   ├── middleware/  # Authentication middleware
│   ├── index.js     # Server entry point
│   ├── package.json
│   └── .env         # Environment variables
└── client/          # React frontend
    ├── src/
    │   ├── components/  # Login, SignUp components
    │   ├── pages/       # Dashboard page
    │   ├── services/    # API service
    │   ├── App.js
    │   └── index.js
    ├── public/
    └── package.json
```

## Features

✅ User Registration (Sign Up)
✅ User Authentication (Login)
✅ JWT Token-based Authentication
✅ MongoDB Database Integration
✅ Password Hashing with bcryptjs
✅ Protected Routes
✅ User Dashboard
✅ Responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (database URL already configured)

## Installation & Setup

### 1. Server Setup

```bash
cd server
npm install
```

The `.env` file is already configured with your MongoDB URL. You can optionally change `JWT_SECRET` for production.

### 2. Client Setup

```bash
cd client
npm install
```

## Running the Application

### Start the Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start the Client (in a new terminal)

```bash
cd client
npm start
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes

- **POST** `/api/auth/signup` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: `{ success, token, user }`

- **POST** `/api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, token, user }`

- **GET** `/api/auth/me` - Get current user (requires JWT token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

## How It Works

1. **Sign Up**: User enters username, email, and password. Password is hashed using bcryptjs before storing in MongoDB.

2. **Login**: User enters email and password. Password is verified against the hashed password in the database. If valid, a JWT token is issued.

3. **Token Storage**: JWT token is stored in browser's localStorage for future authenticated requests.

4. **Protected Routes**: The `/api/auth/me` endpoint requires a valid JWT token in the Authorization header.

5. **Dashboard**: After login, user sees their profile information on the dashboard.

6. **Logout**: Clears the token from localStorage.

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS** - Styling

## Error Handling

- Invalid credentials return 401 Unauthorized
- Missing required fields return 400 Bad Request
- Duplicate username/email return 400 Bad Request
- Server errors return 500 Internal Server Error

## Security Notes

⚠️ **For Production:**
1. Change the `JWT_SECRET` in `.env` to a strong random string
2. Use HTTPS instead of HTTP
3. Add rate limiting to prevent brute force attacks
4. Implement refresh tokens for better security
5. Add email verification for signup
6. Use environment-specific configurations

## Troubleshooting

**Connection Error**: Make sure both server and client are running and MongoDB connection is active.

**CORS Error**: Server has CORS enabled. If issues persist, check that proxy in `package.json` is set correctly.

**Port Already in Use**: Change PORT in server `.env` file or stop the process using the port.

## Future Enhancements

- Email verification
- Password reset functionality
- OAuth integration (Google, GitHub)
- Refresh tokens
- Role-based access control
- Profile update functionality
=======
# capstone01
>>>>>>> 660a99a (Initial commit)
=======
⚔️ CodeClash — Real-Time 1v1 Coding Battle Platform

CodeClash is a real-time competitive coding platform where two players go head-to-head to solve coding problems faster than each other. Built for coders who love speed, logic, and competition.

🚀 Features

⚡ Real-Time Battles: Compete 1v1 in live coding duels.

🧩 Dynamic Problem Generation: Randomized questions by difficulty (Easy, Medium, Hard).

🧠 Code Execution Sandbox: Run and test solutions instantly in multiple languages.

💬 Live Match Updates: See your opponent’s progress in real time (without code leaking).

🏆 Scoring System: Points based on accuracy, efficiency, and speed.

👥 Matchmaking System: Automatically pairs players of similar skill levels.

🔒 Secure Backend: Safe user authentication and protected code execution environment.

🎨 Modern UI: Smooth and responsive frontend with a focus on user experience.

🧱 Tech Stack
Frontend

React.js

Tailwind CSS / Bootstrap

Socket.IO (for real-time updates)

Backend

Node.js + Express

Socket.IO (WebSocket communication)

MongoDB / PostgreSQL (for user data, match history, and problems)

Code Execution

Docker-based sandbox / Judge0 API (for safe code execution)

Hosting

Frontend: Vercel / Netlify

Backend: Render / Railway / AWS

Database: MongoDB Atlas / Supabase

⚙️ Installation & Setup
# Clone the repository
git clone https://github.com/<your-username>/codeclash.git
cd codeclash

# Install dependencies
npm install

# For development mode
npm run dev

# For backend (if separate)
cd server
npm install
npm run dev


Make sure to configure environment variables before running the app.

🔐 Environment Variables

Create a .env file in your project root and add the following variables:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

🧩 How It Works

Join a Battle Lobby → Players can create or join an available room.

Match Starts → A coding problem is displayed to both participants.

Code & Submit → Players write and submit their solutions in real time.

Judge & Score → Code is compiled, tested, and scored instantly.

Winner Declared → First to pass all test cases (or highest score) wins!

🧠 Future Enhancements

👑 Global leaderboard

🧾 Profile stats & history tracking

🤝 Team vs Team battles

💻 Integrated code editor themes

🌍 Multi-language support

🧩 AI-based problem difficulty adjustment

🧑‍💻 Contributing

Contributions are welcome!
If you’d like to improve CodeClash, feel free to:

Fork this repository

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Add feature")

Push and open a Pull Request
>>>>>>> e63cf79 (readme update)
