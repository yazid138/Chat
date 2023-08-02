import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/index.css'
import App from "./pages/App.jsx";
import Login from "./pages/Login.jsx";
import {SessionProvider} from "./hooks/SessionHook.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <CssBaseline/>
                <RouterProvider router={router}/>
            </SessionProvider>
        </QueryClientProvider>
    </React.StrictMode>
)
