import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import Feed from '../Feed/Feed';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import NetworkSuggestions from '../NetworkingSuggestions/NetworkingSuggestions';

const UserProfile = () => {
    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'

    const [imgFile, setImgFile] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [profile, setProfile] = useState(undefined);
    const [followDetails, setFollowDetails] = useState(undefined);
    const [followImgFiles, setFollowImgFiles] = useState({ followers: {}, following: {} });
    const [exerciseTypeImages, setExerciseTypeImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    const navigate = useNavigate();
    const { userId } = useParams();
    const logo = baseUrl+ "/public/images/THINK.png";

    useEffect(() => {
        let fetchOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include',
        };

        let url = baseUrl + `/userprofile/${userId}`;

        fetch(url, fetchOptions)
            .then(response => response.json())
            .then(async data => {
                if (data.user) {
                    setProfile(data.user);
                    setFollowDetails(data.followDetails);

                    if (data.user.profileImgUrl) {
                        const relativePath = data.user.profileImgUrl.split('public')[1];
                        const imageUrl = baseUrl+ `/public${relativePath}`;
                        setImgFile(imageUrl);
                    }

                    const followerImgFiles = {};
                    const followingImgFiles = {};

                    data.followDetails.followers.forEach(follower => {
                        if (follower.imgUrl) {
                            const followerRelativePath = follower.imgUrl.split('public')[1];
                            followerImgFiles[follower.id] = baseUrl + `/public${followerRelativePath}`;
                        }
                    });

                    data.followDetails.following.forEach(following => {
                        if (following.imgUrl) {
                            const followingRelativePath = following.imgUrl.split('public')[1];
                            followingImgFiles[following.id] = baseUrl + `/public${followingRelativePath}`;
                        }
                    });

                    setFollowImgFiles({ followers: followerImgFiles, following: followingImgFiles });

                    const exerciseImages = {};
                    const exercisePromises = data.user.exerciseType.map(async (exerciseType) => {
                        try {
                            const pageResponse = await fetch(baseUrl+`/page/${exerciseType}`);
                            if (!pageResponse.ok) {
                                throw new Error(`Page not found for exercise type: ${exerciseType}`);
                            }
                            const pageData = await pageResponse.json();
                            if (pageData && pageData.ImgUrl) {
                                exerciseImages[exerciseType] = pageData.ImgUrl;
                            } else {
                                console.warn(`No image URL found for exercise type: ${exerciseType}`);
                            }
                        } catch (error) {
                            console.error(`Error fetching page data for exercise type: ${exerciseType}`, error);
                        }
                    });

                    await Promise.all(exercisePromises);
                    setExerciseTypeImages({ ...exerciseImages });
                }
            })
            .catch(error => console.error("Error fetching data: ", error))
            .finally(() => setLoading(false));
    }, [userId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImgFile(file);
        setImgPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setUploading(true);
        const formData = new FormData(event.target);

        fetch(baseUrl +'/uploadProfilePic/' + userId, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setImgFile(data.filePath);
                setUploadMessage('File uploaded successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                setUploadMessage('Upload failed');
            })
            .finally(() => setUploading(false));
    };

    const handleUpdate = () => {
        let fetchOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            // credentials: 'include'
        };
        let url = baseUrl + `/update/${userId}`;
        fetch(url, fetchOptions)
            .then(response => response.json())
            .then(data => {
                if (data._id) {
                    setProfile(data);
                    navigate(`/update/${data._id}`);
                } else {
                    navigate('/');
                }
            })
            .catch(error => console.error("Error fetching data: ", error));
    };

    if (loading) {
        return <div className="loading-screen">
            <div className="spinner"></div>
        </div>;
    }

    return (
        <div className="profile-container">
            <div className="nav"><Nav /></div>
            <div className="user-detail-box">
                <h1 className='text-center'>My Profile</h1>
                <br/>
                <h4 className='text-center'>Friend Suggestions</h4>
                <div className="grid-container">
                    <div className="photo-box">
                        <div className="image-container">
                            <img className='preview-image' id="img-preview" src={imgPreview || imgFile} alt="Upload your photo" />
                        </div>
                        <p>{uploadMessage}</p>
                        <form id='image-form' onSubmit={handleSubmit}>
                            <input name="image" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                            <input className='bg-primary' type="submit" value={uploading ? "Uploading..." : "Upload"} disabled={uploading} />
                        </form>
                        <div className='info'>
                            <h3>Name: {profile?.firstName} {profile?.lastName}</h3>
                            <h4>Location: {profile?.location}</h4>
                            <h4>Email: {profile?.email}</h4>
                            <button onClick={handleUpdate}>Delete Profile</button>
                            <button onClick={handleUpdate}>My Preferences</button>
                            <div className=''>
                                <div className='side-section'>
                                    <h3 className='text-center'>Exercise Type</h3>
                                    {profile?.exerciseType?.map(exerciseType => (
                                        <div key={exerciseType} className='preferences-box'>
                                            <img  className='list-img' src={exerciseTypeImages[exerciseType] || logo} alt={exerciseType} />
                                            <Link to={`/page/${exerciseType.replace(/\s+/g, '')}`}>{exerciseType}</Link>
                                        </div>
                                    ))}
                                </div>
                                <div className='side-section'>
                                    <h3 className='text-center'>Goals</h3>
                                    {profile?.goals?.map(goal => (
                                        <div key={goal} className='preferences-box'>
                                            {goal}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='middle'>
                        <div className='networkingSuggestions'>
                            <NetworkSuggestions profileUserId={userId} />
                        </div>
                        <div className="feed">
                            <Feed userId={userId} />
                        </div>
                    </div>
                    <div className="follow-details">
                        <div className='side-section'>
                            <h3 className='text-center'>Followers</h3>
                            {followDetails?.followers?.map(follower => (
                                <div key={follower.id}>
                                    <img  className='list-img' src={followImgFiles.followers[follower.id]} alt={`${follower.name}'s profile`} />
                                    <Link to={`/profile/${follower.id}`}>{follower.name}</Link>
                                </div>
                            ))}
                        </div>
                        <div className='side-section'>
                            <h3 className='text-center'>Following</h3>
                            {followDetails?.following?.map(following => (
                                <div key={following.id}>
                                    <img  className='list-img' src={followImgFiles.following[following.id]} alt={`${following.name}'s profile`} />
                                    <Link to={`/profile/${following.id}`}>{following.name}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
