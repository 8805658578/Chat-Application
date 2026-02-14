import React, { useState } from "react";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";

const JoinCreateChat = () => {

  const [details, setDetails] = useState({
    roomId: "",
    userName: ""
  });

  const { setroomId, setcurrentUser, setconnected } = useChatContext();
  const navigate = useNavigate();

  // Handle Input Change
  const handleFormInputChange = (event) => {
    const { name, value } = event.target;

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate Form
  const validateForm = () => {
    if (!details.roomId.trim() || !details.userName.trim()) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  // Join Room
  const joinChat = async () => {
    if (!validateForm()) return;

    try {
      await joinChatApi(details.roomId);

      toast.success("Joined Room Successfully");

      setcurrentUser(details.userName);
      setroomId(details.roomId);
      setconnected(true);

      navigate("/chat");

    } catch (error) {
      console.error("Error joining Room:", error);

      if (error.response?.status === 400) {
        toast.error(error.response.data || "Room not found");
      } else {
        toast.error("Failed to Join Room");
      }
    }
  };

  // Create Room
  const createRoom = async () => {
    if (!validateForm()) return;

    try {
      const response = await createRoomApi(details.roomId);

      toast.success("Room Created Successfully");

      setcurrentUser(details.userName);
      setroomId(response.roomId || details.roomId);
      setconnected(true);

      navigate("/chat");

    } catch (error) {
      console.error("Error creating Room:", error);

      if (error.response?.status === 400) {
        toast.error("Room ID already exists. Choose another one.");
      } else {
        toast.error("Room Creation Failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">

        <div>
          <img src={chatIcon} alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        </div>

        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room
        </h1>

        <div>
          <label className="block font-medium mb-2">
            Your Name :
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="dark:bg-gray-600 w-full p-2 mb-3 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="userName"
            value={details.userName}
            onChange={handleFormInputChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Room Id :
          </label>
          <input
            type="text"
            placeholder="Room Id"
            className="dark:bg-gray-600 w-full p-2 mb-3 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="roomId"
            value={details.roomId}
            onChange={handleFormInputChange}
          />
        </div>

        <div className="flex items-center justify-center gap-5 mt-5">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full"
            onClick={joinChat}
          >
            Join Room
          </button>

          <button
            className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-full"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinCreateChat;
