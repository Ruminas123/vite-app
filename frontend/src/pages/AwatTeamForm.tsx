import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import "./../css/AwatTeamForm.scss";
import { useParams } from 'react-router-dom';


// Define a type for the form values
type FormValues = {
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    field9: string;
    field10: string;
    employee_id?: number;
};

export function AwatTeamForm() {
    const [userTeam, setUserTeam] = useState<any>(null); 
    const { employee_id } = useParams<{ employee_id: string }>(); 
    const [hasExistingData, setHasExistingData] = useState(false);
    const [formValues, setFormValues] = useState<FormValues>({
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
        field9: '',
        field10: ''
    });

    const [originalValues, setOriginalValues] = useState<FormValues | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() + 543;

    const thaiLabels = [
        '1. ประสิทธิภาพในการปฏิบัติงานที่ได้รับมอบ',
        '2. การจัดการ และการวางแผนงาน',
        '3. การสังเกตและ การบริหารเวลา',
        '4. ประหยัดน่าใช้จ่าย เช่น ค่าอาหาร ค่าเดินทาง',
        '5. การเรียนรู้การใช้เทคโนโลยีในการทำงาน',
        '6. ภาวะความกดดันในการทำงาน สิ่งเฉลียว',
        '7. เครื่องมือ ของอุปกรณ์ความถนัดในการทำงาน',
        '8. การเพิ่มมูลฐานองค์กรทั่งที่เกี่ยวข้อง',
        '9. ความสุขหรือสนุก ในการทำงาน',
        '10. ความพึงพอใจในการร่วมโครงการ AWAT'
    ];

    useEffect(() => {
        const allFieldsFilled = Object.values(formValues).every(
            value => value !== '' && !isNaN(Number(value))
                && Number(value) >= 0 && Number(value) <= 10
        );
    }, [formValues]);

    useEffect(() => {
        if (employee_id) {
            axios.get(`http://localhost:5000/getAwatMonth/${employee_id}`)
                .then((response: AxiosResponse) => {
                    if (response.data) {
                        const fetchedValues = {
                            field1: response.data.awat_one ?? '',
                            field2: response.data.awat_two ?? '',
                            field3: response.data.awat_three ?? '',
                            field4: response.data.awat_four ?? '',
                            field5: response.data.awat_five ?? '',
                            field6: response.data.awat_six ?? '',
                            field7: response.data.awat_seven ?? '',
                            field8: response.data.awat_eight ?? '',
                            field9: response.data.awat_nine ?? '',
                            field10: response.data.awat_ten ?? ''
                        };
                        setFormValues(fetchedValues);
                        setOriginalValues(fetchedValues);
                        setHasExistingData(true);
                    } else {
                        setHasExistingData(false);
                    }
                })
                .catch((error: AxiosError) => {
                    console.error("Error fetching survey data:", error);
                });
        }

        axios.get(`http://localhost:5000/getEmployees/${employee_id}`)                
            .then((response: AxiosResponse) => {
                if(response.data){ setUserTeam(response.data); }
            })
            .catch((error: AxiosError) => {
                console.error("Error fetching survey data:", error);
            });
    }, [employee_id]);

    const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value !== '' && !isNaN(Number(value))) {value = String(parseInt(value, 10))}
        if (value === '' || (Number(value) >= 0 && Number(value) <= 10)) {setFormValues(prev => ({...prev, [field]: value}))}
    };


    return (
        <div id="awatTeamForm">
            <h2 className="txt-topic" style={{ marginBottom: "2rem" }}>
                แบบประเมินความพึงพอใจ {userTeam?.employee_fullname} เดือน {months[currentMonth]} {currentYear}
            </h2>

            <form>
                {thaiLabels.map((label, index) => {
                    const fieldKey = `field${index + 1}` as keyof FormValues;
                    return (
                        <div key={fieldKey} className="list-form">
                            <label htmlFor={fieldKey}>{label}</label>
                            <input
                                id={fieldKey}
                                type="number"
                                min="0"
                                max="10"
                                value={formValues[fieldKey]}
                                onChange={handleChange(fieldKey)}
                                placeholder="0-10"
                                className='input-score'
                                required
                                readOnly
                            />
                        </div>
                    );
                })}
            </form>
        </div>
    );
}

export default AwatTeamForm;
