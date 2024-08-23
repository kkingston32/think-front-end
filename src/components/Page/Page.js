import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../Nav/Nav';

const Page = () => {
    const [pageDetails, setPageDetails] = useState();
    const { pageInfo } = useParams();
    console.log("PAGE INFO: ", pageInfo)


    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'

    useEffect(() => {
        const getPageInfo = async () => {
            try {
                const response = await fetch(baseUrl + `/page/${pageInfo}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // credentials: 'include',
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
        <div className='main-container'>
            <div className="nav"><Nav /></div>
            <div className="page-details-container">

                <div className="page-details-content">
                    <div className="image-container">
                        <img className="preview-image" src={pageDetails?.ImgUrl} alt={pageDetails?.Name} />
                    </div>
                    <div className="page-info">
                        <h1 className="page-title">{pageDetails?.Name}</h1>
                        <p className="page-description">{pageDetails?.Description}</p>
                        <div className="page-metrics">
                            <p><strong><b>Category:</b></strong> {pageDetails?.Category}</p>
                            <p><strong><b>Intensity Level:</b></strong> {pageDetails?.IntensityLevel}</p>
                            <p><strong><b>Duration:</b></strong> {pageDetails?.Duration}</p>
                            <p><strong><b>Calories Burned:</b></strong> {pageDetails?.CaloriesBurned}</p>
                            <p><strong><b>Location:</b></strong> {pageDetails?.Location}</p>
                        </div>
                        <div className="page-details-grid">
                            <div><strong>Benefits:</strong> {pageDetails?.Benefits}</div>
                            <div><strong>Equipment Needed:</strong> {pageDetails?.EquipmentNeeded}</div>
                            <div><strong>Suitable For:</strong> {pageDetails?.SuitableFor}</div>
                            <div><strong>Muscles Worked:</strong> {pageDetails?.MusclesWorked}</div>
                            <div><strong>Frequency:</strong> {pageDetails?.Frequency}</div>
                            <div><strong>Examples:</strong> {pageDetails?.Examples}</div>
                            <div><strong>Safety Tips:</strong> {pageDetails?.SafetyTips}</div>
                            <div><strong>Progression:</strong> {pageDetails?.Progression}</div>
                            <div><strong>Resources:</strong> {pageDetails?.Resources}</div>
                            <div><strong>Community:</strong> {pageDetails?.Community}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Page;
