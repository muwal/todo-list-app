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
    HashRouter,
    createHashRouter
} from "react-router-dom";
import Detail from './pages/Detail.jsx'

const router = createHashRouter([
    {
        path: "https://muwal.github.io/todo-list-app/",
        element: <Layout>
            <App />
        </Layout>,
        errorElement: <ErrorPage />,
    },

    {
        path: 'https://muwal.github.io/todo-list-app/detail/:id',
        element: <Layout>
            <Detail />
        </Layout>,
        errorElement: <ErrorPage />,
    },
]);

document.title = 'To Do List App';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>

)