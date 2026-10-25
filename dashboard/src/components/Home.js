import React, { useEffect, useState } from "react";
import { api, FRONTEND_URL } from "../api";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import DashboardAssistant from "./DashboardAssistant";

const Home = () => {
  const [user, setUser] = useState(null);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/profile");

        if (!data.status) {
          window.location.assign(`${FRONTEND_URL}/login`);
          return;
        }

        setUser(data);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.assign(`${FRONTEND_URL}/login`);
          return;
        }

        console.error("Could not load dashboard profile:", error);
        setProfileError("User profile could not be loaded.");
      }
    };

    loadProfile();
  }, []);

  return (
    <>
      <TopBar userId={user?.userId} username={user?.username} />
      {profileError && <p role="alert">{profileError}</p>}
      <Dashboard username={user?.username} />
      {user && <DashboardAssistant />}
    </>
  );
};

export default Home;