import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import Feed from '../Feed/Feed';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [imgFile, setImgFile] = useState('');
    const [profile, setProfile] = useState(undefined);
    const [followDetails, setFollowDetails] = useState(undefined);
    const [followImgFiles, setFollowImgFiles] = useState({ followers: {}, following: {} });
    const [exerciseTypeImages, setExerciseTypeImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false); // Track follow/unfollow state
    const [error, setError] = useState(null); // Track errors

    const logo = "http://localhost:3232/public/images/THINK.png";
    const navigate = useNavigate();
    const { profileUserId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try { 
                setLoading(true)
                const response = await axios.get(`http://localhost:3232/profile/${profileUserId}`, {
                    withCredentials: true,
                });
                const data = response.data;
                setProfile(data);
                setFollowDetails(data.followDetails);

                if (data.user.profileImgUrl) {
                    const relativePath = data.user.profileImgUrl.split('public')[1];
                    const imageUrl = `http://localhost:3232/public${relativePath}`;
                    setImgFile(imageUrl);
                }

                const followerImgFiles = {};
                const followingImgFiles = {};

                data.followDetails.followers.forEach(follower => {
                    if (follower.imgUrl) {
                        const followerRelativePath = follower.imgUrl.split('public')[1];
                        followerImgFiles[follower.id] = `http://localhost:3232/public${followerRelativePath}`;
                    }
                });

                data.followDetails.following.forEach(following => {
                    if (following.imgUrl) {
                        const followingRelativePath = following.imgUrl.split('public')[1];
                        followingImgFiles[following.id] = `http://localhost:3232/public${followingRelativePath}`;
                    }
                });

                setFollowImgFiles({ followers: followerImgFiles, following: followingImgFiles });

                // Fetch images for exercise types
                const exerciseImages = {};
                const exercisePromises = data.user.exerciseType.map(async (exerciseType) => {
                    try {
                        const pageResponse = await axios.get(`http://localhost:3232/page/${exerciseType}`);
                        const pageData = pageResponse.data;
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
            } catch (error) {
                console.error('Error fetching profile data: ', error);

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [profileUserId, isFollowing]);

    useEffect (() => {
        
    })
    const follow = async () => {
        setIsFollowing(true);
        try {
            // Send the follow request
            await axios.put(`http://localhost:3232/follow/${profileUserId}`, {}, {
                withCredentials: true,
            });
    
            // Fetch the updated profile data to refresh the followers
            const profileResponse = await axios.get(`http://localhost:3232/profile/${profileUserId}`, {
                withCredentials: true,
            });
    
            const updatedProfile = profileResponse.data;
            setProfile(updatedProfile); // Update the profile state with the latest data
            setFollowDetails(updatedProfile.followDetails); // Update the follow details state
        } catch (error) {
            console.error('Error following user:', error);
            setError('Failed to follow user. Please try again later.');
        } finally {
            setLoading(false);
            setIsFollowing(false);
        }
    };
    
    const unfollow = async () => {
        setIsFollowing(true);
        try {
            const response = await axios.put(`http://localhost:3232/unfollow/${profileUserId}`, {}, {
                withCredentials: true,
            });

            const updatedProfile = response.data;
            setProfile(updatedProfile);
            setFollowDetails(updatedProfile.followDetails);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            setError('Failed to unfollow user. Please try again later.');
        } finally {
            setIsFollowing(false);
        }
    };

    if (loading) {
        return <div className="loading-screen"><div className="spinner"></div></div>;
    }

    if (!profile) {
        return <div className="error-message">Profile data is unavailable.</div>;
    }

    return (
        <div className='profile-container'>
            <div className='nav'><Nav /></div>
            {error && <div className="error-message">{error}</div>}
            <div className='user-detail-box'>
                <h1>{profile.user.firstName}'s Profile</h1>
                <div className="profile-grid-container">
                    <div className="photo-box">
                        <div className="image-container">
                            <img className='preview-image' id="img-preview" src={imgFile} alt="User Photo" />
                        </div>
                        <div className='info'>
                            <h3>Name: {profile.user.firstName} {profile.user.lastName}</h3>
                            <h4>Location: {profile.user.location}</h4>
                            <h4>Email: {profile.user.email}</h4>
                            <button onClick={follow} disabled={isFollowing}>Follow</button>
                            <button onClick={unfollow} disabled={isFollowing}>Unfollow</button>
                            <div className='side-section'>
                                <h3>Goals</h3>
                                {profile.user.goals?.map(goal => (
                                    <div key={goal} className='preferences-box'>
                                        {goal}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='profile-layout'>
                            <div className='side-section'>
                                <h3 className='text-center'>Followers</h3>
                                {followDetails?.followers?.map(follower => (
                                    <div key={follower.id}>
                                        <img  className='list-img' src={followImgFiles.followers[follower.id]} alt={follower.name} />
                                        <Link to={`/profile/${follower.id}`}>{follower.name}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className='side-section'>
                                <h3 className='text-center'>Following</h3>
                                {followDetails?.following?.map(following => (
                                    <div key={following.id}>
                                        <img  className='list-img' src={followImgFiles.following[following.id]} alt={following.name} />
                                        <Link to={`/profile/${following.id}`}>{following.name}</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='side-section'>
                            <h3 className='text-center'>Exercise Type</h3>
                            {profile.user.exerciseType?.map(exerciseType => (
                                <div key={exerciseType} className='preferences-box'>
                                    <img  className='list-img' src={exerciseTypeImages[exerciseType]} alt={exerciseType} />
                                    <Link to={`/page/${exerciseType.replace(/\s+/g, '')}`}>{exerciseType}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="feed">
                        <Feed userId={profileUserId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
