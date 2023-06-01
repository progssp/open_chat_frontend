import './LeftPanel.css';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { ChatterContext } from '../../contexts/ChatterContext';
import {main_route, main_api_route,backend_images_route,getCurrentUser,getCurrentUserToken,subscribeSocket,isChatAndSenderSame} from '../../utilities/ExtraUtility';
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

let channel = subscribeSocket();


function LeftPanel() {
  let navigate = useNavigate();
  const [dataFromLeftPanel,setDataFromLeftPanel] = useContext(ChatterContext);
  const [list, setList] = useState([]);
  const [search_users, setSearchUsers] = useState([]);
  

  useEffect(() => {
    function getData(){
      fetch(`${main_api_route}/user/get-messages-for-left-panel`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': "Bearer "+cur_user_token
        },
        body: 'user_id='+this_user
      })
      .then(result => result.json())
      .then(data => {
        // channel = subscribeSocket();
        setList(data);
      })
      .catch(err => {
        console.error(err);
      });
    }
    getData();


    if(window.innerWidth >= 768){
      document.getElementById("left_panel").classList.add("w-1/3");
      document.getElementById("left_panel").classList.remove("w-screen");
      document.getElementById("left_panel").classList.remove("hidden");
    }
    else{
      if(Object.keys(dataFromLeftPanel).length !== 0){        
        document.getElementById("left_panel").classList.add("hidden");
      }
      document.getElementById("left_panel").classList.add("w-screen");
      document.getElementById("left_panel").classList.remove("w-1/3");
    }
  },[navigate]);

  function update_list(new_obj){

    let found_index = -1;
    let found_obj = null;

    let new_st = [...list];

    for(let i=0;i<new_st.length;i++){
      if(isChatAndSenderSame(new_st[i],new_obj).is_chat_same){
        console.log('found');
        found_index = i;
        found_obj = new_st[i];
        console.log(found_index);
        console.log(found_obj);
        break;
      }
    }


    if(found_index === -1){
      new_st.splice(0,0,new_obj);
    }
    else{
      for(let i=found_index;i>0;i--){
        new_st[i] = new_st[i-1];
      }
      new_st[0] = found_obj;
      if(new_obj.message_type === "one_to_one"){
        new_st[0].id = new_obj.id; 
        new_st[0].message = new_obj.message;
        new_st[0].sender_id = new_obj.sender_id;
        if(new_obj.sender_id === cur_user.id){
          new_st[0].sender_nm = "You";
        }
        else{
          new_st[0].sender_nm = new_obj.sender_nm;
        }
        new_st[0].receiver_id = new_obj.receiver_id;
        new_st[0].receiver_nm = new_obj.receiver_nm;
        new_st[0].created_at = new_obj.created_at;
      }
      else if(new_obj.message_type === "group"){
        new_st[0].id = new_obj.id; 
        new_st[0].message = new_obj.message;
        new_st[0].sender_id = new_obj.sender_id;
        if(new_obj.sender_id === cur_user.id){
          new_st[0].sender_nm = "You";
        }
        else{
          new_st[0].sender_nm = new_obj.sender_nm;
        }
        new_st[0].created_at = new_obj.created_at;
      }
    }
    setList(new_st);
  }

  function change_chatter(evt){
    
    let msg_type = (evt.currentTarget.attributes.message_type.value);
    let msg_id = parseInt(evt.currentTarget.attributes.message_id.value);
    // console.log(`msg_type: ${msg_type}`);
    // console.log(`msg_id: ${msg_id}`);
    
    
    let new_obj = {};
    for(let i=0;i<list.length;i++){
      // console.log(typeof(msg_id));
      if(list[i].id === msg_id && list[i].message_type === msg_type){
        // console.log("found at: "+i);
        new_obj = list[i];
        break;
      }
    }

    // console.log(new_obj);
    
    
    setDataFromLeftPanel(new_obj);

    if(window.innerWidth < 768){      
      document.getElementById("left_panel").classList.add("hidden");
      document.getElementById("chatter").classList.remove("hidden");
      document.getElementById("chatter").classList.add("w-screen");
      document.getElementById("chatter").classList.remove("w-2/3");
    }
  }

  function handleSearch(evt){
    let search_chars = evt.target.value;
    fetch(`${main_api_route}/user/search-users`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "search_string="+search_chars
    })
    .then(result => result.json())
    .then(data => {
      if(data.length > 0){
        setSearchUsers(data);
      }
      else{
        setSearchUsers([]);
      }
    })
    .catch(err => setSearchUsers([]));
  }

  function change_chatter_from_search_users(evt){
    
    let search_user_id = parseInt(evt.currentTarget.attributes.search_user_id.value);
    // console.log(`msg_type: ${msg_type}`);
    // console.log(`search_user_id: ${search_user_id}`);

    
    
    let new_obj = {};
    for(let i=0;i<search_users.length;i++){
      // console.log(typeof(msg_id));
      if(search_users[i].id === search_user_id){
        // console.log("found at: "+i);
        new_obj = search_users[i];
        break;
      }
    }

    // console.log(new_obj);
    
    
    setDataFromLeftPanel(new_obj);

    if(window.innerWidth < 768){      
      document.getElementById("left_panel").classList.add("hidden");
      document.getElementById("chatter").classList.remove("hidden");
      document.getElementById("chatter").classList.add("w-screen");
      document.getElementById("chatter").classList.remove("w-2/3");
    }
  }

  if(channel !== null){
    // channel.unbind('App\\Events\\MessageSent').bind('App\\Events\\MessageSent',(d) => {
    channel.bind('App\\Events\\MessageSent',(d) => {
      // console.log(d.last_msg);
      // let isChatSame = isChatAndSenderSame(d.last_msg,dataFromLeftPanel).is_chat_same;
      update_list(d.last_msg);
    });
  }

  

  window.addEventListener('resize', function(evt){
    if(window.innerWidth >= 768){
      document.getElementById("left_panel").classList.add("w-1/3");
      document.getElementById("left_panel").classList.remove("w-screen");
      document.getElementById("left_panel").classList.remove("hidden");
    }
    else{
      if(Object.keys(dataFromLeftPanel).length !== 0){        
        document.getElementById("left_panel").classList.add("hidden");
      }
      document.getElementById("left_panel").classList.add("w-screen");
      document.getElementById("left_panel").classList.remove("w-1/3");
    }
  });

  function openSidebar(){
    document.getElementById('sidebar').classList.remove('left-[-100%]');
    document.getElementById('sidebar').classList.add('left-0');
  }

  return (
    
    // <div id="left_panel" className="w-screen flex flex-col">
    <div id="left_panel" className="bg-[rgb(6,128,189)] w-1/3 flex flex-col h-screen">

      {/* search users field */}
      <div className="p-2 bg-[rgb(6,128,189)] shadow-lg flex flex-row justify-between items-center">
          <div className="flex w-full">
            <button onClick={openSidebar} className="mr-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center" type="button"><FontAwesomeIcon icon={faBars} /></button>
            
            <input type="text" placeholder="Search users..." className='rounded-sm p-2 text-md bg-[rgba(255,255,255,0.8)] w-full' onChange={handleSearch}/>            
          </div>
      </div>

      <div className="bg-grey-lighter flex-1 overflow-auto">
        {/* search users */}
        {search_users.map((item)=>(
          <div key={item.id} search_user_id={item.id} onClick={change_chatter_from_search_users} className="px-3 flex items-center bg-gray-300 cursor-pointer">
            <div>
              <div className='shadow-md bg-no-repeat w-24 h-24 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.icon})`}}></div>
            </div>
            <div className="ml-4 flex-1 py-4">
                <div className="flex items-bottom justify-between">
                    <p className="text-grey-darkest text-xl md:text-lg">
                      {item.name}
                    </p>
                </div>
            </div>
          </div>
        ))}

        {/* data left panel */}
        {list.map((item)=>(
          <div key={item.id} message_type={item.message_type} message_id={item.id} onClick={change_chatter} className="px-2 py-5 m-0 flex items-start cursor-pointer hover:bg-[rgb(5,104,153)]" style={{transition:'0.3s'}}>
              <div>
                {
                  (item.message_type == "group"||item.message_type == "group_info")?
                    (<div className='shadow-md bg-no-repeat w-24 h-24 bg-cover rounded-full bg-center md:w-20 md:h-20' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.icon})`}}></div>)
                    :
                    (item.sender_id == this_user)?
                      (<div className='shadow-md bg-no-repeat w-24 h-24 bg-cover rounded-full bg-center md:w-20 md:h-20' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.receiver_icon})`}}></div>)
                      :
                      (<div className='shadow-md bg-no-repeat w-24 h-24 bg-cover rounded-full bg-center md:w-20 md:h-20' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.sender_icon})`}}></div>)
                }
              </div>
              <div className="ml-4 flex-1 py-0">
                  <div className="flex justify-between">
                      <p className="text-white text-xl font-bold md:text-lg">
                        {(item.group_id)?item.group_nm:(item.sender_id===this_user)?item.receiver_nm:item.sender_nm}
                      </p>
                      <div className='flex flex-col'>
                        <p className="text-xs text-white">
                          {
                            (moment().diff(moment(item.created_at),'days'))===0?
                              ('Today')
                              :
                              (moment().diff(moment(item.created_at),'days')+' days ago')
                          }
                        </p>
                        <p className="hidden text-xs text-white">                       
                          {moment(item.created_at).format('MMM DD, YYYY hh:mm a')}
                        </p>
                      </div>
                  </div>
                  <p className="hidden text-white mt-1 text-sm md:block">
                    {(item.sender_id===this_user)?"you":item.sender_nm}: {(item.message.length >= 15)?item.message.substr(0,30)+'...':item.message}
                  </p>
                  <p className="visible text-white mt-1 text-sm md:hidden">
                    {(item.sender_id===this_user)?"you":item.sender_nm}: {(item.message.length >= 50)?item.message.substr(0,30)+'...':item.message}
                  </p>   
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftPanel;