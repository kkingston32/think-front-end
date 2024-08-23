import React, { useState } from 'react'
import Nav from '../Nav/Nav'
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie';

const Login = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState(undefined)
    const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'

    const validate = () => {
        let errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted successfully', formData);
            console.log("Update Clicked")
            let url = baseUrl + "/login"
            let theBody =
            {
                email: formData.email,
                password: formData.password
            }
            console.log("BODY: ", theBody)
            let fetchOptions = {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Credentials": 'true'
                },
                body: JSON.stringify(theBody),
                // credentials: 'include'
            }
            console.log("FETCH OPTIONS: ", fetchOptions)

            fetch(url, fetchOptions)
                .then(r => r.json())
                .then(data => {
                    console.log("DATA RES: ", data)
                    if (data.alreadyExisted == false) {
                        navigate('/register')
                    } else {
                        // Cookies.set('userId', data._id, { path: '/' })
                        setCookie('userId', data._id);
                        navigate('/userprofile/' + data._id)
                    }
                })

        }
    }


    return (
        <div className='main-container'>
            <div className="nav"><Nav /></div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card mb-3">
                            <h3 className="card-header text-primary">Login</h3>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <fieldset>
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
                                            <br />
                                            <input type="submit" value="Login" />
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login