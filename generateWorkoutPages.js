const fs = require('fs');
const path = require('path');

// Define your workout types and schema
const workoutTypes = [
    "Running", "Cycling", "Swimming", "Rowing", "Jump Rope",
    "High-Intensity Interval Training (HIIT)", "Dancing", "Elliptical", 
    "Hiking", "Kickboxing", "Weightlifting", "Bodyweight exercises", 
    "Resistance band training", "Powerlifting", "Olympic lifting", 
    "CrossFit", "Kettlebell workouts", "Circuit training", 
    "Strongman training", "Calisthenics", "Yoga", "Pilates", 
    "Stretching routines", "Tai Chi", "Balance exercises", "Barre", 
    "Foam rolling", "Dance-based workouts", "Gymnastics", 
    "Mobility drills", "Long-distance running", "Triathlons", 
    "Marathons", "Cycling tours", "Trail running", 
    "Open water swimming", "Ultra marathons", "Rowing races", 
    "Endurance challenges", "Basketball", "Soccer", "Tennis", 
    "Martial Arts", "Dance", "Volleyball", "Golf", "Rock climbing", 
    "Badminton", "Table tennis", "CrossFit classes", "Bootcamp workouts", 
    "Spinning classes", "Zumba", "Yoga classes", "Pilates classes", 
    "Martial arts classes", "Dance classes", "Group running sessions", 
    "Group hiking"
];

// Define your component boilerplate using rafce
const componentTemplate = (name) => `
import React from 'react';

const ${name.replace(/\s+/g, '')} = () => {
    return (
        <div>
            <h1>${name}</h1>
            <p>Description: [Description]</p>
            <p>Category: [Category]</p>
            <p>Benefits: [Benefits]</p>
            <p>Intensity Level: [Intensity Level]</p>
            <p>Duration: [Duration]</p>
            <p>Equipment Needed: [Equipment Needed]</p>
            <p>Suitable For: [Suitable For]</p>
            <p>Calories Burned: [Calories Burned]</p>
            <p>Muscles Worked: [Muscles Worked]</p>
            <p>Frequency: [Frequency]</p>
            <p>Location: [Location]</p>
            <p>Examples: [Examples]</p>
            <p>Safety Tips: [Safety Tips]</p>
            <p>Progression: [Progression]</p>
            <p>Resources: [Resources]</p>
            <p>Community: [Community]</p>
        </div>
    );
};

export default ${name.replace(/\s+/g, '')};
`;

// Define HTML boilerplate
const htmlTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            color: #333;
        }
        p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>${name}</h1>
    <p><strong>Description:</strong> [Description]</p>
    <p><strong>Category:</strong> [Category]</p>
    <p><strong>Benefits:</strong> [Benefits]</p>
    <p><strong>Intensity Level:</strong> [Intensity Level]</p>
    <p><strong>Duration:</strong> [Duration]</p>
    <p><strong>Equipment Needed:</strong> [Equipment Needed]</p>
    <p><strong>Suitable For:</strong> [Suitable For]</p>
    <p><strong>Calories Burned:</strong> [Calories Burned]</p>
    <p><strong>Muscles Worked:</strong> [Muscles Worked]</p>
    <p><strong>Frequency:</strong> [Frequency]</p>
    <p><strong>Location:</strong> [Location]</p>
    <p><strong>Examples:</strong> [Examples]</p>
    <p><strong>Safety Tips:</strong> [Safety Tips]</p>
    <p><strong>Progression:</strong> [Progression]</p>
    <p><strong>Resources:</strong> [Resources]</p>
    <p><strong>Community:</strong> [Community]</p>
</body>
</html>
`;

// Function to create folders and files
const createWorkoutPages = () => {
    workoutTypes.forEach((workout) => {
        const folderPath = path.join(__dirname, 'src', 'components', workout.replace(/\s+/g, ''));
        const componentFilePath = path.join(folderPath, `${workout.replace(/\s+/g, '')}.js`);
        const htmlFilePath = path.join(folderPath, `${workout.replace(/\s+/g, '')}.html`);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Create React component file
        fs.writeFileSync(componentFilePath, componentTemplate(workout));

        // Create HTML file
        fs.writeFileSync(htmlFilePath, htmlTemplate(workout));

        console.log(`Created ${componentFilePath} and ${htmlFilePath}`);
    });
};

// Run the function
createWorkoutPages();