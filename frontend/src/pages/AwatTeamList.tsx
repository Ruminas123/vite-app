import React, { useState, useEffect } from 'react';
import { useAuth } from "../authen/AuthContext.tsx";
import "./../css/awatTeamList.scss";


export function AwatTeamList() {
    const { user } = useAuth();

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() + 543;

    return (
        <div id="awatTeamList">
            <h2 className="txt-topic" style={{ marginBottom: "2rem" }}>
             รายชื่อพนักงานที่อยู่ในความดูแล {user?.employee_fullname} ({months[currentMonth]} {currentYear})
            </h2>        
            </div>
    );
}
