import React, {useState,createContext} from 'react';

export const ChatterContext = createContext();

export const ChatterProvider = props => {
    
    const [leftPanelContent,setLeftPanelContent] = useState("chat");
    const [dataFromLeftPanel,setDataFromLeftPanel] = useState(
        
        {
            // "id": 20,
            // "sender_id": 5,
            // "sender_nm": "SSP",
            // "sender_icon": "/user_icons/WSDLYKsfAU8OHqp4tMaJ47eTrLX3GlSIMVnGAhZm.jpg",
            // "receiver_id": 1,
            // "receiver_nm": "willi",
            // "receiver_icon": "/user_icons/WSDLYKsfAU8OHqp4tMaJ47eTrLX3GlSIMVnGAhZm.jpg",
            // "message": "Can you show us some samples of your writing? If that’s something you keep hearing but cannot say a confident yes to, you’re at the right place. We’ll show you 24 examples of how others write and present their content writing samples and answer some of the most frequently asked questions.   So the next time a potential client wants to see your samples or HR requests them for your job application, you won’t have to worry about it anymore. You can just send your writing portfolio over with all of your best projects included.",
            // "file_path": null,
            // "file_type": null,
            // "message_type": "one_to_one",
            // "created_at": "2023-07-02 17:56:01"
          }
        
    );
    const [chats,setChats] = useState([]);
    return (
        <ChatterContext.Provider value={[dataFromLeftPanel,setDataFromLeftPanel,chats,setChats,leftPanelContent,setLeftPanelContent]}>
            {props.children}
        </ChatterContext.Provider>
    );
};