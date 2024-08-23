import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {useCookies} from 'react-cookie';

const Nav = () => {

    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'


    const [profile, setProfile] = useState(undefined);
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
    const logo = baseUrl+ "/public/images/THINK.png";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCookies = async () => {
            try {
                if(cookies.userId){
                    setUserId(cookies.userId);
                }else{
                    setUserId(null)
                }
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        };
        fetchCookies();
    }, []);

    const handleLogout = () => {
        removeCookie('userId');
        fetch(baseUrl + "/logout", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include'
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    navigate('/');
                }
            });
    };

    const handleProfile = () => {
        
        fetch(baseUrl + `/userprofile/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (userId) {
                    setProfile(data);
                    navigate(`/userprofile/${userId}`);
                } else {
                    window.location.reload();
                    navigate('/login');
                }
            })
            .catch(error => console.error("Error fetching data: ", error));
    };

    const handleUpdate = () => {
        fetch(baseUrl+ `/update/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                if (userId) {
                    setProfile(data);
                    navigate(`/update/${userId}`);
                } else {
                    navigate('/');
                }
            })
            .catch(error => console.error("Error fetching data: ", error));
    };

    const debouncedSearch = useCallback(debounce((value) => {
        navigate(`/search?name=${value}`);
    }, 0), [navigate]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <nav className="navbar bg-primary">
            <div className="navbar-left">
                <Link to="/">
                    <img src={logo} alt="T.H.I.N.K Logo" className="navbar-logo" />
                </Link>
            </div>
            <div className="navbar-center">
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="search-input"
                        type="search"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={handleInputChange}
                    />
                </form>
            </div>
            <div className="navbar-right">
                {userId ? (
                    <>
                        <button className="nav-link" onClick={handleProfile}>My Profile</button>
                        <button className="nav-link" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link className="nav-link" to="/register">Register</Link>
                        <Link className="nav-link" to="/login">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Nav;
