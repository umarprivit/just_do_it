# DO IT! Backend

A Node.js Express backend for the DO IT! task management platform.

## Features

- User authentication and authorization
- Task management (create, read, update, delete)
- Bidding system for providers
- Review and rating system
- Transaction management
- JWT-based authentication

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your values
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Required environment variables (see `.env.example`):

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - API key for Gemini AI service
- `ZOHO_EMAIL` - Email for notifications
- `ZOHO_PASSWORD` - Password for email service
- `PORT` - Port number (automatically set by Railway)

## Deployment to Railway

### Prerequisites
1. Create a [Railway](https://railway.app) account
2. Install Railway CLI: `npm install -g @railway/cli`

### Steps

1. **Initialize Railway project:**
   ```bash
   cd backend
   railway login
   railway init
   ```

2. **Set environment variables in Railway dashboard:**
   - Go to your project dashboard on Railway
   - Navigate to the Variables tab
   - Add all the required environment variables from `.env.example`

3. **Deploy:**
   ```bash
   railway up
   ```

   Or connect your GitHub repository for automatic deployments:
   - Connect your GitHub repo in Railway dashboard
   - Enable auto-deploy from main branch

### Railway Configuration

The project includes:
- `railway.json` - Railway-specific configuration
- `package.json` with proper start script
- Environment-based port configuration

### Database Setup

Make sure your MongoDB Atlas cluster:
1. Allows connections from anywhere (0.0.0.0/0) for Railway
2. Has the correct database name in the connection string
3. Has proper user permissions

## API Documentation

The API provides the following endpoints:

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `POST /api/tasks/:id/bid` - Apply to task (protected)

### Reviews
- `GET /api/reviews/:userId` - Get user reviews
- `POST /api/reviews` - Create review (protected)

### Transactions
- `GET /api/transactions` - Get user transactions (protected)
- `POST /api/transactions` - Create transaction (protected)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
