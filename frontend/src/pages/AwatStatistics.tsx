import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Select, MenuItem } from "@mui/material";

import './../css/awatStatistics.scss';

export function AwatStatistics() {
    const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
    const [formlist, setFormlist] = useState<any[]>([]);

    const thaiLabels = [
        "ประสิทธิภาพในการปฏิบัติงานที่ได้รับมอบ", "การจัดการ และการวางแผนงาน", "การจัดสรรเวลา การบริหารเวลา",
        "ประหยัดค่าใช้จ่าย เช่น ค่าอาหาร ค่าเดินทาง", "การได้เรียนรู้การใช้เทคโนโลยีในการทำงาน",
        "ภาวะความกดดันในการทำงาน สิ่งแวดล้อม", "เครื่องมือ วัสดุอุปกรณ์ความสะดวกในการทำงาน",
        "การสนับสนุนจากส่วนงานที่เกี่ยวข้อง", "ความสุขหรือสนุก ในการทำงาน", "ความพึงพอใจในการร่วมโครงการ AWAT"
    ];

    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    useEffect(() => {
        if (user?.employee_id) {
            axios.get(`http://localhost:5000/getAwat/${user.employee_id}`)
                .then((response: AxiosResponse) => {
                    const transformedData = transformFieldNames(response.data);
                    setFormlist(sortDataByDate(transformedData));
                })
                .catch((error: AxiosError) => {
                    console.error("Error fetching survey data:", error);
                });
        }
    }, [user]);

    const transformFieldNames = (data: any[]) => {
        return data.map(item => {
            const transformedItem: any = { ...item };
            for (let i = 1; i <= 10; i++) {
                const originalKey = `awat_${getFieldName(i)}`;
                if (transformedItem[originalKey]) {
                    transformedItem[`awat_${i}`] = transformedItem[originalKey];
                    delete transformedItem[originalKey];
                }
            }
            return transformedItem;
        });
    };

    const getFieldName = (index: number) => ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][index - 1];

    const sortDataByDate = (data: any[]) => data.sort((a, b) => new Date(a.awat_date).getTime() - new Date(b.awat_date).getTime());

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    return (
        <div id="awatStatistics">
            <h2 className="txt-topic" style={{ marginBottom: "2rem", textAlign: "center" }}>รายงานสถิติแบบประเมินความพึงพอใจ</h2>

            <div className='action'>
            <button style={{ marginRight: "0.5rem" }}>PDF</button>
            <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    fullWidth
                >
                    {years.map((year) => (<MenuItem key={year} value={year}>{year}</MenuItem>))}
                </Select>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {months.map((month, index) => <th key={index}>{month}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {thaiLabels.map((label, index) => (
                            <tr key={index}>
                                <td>{label}</td>
                                {months.map((_, monthIndex) => {
                                    const entry = formlist.filter(item => new Date(item.awat_date).getMonth() === monthIndex);
                                    return <td key={`${index}-${monthIndex}`}>{entry.length ? entry[0][`awat_${index + 1}`] : "-"}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AwatStatistics;
