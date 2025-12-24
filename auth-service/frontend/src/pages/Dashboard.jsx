import React from 'react'
import { AppData } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const {logoutUser} = AppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/", { replace: true });
  };
  return (
    <div className="flex w-[100px] m-auto mt-40 ">
      <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
