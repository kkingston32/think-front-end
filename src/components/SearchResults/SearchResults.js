import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../Nav/Nav';

const SearchResults = () => {
    const [results, setResults] = useState({ users: [], pages: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imgFiles, setImgFiles] = useState({});
    const location = useLocation();
    const logo = "http://localhost:3232/public/images/THINK.png";

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const name = params.get('name');
        if (name) {
            handleSearch(name);
        }
    }, [location]);

    const handleSearch = async (name) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:3232/search?name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResults(data);
            const imgFiles = {};
            data.users.forEach(user => {
                if (user.profileImgUrl) {
                    const relativePath = user.profileImgUrl.split('public')[1];
                    imgFiles[user._id] = `http://localhost:3232/public${relativePath}`;
                }
            });
            setImgFiles(imgFiles);
        } catch (error) {
            setError('Error fetching data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='main-container'>
            <div className="nav"><Nav /></div>
            <div className='search-results'>
                <h1>Search Results</h1>
                {loading && <div className="loading-screen">
                    <div className="spinner"></div>
                </div>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                    <div>
                        <h2>Users</h2>
                        {results.users.length > 0 ? (
                            <ul>
                                {results.users.map(user => (
                                    <li key={user._id}>
                                        <img loading="lazy" className="list-img" src={imgFiles[user._id]} alt={user.firstName} width="50" height="50" />
                                        <a href={`/profile/${user._id}`}>{user.firstName} {user.lastName}</a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users found</p>
                        )}
                        <h2>Pages</h2>
                        {results.pages.length > 0 ? (
                            <ul>
                                {results.pages.map(page => (
                                    <li key={page._id}>
                                        <img className="list-img" src={page.ImgUrl} alt={page.Name} width="50" height="50" />
                                        <a href={`/page/${page.Name}`}>{page.Name}</a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No pages found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
