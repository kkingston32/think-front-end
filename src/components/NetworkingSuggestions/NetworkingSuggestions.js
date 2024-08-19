import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NetworkSuggestions = ({ profileUserId }) => {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // let baseUrl= 'https://think-back-end.azurewebsites.net'
        let baseUrl = 'http://localhost:3232'

        let fetchOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include',
        };

        let url = baseUrl+ `/suggestions/${profileUserId}`;

        fetch(url, fetchOptions)
            .then(response => response.json())
            .then(data => {
                // Transform profileImgUrl to full HTTP URL
                const updatedSuggestions = data.map(suggestion => {
                    if (suggestion.profileImgUrl) {
                        const relativePath = suggestion.profileImgUrl.split('public')[1];
                        return {
                            ...suggestion,
                            profileImgUrl: baseUrl+ `/public${relativePath}`
                        };
                    }
                    return suggestion;
                });
                setSuggestions(updatedSuggestions);
            })
            .catch(error => console.error("Error fetching suggestions: ", error));
    }, [profileUserId]);

    return (
        <div className="network-suggestions-container">
            
            <div className="suggestions-scroll">
                {suggestions.map(suggestion => (
                    <div key={suggestion.id} className="suggestion-box">
                        <img className='list-img' src={suggestion.profileImgUrl || 'default-image-url'} alt={`${suggestion.name}'s profile`} />
                        <Link to={`/profile/${suggestion.id}`}>{suggestion.name}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NetworkSuggestions;
