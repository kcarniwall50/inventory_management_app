import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const LoginStatus = async () => {
  useEffect(() => {
    const navigate = useNavigate();

    if (response.data === false) {
      return navigate("/login");
    }
  }, []);
};
