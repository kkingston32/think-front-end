import Nav from '../Nav/Nav'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';




const Registration = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState(undefined)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profileImgUrl: ''
    });

    // let baseUrl= 'https://think-back-end.azurewebsites.net/'
    let baseUrl = 'http://localhost:3232/'

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let errors = {};
        if (!formData.firstName) errors.firstName = 'First name is required';
        if (!formData.lastName) errors.lastName = 'Last name is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted successfully', formData);
            console.log("Update Clicked");
            
            const url = baseUrl + "register";
            const theBody = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                profileImgUrl: formData.profileImgUrl
            };
            console.log("BODY: ", theBody);
    
            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(theBody)
            };
            console.log("FETCH OPTIONS: ", fetchOptions);
    
            try {
                const response = await fetch(url, fetchOptions);
                const data = await response.json();
                if (!data.alreadyExisted) {
                    Cookies.set('userId', data.userId, { path: '/' });
                    navigate('/update/' + data.userId);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error during registration:', error);
                setMessage('Registration failed. Please try again later.');
            }
        }
    };
    



    return (
        <div className='main-container'>
            <div className="nav"><Nav /></div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <h3 className="card-header text-primary">Register</h3>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset>
                                        <div>
                                            <label htmlFor="firstName" className="form-label mt-4">First Name: </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.firstName && <p className="error">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="form-label mt-4">Last Name: </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.lastName && <p className="error">{errors.lastName}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="form-label mt-4">Email: </label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.email && <p className="error">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="password" className="form-label mt-4">Password: </label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.password && <p className="error">{errors.password}</p>}
                                        </div>
                                        <div hidden>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="profileImgUrl"
                                                name="profileImgUrl"
                                                value={formData.profileImgUrl}
                                                readOnly  
                                            />
                                            <br />

                                        </div>
                                        <br/>
                                        <input type="submit" value="Register" />

                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};
export default Registration