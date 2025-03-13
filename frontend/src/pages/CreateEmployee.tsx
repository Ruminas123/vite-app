import React, { useState } from "react";
import './../css/createEmployee.scss';
import {
  Box, Button, Typography, Modal, FormControl, RadioGroup,
  FormControlLabel, Radio, TextField
} from "@mui/material";
import Swal from 'sweetalert2';

// Define the Employee type
interface Employee {
  id: number;
  name: string;
  surname: string;
  employeeId: string;
  password: string;
  position: string;
}

export function CreateEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    title: "",
    name: "",
    surname: "",
    employeeId: "",
    password: "",
    position: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission state

  // Open & Close Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewEmployee({ title: "", name: "", surname: "", employeeId: "", password: "", position: "" }); // Reset form
    setErrors({});
    setIsSubmitted(false); // Reset submission state
  };

  // Validation function
  const validateForm = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!newEmployee.title) tempErrors.title = "โปรดเลือกคำนำหน้าชื่อ";
    if (!newEmployee.name) tempErrors.name = "โปรดกรอกชื่อ";
    if (!newEmployee.surname) tempErrors.surname = "โปรดกรอกนามสกุล";
    if (!newEmployee.employeeId) tempErrors.employeeId = "โปรดกรอกรหัสพนักงาน";
    if (!newEmployee.password) tempErrors.password = "โปรดกรอกรหัสผ่าน";
    if (!newEmployee.position) tempErrors.position = "โปรดกรอกตำแหน่งงาน";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  // Handle adding a new employee
  const handleAddEmployee = () => {
    setIsSubmitted(true); // Mark the form as submitted

    if (!validateForm()) return; // Stop if validation fails

    setEmployees((prevEmployees) => [
      ...prevEmployees,
      {
        id: prevEmployees.length + 1,
        ...newEmployee,
      },
    ]);

    Swal.fire("สำเร็จ!", "พนักงานถูกเพิ่มเรียบร้อยแล้ว", "success");
    closeModal(); // Close modal after adding
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบพนักงานนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
        Swal.fire("ลบแล้ว!", "พนักงานถูกลบออกจากระบบ", "success");
      }
    });
  };

  // Handle input change to clear errors when the user starts typing
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({ ...newEmployee, [field]: e.target.value });

    // Clear the error for the specific field if it has an error
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div id="createEmployee" className="p-4 max-w-md mx-auto">
      <button onClick={openModal} className="mb-3 bg-green-500 text-white px-4 py-2 rounded">
        เพิ่มพนักงาน
      </button>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Employee List */}
      <ul className="space-y-2">
        {employees.filter(emp => emp.name.includes(searchQuery)).map((employee) => (
          <li key={employee.id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
            <span>
              <strong>{employee.name}</strong> - {employee.position}
            </span>
            <button onClick={() => handleDelete(employee.id)} className="bg-red-500 text-white px-2 py-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add Employee Modal */}
      <Modal id="modal-create-employee" open={isModalOpen} onClose={closeModal} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "60%" },
            maxWidth: "600px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "90vh"
          }}
        >
          <Typography id="modal-title" variant="h6" sx={{ textAlign: "center" }}>กรอกข้อมูลพนักงาน</Typography>

          <FormControl error={isSubmitted && !!errors.title} sx={{ mt: 2 }}>
            <RadioGroup
              row
              value={newEmployee.title}
              onChange={(e) => {
                setNewEmployee({ ...newEmployee, title: e.target.value });

                // Clear the error for the 'title' field when the user selects an option
                if (errors.title) {
                  setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.title;
                    return newErrors;
                  });
                }
              }}
            >
              <FormControlLabel
                value="mr"
                control={<Radio sx={{ color: isSubmitted && errors.title ? "red" : "inherit" }} />}
                label={<Typography sx={{ color: isSubmitted && errors.title ? "red" : "inherit" }}>นาย</Typography>}
              />
              <FormControlLabel
                value="mrs"
                control={<Radio sx={{ color: isSubmitted && errors.title ? "red" : "inherit" }} />}
                label={<Typography sx={{ color: isSubmitted && errors.title ? "red" : "inherit" }}>นางสาว</Typography>}
              />
            </RadioGroup>
            <Box className="custom-box" >{isSubmitted && errors.title && <Typography color="error">{errors.title}</Typography>}</Box>
          </FormControl>

          <Box display="flex" justifyContent="center" gap={2} sx={{ mt: 2 }}>
            <TextField
              label="ชื่อ"
              value={newEmployee.name}
              onChange={handleInputChange("name")}
              fullWidth
              error={isSubmitted && !!errors.name}
              helperText={isSubmitted && errors.name}
            />

            <TextField
              label="นามสกุล"
              value={newEmployee.surname}
              onChange={handleInputChange("surname")}
              fullWidth
              error={isSubmitted && !!errors.surname}
              helperText={isSubmitted && errors.surname}
            />
          </Box>

          <TextField
            label="รหัสพนักงาน"
            value={newEmployee.employeeId}
            onChange={handleInputChange("employeeId")}
            fullWidth sx={{ mt: 2 }}
            error={isSubmitted && !!errors.employeeId}
            helperText={isSubmitted && errors.employeeId}
          />

          <TextField
            label="ตำแหน่ง"
            value={newEmployee.position}
            onChange={handleInputChange("position")}
            fullWidth sx={{ mt: 2 }}
            error={isSubmitted && !!errors.position}
            helperText={isSubmitted && errors.position}
          />

          <TextField
            label="รหัสผ่าน"
            type="password"
            value={newEmployee.password}
            onChange={handleInputChange("password")}
            fullWidth sx={{ mt: 2 }}
            error={isSubmitted && !!errors.password}
            helperText={isSubmitted && errors.password}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="contained" color="success" onClick={handleAddEmployee}>เพิ่มพนักงาน</Button>
            <Button onClick={closeModal} variant="contained" color="warning">ยกเลิก</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
