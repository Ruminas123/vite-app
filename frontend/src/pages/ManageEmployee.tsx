import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import axios, { AxiosResponse, AxiosError } from 'axios';

interface Employee {
  employee_id: number;
  employee_permission_id: number;
  employee_department_id: number;
  employee_position_id: number;
  employee_fullname: string;
  employee_username: string;
  employee_password: string;
  employee_status: number;
  employee_date: string;
}

export function ManageEmployee() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response: AxiosResponse<Employee[]>) => {
        setEmployees(response.data);
      })
      .catch((err: AxiosError) => {
        console.error('Error fetching employees:', err);
      });
  }, []);

  return (
    <Autocomplete
      options={employees}
      getOptionLabel={(employee) => employee.employee_fullname} // Display full name in the dropdown
      value={selectedEmployee}
      onChange={(event, newValue) => setSelectedEmployee(newValue)}
      renderInput={(params) => <TextField {...params} label="ค้นหาพนักงาน" variant="outlined" />}
      fullWidth
    />
  );
}
