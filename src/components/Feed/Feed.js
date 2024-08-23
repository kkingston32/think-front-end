import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Feed = ({ userId }) => {
    console.log("Feed userID: ", userId)
    const [posts, setPosts] = useState([]);
    const [formData, setFormData] = useState({
        content: '',
        date: new Date(),
        image: null,
        feedUserId: userId

    });

    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('content', formData.content);
        data.append('date', new Date().toISOString());
        data.append('feedUserId', userId)
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await axios.post(baseUrl + '/newPost', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                // withCredentials: true,
            });
            console.log('Post created:', response.data);
            fetchPosts(); // Refresh posts after creating a new post
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userId]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(baseUrl+ `/posts/${userId}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts: ', error);
        }
    };

    console.log(posts)

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className='post-form '>
                    <form className="card mb-3 card-body" onSubmit={handleSubmit}>
                        <fieldset>
                            <div>
                                <label htmlFor="content" className="form-label mt-4">What's on your mind?</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="image" className="form-label mt-4">Upload an image</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <br />
                            <input type="submit" value="Post" />
                        </fieldset>
                    </form>
                </div>

                <br />
                <div className="row justify-content-center">
                    <div className='posts-section justify-content-center'>
                        <h3>Posts</h3>

                        {posts
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(post => (
                                <li key={post._id} className='card mb-3 post-item'>
                                    <Link to={`/profile/${post.posterId}`}>{post.posterName}</Link>
                                    <p className='card-body'>{post.content}</p>
                                    <div>
                                        {post.imageUrl && <img className="post-image" src={baseUrl + `/${post.imageUrl}`} alt="Post Image" />}

                                    </div>
                                    <p>{new Date(post.date).toLocaleDateString()}</p>
                                </li>
                            ))}

                    </div>
                </div>

            </div>
        </div>

    );
};

export default Feed;
