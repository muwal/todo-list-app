import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Layout from './components/Layout.jsx'
import ErrorPage from './pages/Error-pages.jsx'
import './index.css'

import {
    BrowserRouter,
    createBrowserRouter,
    Route,
    RouterProvider,
} from "react-router-dom";
import Detail from './pages/Detail.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout>
            <App />
        </Layout>,
        errorElement: <ErrorPage />,
    },

    {
        path: '/detail/:id',
        element: <Layout>
            <Detail />
        </Layout>,
        errorElement: <ErrorPage />,
    },
]);

document.title = 'To Do List App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>

)

reportWebVitals();