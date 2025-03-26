import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosResponse, AxiosError } from 'axios';
import './../css/createEmployee.scss';
import { Box, Button, Typography, Modal, FormControl, RadioGroup, FormControlLabel, Radio, TextField, Select, MenuItem, InputLabel, Autocomplete } from "@mui/material";
import { Tree, TreeDragDropEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { NodeService } from '../service/NodeService.tsx';

import Swal from 'sweetalert2';

interface Employee {
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
}

export function CreateEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<{ position_id: number; position_name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ title: "", name: "", surname: "", employeeId: "", password: "", position: "", supervisorId: "", });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any>(null);
  const treeRef = useRef<any>(null);

  const get_employee = () => {
    axios.get("http://localhost:5000/employees")
      .then((response: AxiosResponse<Employee[]>) => {
        setEmployees(response.data);
        NodeService.getTreeNodes(response.data).then((data) => {
          setNodes(data);
          expandAllNodes(data);
        });
      })
      .catch((err: AxiosError) => {
        console.error('Error fetching employees:', err);
      });
  };
  const get_position = () => {
    axios
      .get("http://localhost:5000/positions")
      .then((response: AxiosResponse<{ position_id: number; position_name: string }[]>) => { setPositions(response.data) })
      .catch((err: AxiosError) => { Swal.fire("Error", "Failed to fetch positions", "error") });
  };
  const del_position = (id: number) => {
    axios
      .delete(`http://localhost:5000/deleteEmployee/${id}`) // Call correct delete endpoint
      .then(() => {
        setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.employee_id !== id));
        Swal.fire("ลบแล้ว!", "พนักงานถูกลบออกจากระบบ", "success");
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to delete employee", "error");
      });
  };
  useEffect(() => {
    get_employee();
    get_position();
  }, []);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEmployee({ ...newEmployee, [field]: e.target.value });
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
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
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        del_position(id);
      }
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // if (!newEmployee.title) newErrors.title = "กรุณาเลือกคำนำหน้า";
    if (!newEmployee.name) newErrors.name = "กรุณากรอกชื่อ";
    if (!newEmployee.surname) newErrors.surname = "กรุณากรอกนามสกุล";
    if (!newEmployee.employeeId) newErrors.employeeId = "กรุณากรอกรหัสพนักงาน";
    if (!newEmployee.supervisorId) newErrors.supervisorId = "กรุณาเลือกหัวหน้า";  // ตรวจสอบ supervisorId
    if (!newEmployee.position) newErrors.position = "กรุณากรอกตำแหน่ง";
    if (!newEmployee.password) newErrors.password = "กรุณากรอกรหัสผ่าน";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);

    if (validateForm()) {
      const employeeData = {
        fullname: `คุณ${newEmployee.name} ${newEmployee.surname}`,
        username: newEmployee.employeeId,
        key: newEmployee.supervisorId,
        password: newEmployee.password,
        position_id: newEmployee.position,
      };
      axios
        .post("http://localhost:5000/createEmployee", employeeData)
        .then((response: AxiosResponse) => {
          setEmployees((prevEmployees) => [...prevEmployees, response.data.values]);
          Swal.fire("สำเร็จ!", "พนักงานถูกเพิ่มเรียบร้อยแล้ว", "success");
          setIsModalOpen(false);
          setNewEmployee({ title: "", name: "", surname: "", employeeId: "", password: "", position: "", supervisorId: "" });
        })
        .catch((err: AxiosError) => { Swal.fire("Error", "Failed to add employee", "error"); });
    }
  };

  const expandAllNodes = (nodes: TreeNode[]) => {
    const keysToExpand: { [key: string]: boolean } = {};
  
    const collectKeys = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (node.key) {keysToExpand[node.key] = true}
        if (node.children && node.children.length > 0) {collectKeys(node.children)}
      });
    };
    collectKeys(nodes);
    setExpandedKeys(keysToExpand);
  };
  
  const resetKeys = (nodes: TreeNode[], parentKey: string = ''): TreeNode[] => {
    return nodes.map((node, index) => {
      const newKey = parentKey ? `${parentKey}-${index}` : `${index}`;
      const newNode: TreeNode = { ...node, key: newKey, children: node.children ? resetKeys(node.children, newKey) : [] };
      return newNode;
    });
  };

  const handleDragDrop = async (e: TreeDragDropEvent) => {
    const updatedNodes = resetKeys(e.value);
    expandAllNodes(updatedNodes);
    setNodes(updatedNodes);
    console.log('updatedNodes :>> ', updatedNodes);
    // Make a request to the backend to update employee keys
    try {
      await axios.post("http://localhost:5000/updatekeyfromID", updatedNodes);
      console.log('Employee keys updated successfully!');
    } catch (err) {
      console.error('Error updating employee keys:', err);
    }
  };
  const customNodeTemplate = (node: TreeNode) => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <span>{node.label}</span>
        <button style={{ display: "none"}}
          onClick={(e) => {e.stopPropagation();
          if (node.key !== undefined) {handleDelete(Number(node.key));}}} 
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    );
  };
  
  return (
    <div id="createEmployee" className="p-4 max-w-md mx-auto">
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button onClick={() => setIsModalOpen(true)} style={{ width: "9rem", height: "fit-content" }}>เพิ่มพนักงาน</button>
      </div>
      <div id="Tree">
        <Tree
          ref={treeRef}
          value={nodes}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          dragdropScope="demo"
          onDragDrop={handleDragDrop}
          className="body"
          nodeTemplate={customNodeTemplate} 
        />
      </div>

      <Modal id="modal-create-employee" open={isModalOpen} onClose={() => setIsModalOpen(false)} aria-labelledby="modal-title">
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

          {/* <FormControl error={isSubmitted && !!errors.title} sx={{ mt: 2 }}>
            <RadioGroup
              row
              value={newEmployee.title}
              onChange={(e) => {
                setNewEmployee({ ...newEmployee, title: e.target.value });
                if (errors.title) {
                  setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.title;
                    return newErrors;
                  });
                }
              }}
            >
              <FormControlLabel value="นาย" control={<Radio />} label="นาย" />
              <FormControlLabel value="นางสาว" control={<Radio />} label="นางสาว" />
            </RadioGroup>
            {isSubmitted && errors.title && <Typography color="error">{errors.title}</Typography>}
          </FormControl> */}

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
            fullWidth
            sx={{ mt: 2 }}
            error={isSubmitted && !!errors.employeeId}
            helperText={isSubmitted && errors.employeeId}
          />
          <FormControl fullWidth sx={{ mt: 2 }} error={isSubmitted && !!errors.supervisorId}>
            <InputLabel>หัวหน้า</InputLabel>
            <Select
              value={newEmployee.supervisorId}  // ใช้ supervisorId แทน employee
              onChange={(e) => setNewEmployee({ ...newEmployee, supervisorId: e.target.value })}  // ตั้งค่า supervisorId
              label="หัวหน้า"
            >
              {employees.map((employee) => (
                <MenuItem key={employee.employee_id} value={employee.employee_key}>
                  {employee.employee_fullname}  {/* ใช้ employee_fullname แทน employee_name */}
                </MenuItem>
              ))}
            </Select>
            {isSubmitted && errors.supervisorId && <Typography color="error">{errors.supervisorId}</Typography>}
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }} error={isSubmitted && !!errors.position}>
            <InputLabel>ตำแหน่ง</InputLabel>
            <Select
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              label="ตำแหน่ง"
            >
              {positions.map((position) => (
                <MenuItem key={position.position_id} value={position.position_id}>
                  {position.position_name}
                </MenuItem>
              ))}
            </Select>
            {isSubmitted && errors.position && <Typography color="error">{errors.position}</Typography>}
          </FormControl>

          <TextField
            label="รหัสผ่าน"
            type="password"
            value={newEmployee.password}
            onChange={handleInputChange("password")}
            fullWidth
            sx={{ mt: 2 }}
            error={isSubmitted && !!errors.password}
            helperText={isSubmitted && errors.password}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button onClick={handleSubmit} variant="contained" color="success">เพิ่มพนักงาน</Button>
            <Button onClick={() => setIsModalOpen(false)} variant="contained" color="warning">ยกเลิก</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
