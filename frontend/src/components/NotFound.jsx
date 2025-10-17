import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen items-center justify-center font-bold text-3xl">
      <h2>404 | Page not found!</h2>
      <br />
      <Button className='rounded-3xl w-[150px] h-10 ' onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
};

export default NotFound;
