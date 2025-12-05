# Travel Agency - Role-Based React Application

A complete React application with role-based authentication and routing for managing a travel agency platform.

## Features

- **Role-Based Access Control**: Three user roles (CLIENT, AGENT, ADMIN) with separate dashboards
- **Authentication System**: Login/Register with protected routes
- **Modern Stack**: React, React Router v6, TailwindCSS
- **Responsive Layouts**: Custom layouts for each role
- **Type-Safe**: TypeScript support

## Project Structure

```
src/
├── api/                    # Auto-generated API client
├── assets/                 # Static assets
├── components/
│   ├── common/            # Reusable components (Navbar, Sidebar, TopBar)
│   └── layout/            # Layout components for each role
├── config/                # App configuration and constants
├── context/               # React Context (AuthContext)
├── hooks/                 # Custom React hooks
├── lib/                   # Third-party library configs
├── pages/
│   ├── public/           # Public pages (Home, About, Login, etc.)
│   ├── client/           # Client role pages
│   ├── agent/            # Agent role pages
│   └── admin/            # Admin role pages
├── router/                # Routing configuration
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── App.tsx               # Main app component
└── main.tsx              # Entry point
```

## User Roles

### CLIENT
- Access to personal dashboard
- View and manage profile
- Browse destinations

### AGENT
- Manage bookings
- View client information
- Track revenue

### ADMIN
- Full system access
- User management
- System analytics

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Routes

### Public Routes
- `/` - Home page
- `/about` - About page
- `/services` - Services page
- `/destinations` - Destinations page
- `/login` - Login page
- `/register` - Register page

### Client Routes (Role: CLIENT)
- `/client/dashboard` - Client dashboard
- `/client/profile` - Client profile

### Agent Routes (Role: AGENT)
- `/agent/dashboard` - Agent dashboard
- `/agent/bookings` - Manage bookings

### Admin Routes (Role: ADMIN)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management

## Authentication

The app uses Context API for authentication management. Mock login is currently implemented - replace with actual API calls in `src/context/AuthContext.jsx`.

To test different roles, use the login page and select the role from the dropdown.

## Next Steps

1. Connect to your backend API (update `src/api/index.js`)
2. Add React Query for data fetching (configured in `src/lib/queryClient.js`)
3. Implement actual authentication logic
4. Add form validation
5. Implement CRUD operations for each role
6. Add loading states and error handling
7. Implement pagination and search
8. Add unit and integration tests

## Technologies Used

- React 19
- React Router DOM 7
- TailwindCSS 3
- TypeScript 5
- Vite 7
- Framer Motion
- Lucide React (icons)

## License

MIT
