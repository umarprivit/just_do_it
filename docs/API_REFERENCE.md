# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP address
- 1000 requests per hour for authenticated users

## Pagination
List endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Pagination Response
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering & Sorting
### Tasks Endpoint Filters
- `category` - Filter by task category
- `location` - Filter by location
- `budget_min` - Minimum budget
- `budget_max` - Maximum budget
- `urgency` - Filter by urgency level
- `status` - Filter by task status
- `skills` - Comma-separated list of required skills

### Sorting
- `sort` - Field to sort by (default: createdAt)
- `order` - Sort order: `asc` or `desc` (default: desc)

Example:
```
GET /tasks?category=Web Development&budget_min=1000&sort=budget&order=asc
```

## Error Codes Reference

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Invalid email or password |
| `USER_NOT_FOUND` | User does not exist |
| `USER_ALREADY_EXISTS` | Email already registered |
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | User doesn't have required permissions |
| `TASK_NOT_FOUND` | Task does not exist |
| `BID_ALREADY_EXISTS` | User has already bid on this task |
| `TASK_NOT_OPEN` | Task is not accepting bids |
| `INVALID_BID_AMOUNT` | Bid amount is invalid |
| `VALIDATION_ERROR` | Request validation failed |
| `UPLOAD_ERROR` | File upload failed |
| `EMAIL_SEND_ERROR` | Failed to send email |

## WebSocket Events
The application supports real-time updates via WebSocket:

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events
- `task:new` - New task created
- `task:updated` - Task updated
- `bid:new` - New bid submitted
- `task:assigned` - Task assigned to provider
- `task:completed` - Task marked as completed
- `notification:new` - New notification

### Example Usage
```javascript
socket.on('bid:new', (data) => {
  console.log('New bid received:', data);
  // Update UI
});
```

## Endpoints

#### Get All Tasks
```http
GET /tasks?page=1&limit=10&category=Web Development&location=Remote
```

#### Get Single Task
```http
GET /tasks/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "task-object-id",
    "title": "Build a React Website",
    "description": "Need a modern React website with responsive design",
    "category": "Web Development",
    "location": "Remote",
    "budget": 2500,
    "deadline": "2025-08-15T00:00:00.000Z",
    "skillsRequired": ["React", "JavaScript", "CSS"],
    "urgency": "high",
    "status": "open",
    "client": {
      "_id": "client-id",
      "name": "John Doe",
      "email": "john@example.com",
      "rating": 4.8,
      "reviewCount": 23,
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    "provider": null,
    "bidders": [
      {
        "_id": "bid-id",
        "user": {
          "_id": "provider-id",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "rating": 4.9,
          "reviewCount": 45,
          "skills": ["React", "Node.js", "MongoDB"]
        },
        "bidAmount": 2200,
        "proposal": "I can build this website with modern React...",
        "estimatedDuration": "3 weeks",
        "createdAt": "2025-07-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-06-30T00:00:00.000Z",
    "updatedAt": "2025-07-01T00:00:00.000Z"
  },
  "message": "Task retrieved successfully"
}
```

#### Get My Tasks (Client)
```http
GET /tasks/my?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "task-object-id",
        "title": "Build a React Website",
        "description": "Need a modern React website with responsive design",
        "category": "Web Development",
        "location": "Remote",
        "budget": 2500,
        "deadline": "2025-08-15T00:00:00.000Z",
        "skillsRequired": ["React", "JavaScript", "CSS"],
        "urgency": "high",
        "status": "open",
        "client": {
          "_id": "client-id",
          "name": "John Doe",
          "email": "john@example.com",
          "rating": 4.8,
          "reviewCount": 23,
          "createdAt": "2024-01-15T00:00:00.000Z"
        },
        "provider": null,
        "bidders": [
          {
            "_id": "bid-id",
            "user": {
              "_id": "provider-id",
              "name": "Jane Smith",
              "email": "jane@example.com",
              "rating": 4.9,
              "reviewCount": 45,
              "skills": ["React", "Node.js", "MongoDB"]
            },
            "bidAmount": 2200,
            "proposal": "I can build this website with modern React...",
            "estimatedDuration": "3 weeks",
            "createdAt": "2025-07-01T00:00:00.000Z"
          }
        ],
        "createdAt": "2025-06-30T00:00:00.000Z",
        "updatedAt": "2025-07-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Tasks retrieved successfully"
}
```

#### Get My Tasks (Provider)
```http
GET /tasks/my-assigned?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "task-object-id",
        "title": "Build a React Website",
        "description": "Need a modern React website with responsive design",
        "category": "Web Development",
        "location": "Remote",
        "budget": 2500,
        "deadline": "2025-08-15T00:00:00.000Z",
        "skillsRequired": ["React", "JavaScript", "CSS"],
        "urgency": "high",
        "status": "open",
        "client": {
          "_id": "client-id",
          "name": "John Doe",
          "email": "john@example.com",
          "rating": 4.8,
          "reviewCount": 23,
          "createdAt": "2024-01-15T00:00:00.000Z"
        },
        "provider": {
          "_id": "provider-id",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "rating": 4.9,
          "reviewCount": 45,
          "skills": ["React", "Node.js", "MongoDB"]
        },
        "bidders": [
          {
            "_id": "bid-id",
            "user": {
              "_id": "provider-id",
              "name": "Jane Smith",
              "email": "jane@example.com",
              "rating": 4.9,
              "reviewCount": 45,
              "skills": ["React", "Node.js", "MongoDB"]
            },
            "bidAmount": 2200,
            "proposal": "I can build this website with modern React...",
            "estimatedDuration": "3 weeks",
            "createdAt": "2025-07-01T00:00:00.000Z"
          }
        ],
        "createdAt": "2025-06-30T00:00:00.000Z",
        "updatedAt": "2025-07-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Tasks retrieved successfully"
}
```
