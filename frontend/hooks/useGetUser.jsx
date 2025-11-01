import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../src/redux/userSlice";


export const useGetUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/me`,
          { withCredentials: true }
        );
        console.log("User info:", result.data.user);
        dispatch(setUserData(result.data.user));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [dispatch]);
};
