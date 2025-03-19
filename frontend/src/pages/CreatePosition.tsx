import React, { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosError } from "axios";
import "./../css/createPosition.scss";
import {
  Box, Button, Typography, Modal, TextField
} from "@mui/material";
import Swal from "sweetalert2";

interface Position {
  position_id: number;
  position_name: string;
  position_status: boolean;
}

export function CreatePosition() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({ name: "", id: null as number | null });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Delete position
  const del_position = (id: number) => {
    axios
      .delete(`http://localhost:5000/deletePosition/${id}`)
      .then(() => {
        setPositions((prevPositions) => prevPositions.filter((position) => position.position_id !== id));
        Swal.fire("ลบแล้ว!", "ตำแหน่งถูกลบออกจากระบบ", "success");
      })
      .catch(() => {
        Swal.fire("Error", "Failed to delete position", "error");
      });
  };

  // Fetch positions
  useEffect(() => {
    axios
      .get("http://localhost:5000/positions")
      .then((response: AxiosResponse<Position[]>) => {
        setPositions(response.data);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to fetch positions", "error");
      });
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPosition({ ...newPosition, name: e.target.value });
    if (errors.name) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = (id: number) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งนี้?",
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

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (!newPosition.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อตำแหน่ง";
    }
    const isSameAsCurrent = positions.some(
      (position) => position.position_id === newPosition.id && position.position_name.toLowerCase() === newPosition.name.toLowerCase()
    );
  
    if (isSameAsCurrent) {
      newErrors.name = "ไม่สามารถใช้ชื่อเดิมได้ กรุณาเปลี่ยนชื่อ";
    }
  
    const isDuplicate = positions.some(
      (position) => position.position_name.toLowerCase() === newPosition.name.toLowerCase() && position.position_id !== newPosition.id
    );
  
    if (isDuplicate) {
      newErrors.name = "ชื่อตำแหน่งนี้มีอยู่แล้ว";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (create or update)
  const handleSubmit = () => {
    setIsSubmitted(true);
    if (validateForm()) {
      if (newPosition.id) {
        // Edit existing position
        axios
          .put(`http://localhost:5000/editPosition/${newPosition.id}`, { name: newPosition.name })
          .then((response: AxiosResponse) => {
            setPositions((prevPositions) =>
              prevPositions.map((position) =>
                position.position_id === newPosition.id ? response.data : position
              )
            );
            Swal.fire("สำเร็จ!", "ตำแหน่งถูกแก้ไขเรียบร้อยแล้ว", "success");
            setIsModalOpen(false);
            setNewPosition({ name: "", id: null });
          })
          .catch(() => {
            Swal.fire("Error", "Failed to update position", "error");
          });
      } else {
        // Add new position
        axios
          .post("http://localhost:5000/createPosition", { name: newPosition.name })
          .then((response: AxiosResponse) => {
            setPositions((prevPositions) => [...prevPositions, response.data]);
            Swal.fire("สำเร็จ!", "ตำแหน่งถูกเพิ่มเรียบร้อยแล้ว", "success");
            setIsModalOpen(false);
            setNewPosition({ name: "", id: null });
          })
          .catch((error: AxiosError) => {
            if (error.response && error.response.status === 400) {
              setErrors({ name: "ชื่อตำแหน่งนี้มีอยู่แล้ว" });
            } else {
              Swal.fire("Error", "Failed to add position", "error");
            }
          });
      }
    }
  };

  // Open modal for editing
  const openEditModal = (position: Position) => {
    setNewPosition({ name: position.position_name, id: position.position_id });
    setErrors({});
    setIsSubmitted(false);
    setIsModalOpen(true);
  };

  return (
    <div id="createPosition" className="p-4 max-w-md mx-auto">
      <button
        onClick={() => {
          setNewPosition({ name: "", id: null });
          setErrors({});
          setIsSubmitted(false);
          setIsModalOpen(true);
        }}
        className="mb-3 bg-green-500 text-white px-4 py-2 rounded"
      >
        เพิ่มตำแหน่ง
      </button>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <ul className="space-y-2">
        {positions
          .filter((emp) => emp.position_name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((position) => (
            <li key={position.position_id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
              <span>
                <strong>{position.position_name}</strong>
              </span>
              <button onClick={() => openEditModal(position)} className="bg-blue-500 text-white px-2 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(position.position_id)} className="bg-red-500 text-white px-2 py-1 rounded">
                Delete
              </button>
            </li>
          ))}
      </ul>

      <Modal id="modal-create-position" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: "90%",
          maxWidth: "600px", bgcolor: "background.paper",
          boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {newPosition.id ? "แก้ไขตำแหน่ง" : "กรอกข้อมูลตำแหน่ง"}
          </Typography>

          <TextField
            label="ชื่อตำแหน่ง"
            value={newPosition.name}
            onChange={handleInputChange}
            fullWidth
            error={isSubmitted && !!errors.name}
            helperText={isSubmitted && errors.name}
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button onClick={handleSubmit} variant="contained" color="success">
              {newPosition.id ? "บันทึกการแก้ไข" : "เพิ่มตำแหน่ง"}
            </Button>
            <Button onClick={() => setIsModalOpen(false)} variant="contained" color="warning">
              ยกเลิก
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
