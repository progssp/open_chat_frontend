import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {main_route, main_api_route,showEditProfileModal,getCurrentUser,getCurrentUserToken,subscribeSocket,isChatAndSenderSame} from '../../utilities/ExtraUtility';
import CreateGroup from "../CreateGroup/CreateGroup";
import EditProfile from "../EditProfile/EditProfile";
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

export default function Navbar(){
    let navigate = useNavigate();

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
        window.localStorage.clear();
        window.location.href = main_route;
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
            <div id="sidebar" style={{transition:'0.2s'}} className="px-1 pt-2 bg-[rgba(6,128,189,0.8)] w-0 left-[-100%] fixed top-0  h-screen overflow-y-scroll">
                
                <div className="block">
                    <button onClick={closeSidebar} className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg ml-1 px-[13.1px] py-[6px] text-center" type="button"><FontAwesomeIcon icon={faXmark} /></button>
                </div>

                <div className="flex justify-between m-5">
                    <div>
                        <span className="text-xl text-white font-bold">{cur_user.name}</span>
                    </div>
                    <div>
                        <button className=' bg-[rgb(15,185,0)] text-white mx-1 p-1 border rounded hover:bg-blue-600' onClick={showEditProfileModal}>Edit Profile</button>
                        <button className=' bg-[rgb(185,105,0)] text-white mx-1 p-1 rounded hover:bg-blue-600' onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="block m-5">
                    <button onClick={changeModalDisplay} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Create Group</button>
                </div>

            </div>

            <CreateGroup />
            <EditProfile />

        </div>
    );
}