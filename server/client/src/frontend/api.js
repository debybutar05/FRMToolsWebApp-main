import axios from "axios";

const API_BASE = "http://localhost:3000/api";

export const fetchGroups = async () => {
  try {
    const res = await axios.get(`${API_BASE}/groups`);
    return res.data;
  } catch (err) {
    console.error("Error fetching groups:", err);
    return [];
  }
};
