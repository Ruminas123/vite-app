import React, { useState, useEffect } from 'react';
import { useAuth } from "../authen/AuthContext.tsx";
import { Link } from 'react-router-dom';
import "./../css/awatTeamList.scss";

// กำหนด type สำหรับ Henchman
interface Henchman {
    employee_id: number;
    employee_permission_id: number;
    employee_department_id: number;
    employee_position_id: number;
    employee_key: string;
    employee_fullname: string;
    employee_username: string;
    employee_password: string;
    employee_status: number;
    employee_date: string;
    awat_month_status: boolean;
}

export function AwatTeamList() {
    const { user, henchman } = useAuth();

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() + 543;

    return (
        <div id="awatTeamList">
            <h2 className="txt-topic" style={{ marginBottom: "2rem", textAlign: "center" }}>
                รายชื่อพนักงานที่อยู่ในความดูแล {user?.employee_fullname} ({months[currentMonth]} {currentYear})
            </h2>

            <div className="henchman-list">
                {henchman.map((item: Henchman, index: number) => (
                    <div key={index} className="henchman-item">
                        <div className="henchman-name">
                            {item.employee_fullname}
                        </div>
                        <div className="henchman-actions">
                            <Link to={`/vite-app/awat-team-form/${item.employee_id}`}>
                                <button disabled={!item?.awat_month_status}>FORM AWAT</button>
                            </Link>
                            <Link to={`/vite-app/awat-manager-form/${item.employee_id}`}>
                                <button disabled={!item?.awat_month_status}>FORM</button>
                            </Link>
                            <Link to={`/vite-app/awat-team-form/${item.employee_id}`}>
                                <button>STATISTIC</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
