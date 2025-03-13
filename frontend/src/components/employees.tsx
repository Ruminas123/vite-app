import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Employee {
  employee_department_id: number;
  employee_permission_id: number;
  employee_position_id: number;
  employee_id: number;
  employee_date: string;
  employee_fullname: string;
  employee_username: string;
  employee_status: number;
}

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(axios.isAxiosError(err) ? err.message : "An unexpected error occurred");
        setLoading(false);
      });
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, loading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
