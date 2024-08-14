import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';

const Page = () => {
    const [pageDetails, setPageDetails] = useState();
    const { pageInfo } = useParams();
    console.log("PAGE INFO: ", pageInfo)

    useEffect(() => {
        const getPageInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3232/page/${pageInfo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                const data = await response.json();
                console.log(" FE PAGE DATA: ", data)
                setPageDetails(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        getPageInfo();
    }, [pageInfo]);

    console.log("FE PAGE DEETS: ", pageDetails)

    if (!pageDetails) {
        return <div className="loading-screen">
        <div className="spinner"></div>
    </div>;;;
    }

    return (
        <div>
            <Nav />
            <div>
                <div className="image-container">
                <img className='preview-image' src={pageDetails?.ImgUrl}></img>
                </div>
                <h1>{pageDetails?.Name}</h1>
                <p>Description: {pageDetails?.Description}</p>
                <p>Category: {pageDetails?.Category}</p>
                <p>Benefits: {pageDetails?.Benefits}</p>
                <p>Intensity Level: {pageDetails?.IntensityLevel}</p>
                <p>Duration: {pageDetails?.Duration}</p>
                <p>Equipment Needed: {pageDetails?.EquipmentNeeded}</p>
                <p>Suitable For: {pageDetails?.SuitableFor}</p>
                <p>Calories Burned: {pageDetails?.CaloriesBurned}</p>
                <p>Muscles Worked: {pageDetails?.MusclesWorked}</p>
                <p>Frequency: {pageDetails?.Frequency}</p>
                <p>Location: {pageDetails?.Location}</p>
                <p>Examples: {pageDetails?.Examples}</p>
                <p>Safety Tips: {pageDetails?.SafetyTips}</p>
                <p>Progression: {pageDetails?.Progression}</p>
                <p>Resources: {pageDetails?.Resources}</p>
                <p>Community: {pageDetails?.Community}</p>
            </div>
        </div>
    );
};

export default Page;
