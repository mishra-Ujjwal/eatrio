import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOwnerData } from "../src/redux/ownerSlice";

export const useGetOwner = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/owner/me`,
          { withCredentials: true }
        );
        console.log("Owner info:", result.data.owner);
        dispatch(setOwnerData(result.data.owner));
      } catch (err) {
        console.log("Error fetching owner:", err);
      }
    };

    fetchOwner();
  }, [dispatch]);
};
