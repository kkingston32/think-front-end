// GoalTracker.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoalTracker = ({ userId }) => {
    const [goals, setGoals] = useState([]);
    const [streaks, setStreaks] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3232/usergoals/${userId}`)
            .then(response => {
                setGoals(response.data.goals);
                setStreaks(response.data.streaks);
            })
            .catch(error => console.error("Error fetching goals: ", error));
    }, [userId]);

    const handleUpdateProgress = (goalId, increment) => {
        axios.post(`http://localhost:3232/updateGoalProgress/${userId}`, { goalId, increment })
            .then(response => {
                setGoals(response.data.goals);
                setStreaks(response.data.streaks);
            })
            .catch(error => console.error("Error updating goal progress: ", error));
    };

    return (
        <div className="goal-tracker">
            <h3>Goal Tracker</h3>
            <ul>
                {goals.map(goal => (
                    <li key={goal.id}>
                        <span>{goal.name}: {goal.progress}/{goal.target}</span>
                        <button onClick={() => handleUpdateProgress(goal.id, 1)}>+</button>
                        <button onClick={() => handleUpdateProgress(goal.id, -1)}>-</button>
                        <span>Streak: {streaks[goal.id] || 0} days</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalTracker;
