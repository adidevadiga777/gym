import { createBrowserRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"

import DashboardPage from "./features/posts/pages/DashboardPage"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <DashboardPage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "*",
        element: <div style={{ padding: '2rem', textAlign: 'center' }}>404 Not Found</div>
    }
])
