# Zerodha – Full Stack Trading Platform

A full-stack trading and portfolio management application inspired by Zerodha. This project includes a public-facing frontend, a backend REST API, and an interactive trading dashboard.

The application allows users to register, log in, manage watchlists, view holdings and positions, and place simulated stock orders.

## 🚀 Live Demo

| Application | Live URL |
|---|---|
| Frontend | https://zerodha-frontend-snowy.vercel.app |
| Trading Dashboard | https://zerodha-dashboard-one-eosin.vercel.app |
| Backend API | https://zerodha-backend-2ozm.onrender.com |

## ✨ Features

- **User Authentication:** Signup and login with JWT-based cookie authentication.
- **User Profile:** Retrieve authenticated user information.
- **Watchlist Management:** Search, add, and remove stocks.
- **Portfolio Dashboard:** View invested amount, current value, and profit/loss.
- **Holdings:** Display stock holdings and portfolio allocation.
- **Positions:** View trading positions.
- **Order Management:** Place simulated buy orders and view order history.
- **Portfolio Analytics:** Visualize portfolio allocation using charts.
- **Responsive UI:** Clean trading interface inspired by Zerodha.

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- JavaScript
- HTML5
- CSS3
- Axios

### Dashboard
- React.js
- React Router
- Material UI (MUI)
- Chart.js
- React Chart.js 2
- Axios

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcryptjs
- Cookie Parser
- CORS

### Database
- MongoDB
- Mongoose

### Deployment & Tools
- Git & GitHub
- Vercel
- Render
- MongoDB Atlas

## 📁 Project Structure

```text
Zerodha/
│
├── backend/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── schemas/
│   ├── util/
│   ├── index.js
│   └── package.json
│
├── dashboard/
│   ├── public/
│   ├── src/
│   ├── build/
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── build/
│   └── package.json
│
├── DEPLOYMENT.md
├── README.md
└── .gitignore
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas connection
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Karan341/Zerodha.git
cd Zerodha
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=3002
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

Backend runs at:

`http://localhost:3002`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

`http://localhost:3000`

### 4. Dashboard Setup

Open another terminal:

```bash
cd dashboard
npm install
npm start
```

Dashboard runs at:

`http://localhost:3001`

## 🔐 Environment Variables

For production deployment, configure the following environment variables.

### Frontend – Vercel

```env
REACT_APP_API_URL=https://zerodha-backend-2ozm.onrender.com
REACT_APP_DASHBOARD_URL=https://zerodha-dashboard-one-eosin.vercel.app
```

### Dashboard – Vercel

```env
REACT_APP_API_URL=https://zerodha-backend-2ozm.onrender.com
REACT_APP_FRONTEND_URL=https://zerodha-frontend-snowy.vercel.app
```

### Backend – Render

```env
MONGO_URL=your_mongodb_connection_string
TOKEN_KEY=your_jwt_secret
NODE_ENV=production
```

**Important:** Never commit `.env` files, MongoDB credentials, or JWT secrets to GitHub.

For detailed deployment instructions, refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/profile` | Retrieve user profile |
| POST | `/logout` | Logout user |
| GET | `/watchlist` | Retrieve watchlist |
| PUT | `/watchlist` | Update watchlist |
| GET | `/allHoldings` | Retrieve holdings |
| GET | `/allPositions` | Retrieve positions |
| GET | `/orders` | Retrieve order history |
| POST | `/newOrder` | Place a simulated order |

Protected endpoints require valid authentication.

## 🔄 Authentication Flow

1. User registers with email, username, and password.
2. Password is securely hashed using bcryptjs.
3. User logs in with registered credentials.
4. Backend generates a JWT authentication token.
5. Token is stored in a cookie.
6. Protected API endpoints verify the authentication token.
7. User can access portfolio features after successful authentication.
8. Logout clears the authentication cookie.

## 📊 Demo & Market Data

- The application uses sample stock and portfolio data.
- It does not currently connect to a live stock market feed.
- Orders are simulated for demonstration purposes.
- It is not connected to a real brokerage account.

## 🚀 Deployment

The project is deployed using:

- **Frontend:** Vercel
- **Dashboard:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production environment variables, CORS configuration, cookie settings, and deployment verification steps are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## 👨‍💻 Author

**Karan Kushwaha**

- GitHub: https://github.com/Karan341
- LinkedIn: https://www.linkedin.com/in/karan-9889472a8/

---

⭐ If you find this project interesting, consider giving this repository a star!

*This project is developed for educational and portfolio purposes.*
