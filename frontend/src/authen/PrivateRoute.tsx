// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authen/AuthContext.tsx'; // สมมุติว่าคุณใช้ Context ในการจัดการสถานะการเข้าสู่ระบบ

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth(); // ตรวจสอบสถานะการเข้าสู่ระบบจาก Context

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // หากยังไม่ได้เข้าสู่ระบบ เปลี่ยนเส้นทางไปที่ /login
  }

  return <>{element}</>; // หากเข้าสู่ระบบแล้ว ให้แสดงหน้า (element) ที่ต้องการ
};

export default PrivateRoute;
