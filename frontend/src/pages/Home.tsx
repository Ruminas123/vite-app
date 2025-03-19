import './../css/home.scss';
import image1 from './../assets/create_employee.png';
import image2 from './../assets/manage_employee.png';
import image3 from './../assets/dashboard.png';
import { Link } from "react-router-dom";

export function Home() {
    return (
        <div id="home" className="container">
            <Link to="/vite-app/create-employee" className="card">
                <img src={image1} alt="Card Image 1" className="card-image" />
                <p className="card-title">CREATE EMPLOYEE</p>
            </Link>
            <Link to="/vite-app/create-position" className="card">
                <img src={image1} alt="Card Image 1" className="card-image" />
                <p className="card-title">CREATE POSITION</p>
            </Link>
            <Link to="/vite-app/manage-employee" className="card">
                <img src={image2} alt="Card Image 2" className="card-image" />
                <p className="card-title">MANAGE EMPLOYEE</p>
            </Link>
            <Link to="/vite-app/dashboard" className="card">
                <img src={image3} alt="Card Image 3" className="card-image" />
                <p className="card-title">DASHBOARD</p>
            </Link>
        </div>
    );
}