import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const { data } = await api.get("/profile");
        if (data.status) {
          setUsername(data.username);
          toast(`Hello ${data.username}`, {
            position: "top-right",
          });
          return;
        }
        navigate("/login");
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        console.error("Could not verify login:", error);
      }
    };
    void verifyCookie();
  }, [navigate]);
  const Logout = async () => {
    try {
      await api.post("/logout");
      navigate("/signup");
    } catch (error) {
      console.error("Could not log out:", error);
    }
  };
  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;