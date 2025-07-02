# DO IT! - Task Management Platform

A full-stack task management platform that connects clients with skilled providers. Clients can post tasks and receive bids from providers, while providers can browse available tasks and submit proposals.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Database Models](#database-models)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Clients:

- **Task Management**: Post, edit, and delete tasks
- **Bid Management**: View and manage bids from providers
- **Task Assignment**: Assign tasks to selected providers
- **Dashboard**: Track task statistics and progress
- **Reviews**: Rate and review completed work

### For Providers:

- **Task Discovery**: Browse available tasks by category
- **Bidding System**: Submit proposals with custom pricing
- **Dashboard**: Manage applications and track earnings
- **Profile Management**: Showcase skills and experience
- **Task Completion**: Update task status and complete work

### General Features:

- **Authentication**: Secure user registration and login
- **Role-based Access**: Separate interfaces for clients and providers
- **Real-time Updates**: Live task and bid updates
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Toggle between light and dark themes

## 🛠 Tech Stack

### Frontend:

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Formik & Yup** - Form handling and validation

### Backend:

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/umarprivit/just_do_it
cd
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
yarn install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/Tasker

# Install dependencies
yarn install

# Create environment file (if needed)
cp .env.example .env
```

### 4. Database Setup

Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

### 5. Run the Application

**Start Backend Server:**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

**Start Frontend Development Server:**

```bash
cd frontend/Tasker
npm run dev
```

The frontend will run on `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Database
MONGO_URI=mongodb://localhost:27017/do-it-platform

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables (.env)

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api

# Other configurations
VITE_APP_NAME=DO IT!
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword",
  "role": "client" // or "provider"
}
```

#### Verify OTP

```http
POST /users/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Login

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### User Endpoints

#### Get Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### Search Providers

```http
GET /users/providers?skills=JavaScript,React&location=New York
```

### Task Endpoints

#### Create Task (Client only)

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build a React Website",
  "description": "Need a modern React website with responsive design",
  "category": "Web Development",
  "location": "Remote",
  "budget": 2500,
  "deadline": "2025-08-15",
  "skillsRequired": ["React", "JavaScript", "CSS"],
  "urgency": "high"
}
```

#### Get All Tasks

```http
GET /tasks?page=1&limit=10&category=Web Development&location=Remote
```

#### Get Single Task

```http
GET /tasks/:id
```

#### Get My Tasks (Client)

```http
GET /tasks/my-tasks
Authorization: Bearer <token>
```

#### Update Task (Client only)

```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "description": "Updated description",
  "budget": 3000
}
```

#### Delete Task (Client only)

```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Bidding Endpoints

#### Submit Bid (Provider only)

```http
POST /tasks/:id/bid
Authorization: Bearer <token>
Content-Type: application/json

{
  "bidAmount": 2000,
  "proposal": "I can complete this project in 3 weeks with high quality",
  "estimatedDuration": "3 weeks"
}
```

#### Get Task Bids (Client only)

```http
GET /tasks/:id/bids
Authorization: Bearer <token>
```

#### Get My Bids (Provider only)

```http
GET /tasks/my-bids
Authorization: Bearer <token>
```

#### Assign Task to Provider (Client only)

```http
POST /tasks/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "bidId": "bid-object-id"
}
```

### Review Endpoints

#### Create Review

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task-object-id",
  "reviewedUserId": "user-object-id",
  "rating": 5,
  "comment": "Excellent work, highly recommended!"
}
```

#### Get User Reviews

```http
GET /reviews/:userId
```

### Transaction Endpoints

#### Create Transaction

```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task-object-id",
  "amount": 2500,
  "type": "payment"
}
```

#### Get Task Transaction

```http
GET /transactions/task/:taskId
Authorization: Bearer <token>
```

### Statistics Endpoints

#### Get Task Stats

```http
GET /tasks/stats
Authorization: Bearer <token>
```

#### Get Platform Stats

```http
GET /tasks/platform-stats
```

## 🧭 Frontend Routes

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/verify` - OTP verification

### Client Routes

- `/dashboard/client` - Client dashboard
- `/post-task` - Create new task
- `/tasks/:id/client` - View task details (client view)
- `/profile` - User profile

### Provider Routes

- `/dashboard/provider` - Provider dashboard
- `/tasks/:id/provider` - View task details (provider view)
- `/category/:category` - Browse tasks by category

## 🗄️ Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  passwordHash: String,
  role: String (client|provider),
  skills: [String], // for providers
  isVerified: Boolean,
  rating: Number,
  reviewCount: Number,
  points: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

```javascript
{
  title: String,
  description: String,
  category: String,
  location: String,
  client: ObjectId (ref: User),
  provider: ObjectId (ref: User),
  budget: Number,
  deadline: Date,
  skillsRequired: [String],
  urgency: String (low|medium|high|urgent),
  status: String (open|assigned|in-progress|completed|cancelled),
  bidders: [{
    user: ObjectId (ref: User),
    bidAmount: Number,
    proposal: String,
    estimatedDuration: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model

```javascript
{
  reviewer: ObjectId (ref: User),
  reviewedUser: ObjectId (ref: User),
  task: ObjectId (ref: Task),
  rating: Number,
  comment: String,
  createdAt: Date
}
```

### Transaction Model

```javascript
{
  task: ObjectId (ref: Task),
  client: ObjectId (ref: User),
  provider: ObjectId (ref: User),
  amount: Number,
  type: String (payment|refund),
  status: String (pending|completed|failed),
  createdAt: Date
}
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📱 Usage Examples

### For Clients:

1. Register as a client
2. Login to access dashboard
3. Post a new task with details
4. Review bids from providers
5. Assign task to preferred provider
6. Track task progress
7. Complete task and leave review

### For Providers:

1. Register as a provider
2. Login to access dashboard
3. Browse available tasks
4. Submit bids with proposals
5. Wait for task assignment
6. Complete assigned tasks
7. Receive payments and reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@doit-platform.com or join our community Discord server.

---

**Happy Tasking! 🚀**
