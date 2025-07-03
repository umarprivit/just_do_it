import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useContext } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import Login from "./pages/auth/Login";
import DashboardProvider from "./pages/dashboard/DashboardProvider";
import ProtectedRoute from "./components/ProtectedRoutes";
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
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard/client" element={<DashboardClient />}></Route>
        <Route
          path="/dashboard/provider"
          element={<DashboardProvider />}
        ></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/post-task" element={<PostTask />}></Route>
        <Route path="/view/:taskId" element={<ViewTaskDetail />}></Route>
        <Route
          path="/tasks/:taskId/client"
          element={<ClientTaskDetail />}
        ></Route>
        <Route
          path="/tasks/:taskId/provider"
          element={<ProviderTaskDetail />}
        ></Route>
        <Route path="/verify" element={<OtpScreen />}></Route>
        <Route
          path="/category/:category"
          element={<ProviderCategories />}
        ></Route>
        <Route path="*" element={<NotFound />} />

        {/* <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <DashboardProvider />
            </ProtectedRoute>
          }
        ></Route> */}
        {/* <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <DashboardClient />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/post-task"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <PostTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
