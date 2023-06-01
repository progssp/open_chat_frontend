import React, {useState,createContext} from 'react';

export const ChatterContext = createContext();

export const ChatterProvider = props => {
    const [dataFromLeftPanel,setDataFromLeftPanel] = useState(
        {
            "id": 93,
            "sender_id": 5,
            "sender_nm": "Taneth",
            "sender_icon": "/defaults/user_icons/logo192.png",
            "receiver_id": 17,
            "receiver_nm": "Prof. Rosemarie Dare",
            "receiver_icon": "/defaults/user_icons/logo192.png",
            "message": "hello",
            "message_type": "one_to_one",
            "created_at": "2023-05-29 19:14:28"
        }
    );
    const [chats,setChats] = useState([]);
    return (
        <ChatterContext.Provider value={[dataFromLeftPanel,setDataFromLeftPanel,chats,setChats]}>
            {props.children}
        </ChatterContext.Provider>
    );
};