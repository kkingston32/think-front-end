import React from 'react'
import Nav from '../Nav/Nav'

const Home = () => {

    let baseUrl= 'https://think-back-end.azurewebsites.net'
    // let baseUrl = 'http://localhost:3232'
    const logo =baseUrl+ "/public/images/THINK.png"

    return (
        <div className='home-container'>
            <div className='nav'><Nav /></div>
            <div >
                <div className='text-center'>
                    <img className='home-logo' src={logo} />
                    <h1 className="text-primary justify-content-center ">T.H.I.N.K</h1>
                </div>
                <p className="text-center">Introducing The Health Integration Network Key (THINK),
                    a groundbreaking social platform poised to revolutionize the way individuals engage
                    with their health and wellness journeys. THINK serves as a dynamic hub, empowering members
                    to inspire and uplift one another through a comprehensive suite of tools and features.</p>
            </div>

        </div>
    )
}

export default Home