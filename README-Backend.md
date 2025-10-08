# AutoTest AI Backend

A robust Node.js backend API for the AutoTest AI dashboard, providing user authentication and test data management with MySQL database integration.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Test Results Management**: Store and retrieve test execution results with detailed logs
- **AI Healing Actions**: Track AI-powered test healing actions and their effectiveness
- **Flaky Test Detection**: Monitor and analyze tests with inconsistent results
- **RESTful API**: Clean, well-documented API endpoints
- **Database Integration**: MySQL with connection pooling and proper indexing

## Quick Start

### Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   cd server
   npm install
   ```

2. **Database Setup**:
   ```bash
   # Create database in MySQL
   mysql -u root -p
   CREATE DATABASE autotest_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit

   # Import schema
   mysql -u root -p autotest_ai < database/schema.sql
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Start the server**:
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Test Management
- `POST /api/tests/results` - Create test result
- `GET /api/tests/results` - Get user's test results
- `GET /api/tests/stats` - Get test statistics
- `POST /api/tests/healing` - Create healing action
- `GET /api/tests/healing` - Get healing actions
- `GET /api/tests/healing/stats` - Get healing statistics
- `POST /api/tests/flaky` - Create/update flaky test
- `GET /api/tests/flaky` - Get flaky tests
- `GET /api/tests/flaky/trends` - Get flaky test trends

### Health Check
- `GET /health` - Server health status

## Database Schema

### Users Table
- User authentication and profile information
- Secure password storage with bcrypt
- Avatar support for profile pictures

### Test Results Table
- Complete test execution data
- Status tracking (passed/failed/skipped)
- Duration and error logging
- Comprehensive test logs storage

### Healing Actions Table
- AI-powered test healing tracking
- Selector change history
- Confidence scoring
- Status management (applied/pending/rejected)

### Flaky Tests Table
- Inconsistent test tracking
- Failure rate analysis
- Priority classification
- Pattern analysis storage

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable cross-origin resource sharing

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=autotest_ai
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Demo Accounts

For testing purposes, the schema includes demo accounts:
- Email: `demo@example.com` / Password: `password`
- Email: `admin@autotest.ai` / Password: `password`

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Setup database schema
npm run db:setup
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a strong `JWT_SECRET`
3. Configure proper database credentials
4. Set up SSL/TLS for secure connections
5. Configure reverse proxy (nginx/Apache)
6. Set up database backups and monitoring

## API Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "message": "Description of the result",
  "data": {
    // Response data here
  }
}
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write tests for new features
5. Update documentation