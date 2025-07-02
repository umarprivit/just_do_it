import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import Login from "./pages/auth/Login";
import DashboardProvider from "./pages/dashboard/DashboardProvider";
import PostTask from "./pages/tasks/PostTask";
import DashboardClient from "./pages/dashboard/DashboardClient";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import ViewTaskDetail from "./pages/tasks/ViewTaskDetail";
import ClientTaskDetail from "./pages/tasks/ClientTaskDetail";
import ProviderTaskDetail from "./pages/tasks/ProviderTaskDetail";
import OtpScreen from "./pages/auth/OtpScreen";
import ProviderCategories from "./pages/ProviderCategories";
import NotFound from "./pages/NotFound";
import { 
  ProtectedRoute, 
  PublicRoute, 
  RoleRoute 
} from "./components/RouteGuards";
import { DashboardRedirect } from "./utils/authRedirects";

function App() {
  const { state, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      {/* <nav className="flex items-center justify-between h-20 border-2 border-black px-20 sticky top-0 bg-white font-poppins">
        <h1 className="text-3xl">Tasker</h1>

        <ul className="flex items-center justify-between space-x-10">
          <div className="flex justify-between items-center space-x-2">
            <li>Login</li>
            <li>Sign Up</li>
          </div>
          <li onClick={toggleTheme}>
            {state.theme == "light" ? (
              <MdOutlineLightMode className="text-yellow-500 h-15 w-8" />
            ) : (
              <MdOutlineDarkMode className="text-blue-500 h-15 w-8" />
            )}
          </li>
        </ul>
      </nav> */}

      <Routes>
        {/* Root Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Public Routes - Only accessible when NOT logged in */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/verify" element={
          <PublicRoute>
            <OtpScreen />
          </PublicRoute>
        } />

        {/* Role-Based Dashboard Routes */}
        <Route path="/dashboard/client" element={
          <RoleRoute requiredRole="client">
            <DashboardClient />
          </RoleRoute>
        } />
        <Route path="/dashboard/provider" element={
          <RoleRoute requiredRole="provider">
            <DashboardProvider />
          </RoleRoute>
        } />

        {/* Protected Routes - Require authentication */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Client-specific protected routes */}
        <Route path="/post-task" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <PostTask />
          </ProtectedRoute>
        } />
        <Route path="/tasks/:taskId/client" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientTaskDetail />
          </ProtectedRoute>
        } />

        {/* Provider-specific protected routes */}
        <Route path="/tasks/:taskId/provider" element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <ProviderTaskDetail />
          </ProtectedRoute>
        } />
        <Route path="/category/:category" element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <ProviderCategories />
          </ProtectedRoute>
        } />

        {/* Mixed Routes - Accessible to all authenticated users */}
        <Route path="/view/:taskId" element={
          <ProtectedRoute>
            <ViewTaskDetail />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
