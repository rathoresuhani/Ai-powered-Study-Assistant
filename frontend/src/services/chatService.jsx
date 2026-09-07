import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const sendMessage = async(message, clerkId) => {
  const response = await axios.post(`${API_URL}/chat`, {
    message,
    clerk_id: clerkId,
  });
  return response.data;
};
export const getChatHistory = async (clerkId) => {
  const response = await axios.get(
    `${API_URL}/chat/history/${clerkId}`
  );
  return response.data;
};