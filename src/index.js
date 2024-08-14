
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Registration from './components/Registration/Registration';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import Profile from './components/Profile/Profile'
import FitnessPreferencesForm from './components/FitnessPreferencesForm/FitnessPreferencesForm';
import Feed from './components/Feed/Feed'
import Page from './components/Page/Page';
import Search from './components/SearchResults/SearchResults'
import GoalTracker from './components/GoalTracker/GoalTracker';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/search",
        element: <Search />
    },
    // {
    //     path: "/usergoals/:userId",
    //     element: <GoalTracker />
    // },
    {
        path: "/profile/:profileUserId",
        element: <Profile />
    },
    {
        path: "/register",
        element: <Registration />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/userprofile/:userId",
        element: <UserProfile />
    },
    {
        path: "/feed/:userId",
        element: <Feed />
    },
    {
        path: "/update/:userId",
        element: <FitnessPreferencesForm />
    },
    // {
    //   path: "/preferences",
    //   element: <FitnessPreferencesForm />
    // },
    {
        path: "/logout",
        element: <Home />
    },
    {
        path: "/page/:pageInfo",
        element: <Page />
    }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
