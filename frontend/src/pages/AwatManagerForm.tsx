import React, { useState, useEffect } from 'react';
import { useAuth } from "../authen/AuthContext.tsx";
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./../css/awatForm.scss";

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
    manager_id?: number;
    henchman_id?: number;
};

export function AwatManagerForm() {
    const { user } = useAuth();
    const [userTeam, setUserTeam] = useState<any>(null);
    const { henchman_id } = useParams<{ henchman_id: string }>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasExistingData, setHasExistingData] = useState(false);
    const [originalValues, setOriginalValues] = useState<FormValues | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear() + 543;

    const thaiLabels = [
        '1. งานแล้วเสร็จตามคาดหวัง',
        '2. ริมาณผลงานที่สามารถปฏิบัติได้',
        '3. คุณภาพของงานที่ปฏิบัติได้',
        '4. มีการวางแผนอย่างเป็นระบบ',
        '5. ความรับผิดชอบต่อหน้าที่ที่ได้รับมอบหมาย',
        '6. การเรียนรู้การใช้เทคโนโลยีในการทำงาน',
        '7. การประสานงานและการให้ความร่วมมือ',
        '8. ความสามารถในการตัดสินใจต่อปัญหา',
        '9. ความสามารถในการติดต่อสื่อสาร',
        '10. ประสิทธิภาพในการทำงานของบุคลากร'
    ];

    useEffect(() => {
        const allFieldsFilled = Object.values(formValues).every(
            value => value !== '' && !isNaN(Number(value))
                && Number(value) >= 0 && Number(value) <= 10
        );
    }, [formValues]);

    useEffect(() => {
        if (user?.employee_id && henchman_id) {
            axios.get(`http://localhost:5000/getAwatManager/${user.employee_id}/${henchman_id}`)
                .then((response: AxiosResponse) => {
                    console.log('response.data :>> ', response.data.data);
                    if (response.data?.status) {
                        const fetchedValues = {
                            field1: response.data.data.awat_one ?? '',
                            field2: response.data.data.awat_two ?? '',
                            field3: response.data.data.awat_three ?? '',
                            field4: response.data.data.awat_four ?? '',
                            field5: response.data.data.awat_five ?? '',
                            field6: response.data.data.awat_six ?? '',
                            field7: response.data.data.awat_seven ?? '',
                            field8: response.data.data.awat_eight ?? '',
                            field9: response.data.data.awat_nine ?? '',
                            field10: response.data.data.awat_ten ?? ''
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
    }, [user]);

    const handleChange = (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value !== '' && !isNaN(Number(value))) { value = String(parseInt(value, 10)) }
        if (value === '' || (Number(value) >= 0 && Number(value) <= 10)) { setFormValues(prev => ({ ...prev, [field]: value })) }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        Swal.fire({
            title: "ยืนยันการส่งแบบประเมิน?",
            text: hasExistingData ? "คุณต้องการแก้ไขข้อมูลแบบประเมินนี้ใช่หรือไม่?" : "คุณต้องการส่งแบบประเมินนี้ใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ส่งเลย!",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsSubmitting(true);
                formValues.manager_id = Number(user?.employee_id);
                formValues.henchman_id = Number(henchman_id);

                try {
                    if (hasExistingData) {
                        await axios.put("http://localhost:5000/updateAwatManager", formValues);
                        Swal.fire("สำเร็จ!", "อัปเดตข้อมูลแบบประเมินเรียบร้อยแล้ว", "success");
                    } else {
                        await axios.post("http://localhost:5000/createAwatManager", formValues);
                        Swal.fire("สำเร็จ!", "ตอบแบบประเมินเรียบร้อยแล้ว", "success");
                        setHasExistingData(true);
                    }
                    setOriginalValues(formValues);
                    setIsModalOpen(false);
                } catch (error) {
                    Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถบันทึกข้อมูลได้", "error");
                } finally {
                    setIsSubmitting(false);
                }
            }
        });
    };
    return (
        <div id="awatTeamForm">
            <h2 className="txt-topic" style={{ marginBottom: "2rem" }}>
                แบบประเมินความพึงพอใจ {user?.employee_fullname} เดือน {months[currentMonth]} {currentYear}
            </h2>

            <form onSubmit={handleSubmit}>
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
                            />
                        </div>
                    );
                })}

                <button
                    type="submit"
                    className="btn-submit"
                    style={{ backgroundColor: hasExistingData ? "#FFA500" : "#007bff" }}
                >
                    {isSubmitting ? 'กำลังส่ง...' : hasExistingData ? 'แก้ไขข้อมูลแบบสอบถาม' : 'ส่งแบบประเมิน'}
                </button>
            </form>
        </div>
    );
}

export default AwatManagerForm;
