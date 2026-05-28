import React, { useEffect,useContext } from "react";
import { faComments, faGear,faUsers,faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {main_route,main_api_route,showEditProfileModal,getCurrentUser} from '../../utilities/ExtraUtility';
import CreateGroup from "../CreateGroup/CreateGroup";
import EditProfile from "../EditProfile/EditProfile";
import SendFile from "../SendFile/SendFile";
import VideoCall from "../VideoCall/VideoCall";
import { ChatterContext } from '../../contexts/ChatterContext';
import { useNavigate } from "react-router-dom";
// let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
// let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

export default function Navbar(){
    const n = useNavigate();
    const [dataFromLeftPanel,setDataFromLeftPanel,chats,setChats,leftPanelContent,setLeftPanelContent] = useContext(ChatterContext);

    useEffect(()=>{     
        
        
        document.getElementById("sidebar").classList.remove("w-0");

        if(window.innerWidth >= 768){
            document.getElementById("sidebar").classList.add("w-[300px]");
        }
        else{
            document.getElementById("sidebar").classList.add("w-3/4");
        }
    });

    
    function handleLogout(evt){
        
        fetch(`${main_api_route}/user/logout`,{
            method: 'POST'
        })
        .then(result => result.json())
        .then(data => {
            if(data.status){
                window.localStorage.clear();
                window.location.href = "/app";
                // n("/app",{replace:true});
            }
        })
        .catch(err => {
            console.error(err);
        });
        // window.location.href = main_route;
    }

    function changeModalDisplay(){
        if(document.getElementById("create-group-modal1").classList.contains("invisible")){
            document.getElementById("create-group-modal1").classList.remove("invisible");
        }
    }

    function closeSidebar(){
        document.getElementById('sidebar').classList.remove('left-0');
        document.getElementById('sidebar').classList.add('left-[-100%]');
    }


    window.addEventListener('resize',function(){
        if(window.innerWidth >= 768){
            document.getElementById("sidebar").classList.remove("w-3/4");
            document.getElementById("sidebar").classList.add("w-[300px]");
        }
        else{
            document.getElementById("sidebar").classList.remove("w-[300px]");
            document.getElementById("sidebar").classList.add("w-3/4");
        }
    });

    


    return (
        <div>
            <div id="sidebar" style={{transition:'0.3s'}} className="p-1 bg-slate-200 dark:bg-gray-500 w-auto h-screen absolute left-[-100%] z-50 flex flex-col justify-between shadow-lg">
                
                
                <div className="flex flex-col">
                    <div className="mx-2 mt-2.5">
                        <button onClick={closeSidebar} className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg ml-1 px-[13.1px] py-[6px] text-center" type="button"><FontAwesomeIcon icon={faXmark} /></button>
                    </div>

                    <div onClick={()=>{setLeftPanelContent("chat")}} style={{transition:'0.3s'}} className={(leftPanelContent === "chat")?`bg-slate-400 mx-2 my-2 p-2`:`hover:bg-slate-400 mx-2 my-2 p-2`}>
                        <button><span title="Chat"><FontAwesomeIcon className='text-white text-2xl' icon={faComments} /></span></button>                        
                    </div>
                    
                    <div onClick={()=>{setLeftPanelContent("contacts")}} style={{transition:'0.3s'}} className={(leftPanelContent === "contacts")?`bg-slate-400 mx-2 my-2 p-2`:`hover:bg-slate-400 mx-2 my-2 p-2`}>
                        <button><span title="Contacts"><FontAwesomeIcon className='text-white text-2xl' icon={faUsers} /></span></button>
                    </div>
                </div>

                <div className="flex flex-col items-center m-2 relative">
                    <button onClick={()=>{document.getElementById('dropdown').classList.toggle("hidden")}}><span title="Settings"><FontAwesomeIcon className='text-white text-2xl' icon={faGear} /></span></button>
                   
                   
                    <div id="dropdown" className="z-10 hidden absolute bottom-5 left-6 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">

                            <li onClick={changeModalDisplay} className="cursor-pointer">
                                <a id="ke" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Create Group</a>
                            </li>
                                            
                       
                        <li onClick={handleLogout} className="cursor-pointer">
                            <a id="ke" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
                        </li>
                        </ul>
                    </div>
                </div>
                
                
                {/* <div className="block">
                    <button onClick={closeSidebar} className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg ml-1 px-[13.1px] py-[6px] text-center" type="button"><FontAwesomeIcon icon={faXmark} /></button>
                </div>

                <div className="flex justify-between items-center my-5 mx-2">
                    <div>
                        <span className="text-xl text-white font-bold">{cur_user.user_first_name+" "+cur_user.user_last_name}</span>
                    </div>
                    <div className="flex flex-col">
                        <button className=' bg-[rgb(0,185,148)] text-white m-1 p-1 rounded hover:bg-blue-600' onClick={showEditProfileModal}>Edit Profile</button>
                        <button className=' bg-[rgb(0,151,185)] text-white m-1 p-1 rounded hover:bg-blue-600' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="flex flex-col my-5 mx-2">
                    <button onClick={changeModalDisplay} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Create Group</button>
                </div> */}

            </div>

            <CreateGroup />
            <EditProfile />
            <SendFile />
            <VideoCall />

        </div>
    );
}