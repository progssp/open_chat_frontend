import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import Navbar from "./components/Navbar/Navbar";
import Chatter from "./components/Chatter/Chatter";
import { ChatterProvider } from "./contexts/ChatterContext";
import { main_api_route } from "./utilities/ExtraUtility";

function App() {
  let navigate = useNavigate();

  const [auth_status, set_auth_status] = useState(false);

  useEffect(() => {
    fetch(main_api_route + "/user/check-auth", {
      method: "POST",
    })
      .then((result) => result.json())
      .then((data) => {
        if (!data.status) {
          navigate("/app", { replace: true });
          //   window.location.href = "/app";
          window.localStorage.clear();
        } else {
          set_auth_status(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  return (
    <div>
      <div className="h-screen">
        <div className="flex h-full">
          {auth_status ? (
            <ChatterProvider>
              <Navbar />
              <LeftPanel />
              <Chatter />
            </ChatterProvider>
          ) : (
            <div className="absolute left-0 top-0 w-screen h-screen content-center text-center bg-[rgba(0,0,0,0.5)]">
              <h2 className="text-3xl text-white">Loading...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
