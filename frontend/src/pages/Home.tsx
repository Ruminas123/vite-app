import './../css/home.scss';
import image1 from './../assets/create_employee.png';
import image2 from './../assets/awat_form.png';
import image3 from './../assets/dashboard.png';
import image4 from './../assets/awat_statistics.png';
import { Link } from "react-router-dom";
import { useAuth } from "../authen/AuthContext.tsx";

export function Home() {
    const { user, henchman  } = useAuth();
    const Admin = user?.employee_status === 2;
    const Employee = user?.employee_status === 1;

    return (
        <div id="home">
            {Admin && (
                <>
                    <Link to="/vite-app/create-employee" className="card">
                        <img src={image1} alt="Card Image 1" className="card-image" />
                        <p className="card-title">CREATE EMPLOYEE</p>
                    </Link>
                    <Link to="/vite-app/create-position" className="card">
                        <img src={image1} alt="Card Image 1" className="card-image" />
                        <p className="card-title">CREATE POSITION</p>
                    </Link>
                    <Link to="/vite-app/dashboard" className="card">
                        <img src={image3} alt="Card Image 3" className="card-image" />
                        <p className="card-title">DASHBOARD</p>
                    </Link>
                </>
            )}
            {Employee && (
                <>
                    <Link to="/vite-app/awat-form" className="card">
                        <img src={image2} alt="Card Image 2" className="card-image" />
                        <p className="card-title">AWAT FORM</p>
                    </Link>
                    {henchman.length && (
                        <Link to="/vite-app/awat-team-list" className="card">
                            <img src={image2} alt="Card Image 2" className="card-image" />
                            <p className="card-title">AWAT TEAM</p>
                        </Link>
                    )}
                    <Link to="/vite-app/awat-statistics" className="card">
                        <img src={image4} alt="Card Image 4" className="card-image" />
                        <p className="card-title">AWAT STATISTICS</p>
                    </Link>
                </>
            )}
        </div>
    );
}
