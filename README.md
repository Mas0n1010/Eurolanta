# Roblox Activity Logger

A comprehensive activity logging and monitoring system for Roblox platform with admin dashboard capabilities.

## Features

- **User Authentication**: Secure login system with session management
- **Admin Dashboard**:
  - View all users and their activity statistics
  - Create new users with custom permissions
  - Monitor user sessions and activity in real-time
  - View detailed session times for each user
- **Activity Tracking**: Automatic logging of user actions and sessions
- **Session Management**: Track login times, session durations, and IP addresses
- **User Management**: Admins can create and manage user accounts

## Tech Stack

- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: Custom session-based auth with bcrypt

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run db:push
```

3. Create the initial admin user:
```bash
npx tsx scripts/setup.ts
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

## Default Credentials

After running the setup script, you can login with:

- **Username**: `admin`
- **Password**: `admin123`

**IMPORTANT**: Change the admin password after first login!

## Usage

### Admin Features

1. **Login**: Use admin credentials to access the admin dashboard
2. **View Users**: See all users with their statistics on the main dashboard
3. **Create Users**: Click "Create New User" to add new users to the system
4. **Monitor Activity**: Click "View Details" on any user to see:
   - Session history with start/end times
   - Total time logged
   - Detailed activity logs
   - IP addresses and user agents

### User Features

- Regular users can login and access their personal dashboard
- All user activity is automatically tracked
- Sessions are recorded with timestamps

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── users/        # User management endpoints
│   ├── admin/            # Admin dashboard pages
│   ├── dashboard/        # User dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Login page
│   └── globals.css       # Global styles
├── lib/
│   ├── auth.ts           # Authentication utilities
│   └── prisma.ts         # Prisma client
├── prisma/
│   └── schema.prisma     # Database schema
└── scripts/
    └── setup.ts          # Setup script
```

## Database Schema

### User
- id, username, password, isAdmin, robloxUsername
- Timestamps: createdAt, updatedAt

### Session
- id, userId, startTime, endTime, ipAddress, userAgent
- Tracks user login sessions

### ActivityLog
- id, userId, action, details, timestamp
- Logs all user actions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details with sessions and activity logs

## Security Features

- Password hashing with bcrypt
- HTTP-only cookies for session management
- Admin-only routes protected by middleware
- SQL injection protection via Prisma
- Input validation on all forms

## Future Enhancements

- Password change functionality
- User edit/delete capabilities
- Export activity logs to CSV
- Real-time activity monitoring
- Email notifications
- Two-factor authentication
- Advanced filtering and search

## License

MIT
