import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

// let baseUrl= 'https://think-back-end.azurewebsites.net'
let baseUrl = 'http://localhost:3232'

const FitnessPreferencesForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const { userId } = useParams();
    // const userId = Cookies.get('userId')
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        location: '',
    });

    const [preferences, setPreferences] = useState({
        exerciseType: [],
        workoutEnvironment: [],
        intensityLevel: [],
        duration: [],
        timeOfDay: [],
        goals: [],
        equipment: [],
        additionalPreferences: [],
        recovery: [],
    });

    useEffect(() => {
        const fetchOptions = {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Credentials": 'true'
            },
            credentials: 'include'
        };

        const url = baseUrl + "/update/" + userId;

        fetch(url, fetchOptions)
            .then(response => response.json())
            .then(data => {
                console.log("DATA: ", data);
                // Cookies.set('userId', data._id, { path: '/' });
                setProfile(data);
                // Update form fields with fetched data
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    location: data.location || '',
                });
                setPreferences({
                    exerciseType: data.exerciseType || [],
                    workoutEnvironment: data.workoutEnvironment || [],
                    intensityLevel: data.intensityLevel || [],
                    duration: data.duration || [],
                    timeOfDay: data.timeOfDay || [],
                    goals: data.goals || [],
                    equipment: data.equipment || [],
                    additionalPreferences: data.additionalPreferences || [],
                    recovery: data.recovery || [],
                });
                console.log("PROFILE DATA: ", data);
            })
            .catch(error => console.error("Error fetching data: ", error));
    }, [userId]);

    const deleteUser = () => {
        navigate("/delete/" + userId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        setPreferences((prevPreferences) => {
            const updatedCategory = checked
                ? [...prevPreferences[name], value]
                : prevPreferences[name].filter((item) => item !== value);
            return { ...prevPreferences, [name]: updatedCategory };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted successfully', formData);
        console.log("Update Clicked");

        const url = baseUrl+ "/update/" + userId;
        const theBody = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            location: formData.location,
            profileImgUrl: formData.profileImgUrl,
            exerciseType: preferences.exerciseType,
            workoutEnvironment: preferences.workoutEnvironment,
            intensityLevel: preferences.intensityLevel,
            duration: preferences.duration,
            timeOfDay: preferences.timeOfDay,
            goals: preferences.goals,
            equipment: preferences.equipment,
        };

        console.log("BODY: ", theBody);
        const fetchOptions = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(theBody)
        };

        console.log("FETCH OPTIONS: ", fetchOptions);

        fetch(url, fetchOptions)
            .then(r => r.json())
            .then(data => {
                if (!data.alreadyExisted) {
                    // Cookies.set('userId', userId, { path: '/' });
                    navigate('/userprofile/' + userId);
                } else {
                    navigate('/login');
                }
                console.log("The Body Data: ", data);
            })
            .catch(error => {
                console.error('Error during registration:', error);
            });
        console.log('Submitted Preferences:', preferences, formData);
    };

    return (
        <div className='main-container'>
            <div className="nav"><Nav /></div>

            <div className='pref-detail-box'>
                <div className='form-box'>
                    <form onSubmit={handleSubmit}>
                        <div className='contact'>
                            <h3>{profile?.firstName} {profile?.lastName}</h3>
                            <div>
                                <label htmlFor="firstName" className="form-label mt-4">First Name: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="form-label mt-4">Last Name: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="form-label mt-4">Location: </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <br />
                        </div>
                        {/* Exercise Type */}
                        <div className='pref-form '>
                            <div className='activity-pref'>

                                <h2 className="title">Exercise Type</h2>
                                <div className="pref-grid-container" >

                                    {['Cardio', 'Strength Training', 'Flexibility and Balance', 'Endurance', 'Sports and Activities', 'Group Workouts'].map((category) => (
                                        <div className="card border-primary mb-3" style={{ width: '18rem', height: '32rem', textAlign: 'left' }} key={category}>
                                            <h5 className="card-header">{category}</h5>
                                            <div className="d-flex flex-column card-body">
                                                {category === 'Cardio' && ['Running', 'Cycling', 'Swimming', 'Rowing', 'JumpRope', 'HIIT', 'Dancing', 'Elliptical', 'Hiking', 'Kickboxing'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`cardio-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`cardio-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                                {category === 'Strength Training' && ['Weightlifting', 'BodyweightExercises', 'ResistanceBandTraining', 'Powerlifting', 'OlympicLifting', 'CrossFit', 'KettlebellWorkouts', 'CircuitTraining', 'StrongmanTraining', 'Calisthenics'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`strength-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`strength-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                                {category === 'Flexibility and Balance' && ['Yoga', 'Pilates', 'StretchingRoutines', 'TaiChi', 'BalanceExercises', 'Barre', 'FoamRolling', 'Dance-basedWorkouts', 'Gymnastics', 'MobilityDrills'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`flexibility-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`flexibility-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                                {category === 'Endurance' && ['Long-distanceRunning', 'Hiking', 'Triathlons', 'Marathons', 'CyclingTours', 'TrailRunning', 'OpenWaterSwimming', 'UltraMarathons', 'RowingRaces', 'EnduranceChallenges'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`endurance-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`endurance-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                                {category === 'Sports and Activities' && ['Basketball', 'Soccer', 'Tennis', 'Golf', 'MartialArts', 'RockClimbing'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`sports-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`sports-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                                {category === 'Group Workouts' && ['YogaClasses', 'PilatesClasses', 'CrossFitClasses', 'MartialArtsClasses', 'Zumba'].map((type) => (
                                                    <div className="grid-item pref-card form-check m-2" key={type}>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="exerciseType"
                                                            value={type}
                                                            checked={preferences.exerciseType.includes(type)}
                                                            onChange={handleChange}
                                                            id={`group-${type}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`group-${type}`}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>


                            {/* Workout Environment */}
                            <div className='other-pref'>

                                <div className='pref-grid-container'>
                                    <div>
                                        <h2 className="title">Workout Environment</h2>
                                        {['Gym', 'Home', 'Outdoor', 'Studio', 'Sports facilities', 'Mixed environments', 'Virtual'].map((type) => (
                                            <div className="grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="workoutEnvironment"
                                                    value={type}
                                                    checked={preferences.workoutEnvironment.includes(type)}
                                                    onChange={handleChange}
                                                    id={`workoutEnvironment-${type}`}
                                                />
                                                <label className="form-check-label" htmlFor={`workoutEnvironment-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Intensity Level */}
                                    <div>
                                        <h2 className="title">Intensity Level</h2>
                                        {['Low', 'Moderate', 'High'].map((type) => (
                                            <div className=" grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="intensityLevel"
                                                    value={type}
                                                    checked={preferences.intensityLevel.includes(type)}
                                                    onChange={handleChange}
                                                    id={`intensityLevel-${type}`}
                                                />
                                                <label className="grid-item form-check-label" htmlFor={`intensityLevel-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Duration */}
                                    <div>
                                        <h2 className="title">Duration</h2>
                                        {['Under 30 minutes', '30-60 minutes', '1-2 hours', 'Over 2 hours'].map((type) => (
                                            <div className="grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="duration"
                                                    value={type}
                                                    checked={preferences.duration.includes(type)}
                                                    onChange={handleChange}
                                                    id={`duration-${type}`}
                                                />
                                                <label className="form-check-label" htmlFor={`duration-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Time of Day */}
                                    <div>
                                        <h2 className="title">Time of Day</h2>
                                        {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((type) => (
                                            <div className="grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="timeOfDay"
                                                    value={type}
                                                    checked={preferences.timeOfDay.includes(type)}
                                                    onChange={handleChange}
                                                    id={`timeOfDay-${type}`}
                                                />
                                                <label className="form-check-label" htmlFor={`timeOfDay-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Goals */}
                                    <div>
                                        <h2 className="title">Goals</h2>
                                        {['Weight loss', 'Muscle gain', 'Improving endurance', 'Flexibility', 'General fitness', 'Mental well-being', 'Sport-specific training', 'Rehabilitation', 'Social interaction', 'Skill development'].map((type) => (
                                            <div className="grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="goals"
                                                    value={type}
                                                    checked={preferences.goals.includes(type)}
                                                    onChange={handleChange}
                                                    id={`goals-${type}`}
                                                />
                                                <label className="form-check-label" htmlFor={`goals-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Equipment */}
                                    <div>
                                        <h2 className="title">Equipment</h2>
                                        {['Free weights', 'Resistance bands', 'Cardio machines', 'Bodyweight', 'Yoga mats', 'Kettlebells', 'Medicine balls', 'TRX', 'Machines', 'No equipment'].map((type) => (
                                            <div className="grid-item form-check" key={type}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="equipment"
                                                    value={type}
                                                    checked={preferences.equipment.includes(type)}
                                                    onChange={handleChange}
                                                    id={`equipment-${type}`}
                                                />
                                                <label className="form-check-label" htmlFor={`equipment-${type}`}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={deleteUser}>Delete Profile</button>
                        </div>
                    </form>

                </div>
            </div>

        </div>



    );
};

export default FitnessPreferencesForm;
