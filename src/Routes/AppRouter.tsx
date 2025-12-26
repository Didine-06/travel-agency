import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import PublicLayout from "../Layouts/PublicLayout";
import ClientLayout from "../Layouts/ClientLayout";
import AgentLayout from "../Layouts/AgentLayout";
import AdminLayout from "../Layouts/AdminLayout";

// Public Pages
import Home from "../Pages/public/Home";
import About from "../Pages/public/About";
import Services from "../Pages/public/Services";
import Destinations from "../Pages/public/Destinations";
import Login from "../Pages/public/Login";
import Register from "../Pages/public/Register";
import Unauthorized from "../Pages/public/Unauthorized";

// Client Pages
import ClientDashboard from "../Pages/client/Dashboard";
import ClientProfile from "../Pages/client/Profile";
import ClientReservation from "../Pages/client/reservations/Reservation";
import EditBooking from "../Pages/client/reservations/EditBooking";
import ClientPlane from "../Pages/client/planes/Plane";
import EditPlane from "../Pages/client/planes/EditPlane";
import ClientConsultation from "../Pages/client/consultations/Consultation";
import EditConsultation from "../Pages/client/consultations/EditConsultation";

// Agent Pages
import AgentDashboard from "../Pages/agent/Dashboard";
import AgentBookings from "../Pages/agent/Bookings";
import AgentProfile from "../Pages/agent/Profile";

// Admin Pages
import AdminDashboard from "../Pages/admin/Dashboard";
import AdminUsers from "../Pages/admin/Users";
import AdminProfile from "../Pages/admin/Profile";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Auth Routes (without layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["CLIENT"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/client/dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        {/* Reservations parent */}
        <Route path="reservations" element={<ClientReservation />}>
          <Route path=":id" element={<EditBooking />} />
        </Route>

        {/* Consultations parent */}
        <Route path="consultations" element={<ClientConsultation />}>
          <Route path=":id" element={<EditConsultation />} />
        </Route>

        <Route path="planes" element={<ClientPlane />} >
          <Route path=":id" element={<EditPlane />} />
        </Route>
        
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      {/* Agent Routes */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={["AGENT"]}>
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/agent/dashboard" replace />} />
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="bookings" element={<AgentBookings />} />
        <Route path="profile" element={<AgentProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
