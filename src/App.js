import React from "react";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import Navbar from "./components/Navbar/Navbar";
import Chatter from "./components/Chatter/Chatter";
import { ChatterProvider } from "./contexts/ChatterContext";

function App(){

    return(
        <div>
            <Navbar />
            <div className="h-screen">
                <div className="flex h-full">
                    <ChatterProvider>
                        <LeftPanel />
                        <Chatter />
                    </ChatterProvider>
                </div>
            </div>
        </div>
    );
}

export default App;