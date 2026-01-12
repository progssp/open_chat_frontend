import './LeftPanel.css';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import preloader from '../../preloader.gif';
import { faBars,faPhone,faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useNavigate } from 'react-router-dom';
import { ChatterContext } from '../../contexts/ChatterContext';
import {main_route,channel_for_left_panel,main_api_route,backend_images_route,getCurrentUser,getCurrentUserToken,subscribeSocket,isChatAndSenderSame} from '../../utilities/ExtraUtility';

let cur_user = null;
let this_user= null;
let channel = null;



function LeftPanel() {
  // let navigate = useNavigate();
  const [dataFromLeftPanel,setDataFromLeftPanel,chats,setChats,leftPanelContent,setLeftPanelContent] = useContext(ChatterContext);
  
  const [list, setList] = useState([]);
  const [search_users, setSearchUsers] = useState([]);
  const [search_users_in_chats, setSearchUsersInChats] = useState([]);
  const [chat_loading, set_chat_loading] = useState(false);
  

  useEffect(() => {
    
    function getData(){
      set_chat_loading(true);
      fetch(`${main_api_route}/user/get-messages-for-left-panel`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': "Bearer sspssp"
        },
        body: 'user_id='+this_user
      })
      .then(result => result.json())
      .then(data => {
        // channel = subscribeSocket();
        set_chat_loading(false);
        setList(data);
      })
      .catch(err => {
        set_chat_loading(false);
        // console.error(err);
      });
    }
    getData();

    cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
    this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
    // let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

    channel = subscribeSocket();
    


    //eslint-disable-next-line
  },[]);

  function update_list(new_obj){

    let found_index = -1;
    let found_obj = null;

    let new_st = [...list];

    for(let i=0;i<new_st.length;i++){
      if(isChatAndSenderSame(new_st[i],new_obj).is_chat_same){
        // console.log('found');
        found_index = i;
        found_obj = new_st[i];
        // console.log(found_index);
        // console.log(found_obj);
        break;
      }
    }


    if(found_index === -1){
      // console.log("not found. placing rec at 0 index");
      
      new_st.splice(0,0,new_obj);
    }
    else{
      for(let i=found_index;i>0;i--){
        new_st[i] = new_st[i-1];
      }
      new_st[0] = found_obj;
      if(new_obj.message_type.indexOf("one_to_one") > -1){
        new_st[0].id = new_obj.id;
        new_st[0].message = new_obj.message;
        new_st[0].file_path = new_obj.file_path;
        new_st[0].file_type = new_obj.file_type;
        new_st[0].sender_id = new_obj.sender_id;
        if(parseInt(new_obj.sender_id) === parseInt(cur_user.id)){
          new_st[0].sender_nm = "You";
        }
        else{
          new_st[0].sender_nm = new_obj.sender_nm;
        }
        new_st[0].receiver_id = new_obj.receiver_id;
        new_st[0].receiver_nm = new_obj.receiver_nm;
        new_st[0].created_at = new_obj.created_at;
      }
      else if(new_obj.message_type.indexOf("group") > -1){
        new_st[0].id = new_obj.id; 
        new_st[0].message = new_obj.message;
        new_st[0].file_path = new_obj.file_path;
        new_st[0].file_type = new_obj.file_type;
        new_st[0].sender_id = new_obj.sender_id;
        if(parseInt(new_obj.sender_id) === parseInt(cur_user.id)){
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
      
      // console.log("matching: from list "+list[i].id+" with from tap: "+msg_id);
      // console.log("matching from list "+list[i].message_type+" with from tap: "+msg_type);
      // console.log("from list type "+typeof(list[i].message_type)+" with from tap type:  "+typeof(msg_type));
      // console.log("from list type "+typeof(list[i].id)+" with from tap type:  "+typeof(msg_id));

      if(parseInt(list[i].id) === parseInt(msg_id) && list[i].message_type === msg_type){
        // console.log("matched");
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
      
    }
    
  }

  function handleSearch(evt){
    let search_chars = document.getElementById('search_users_tf').value;
    search_chars = search_chars.trim();
    if(search_chars.length == 0){
      setSearchUsers([]);
      return;
    }
    document.getElementById("search_users_submit_btn").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
    document.getElementById("search_users_submit_btn").disabled = true;
    fetch(`${main_api_route}/user/search-users`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "search_string="+search_chars
    })
    .then(result => result.json())
    .then(data => {
      // console.log(data);
      if(data.length > 0){
        setSearchUsers(data);
      }
      else{
        setSearchUsers([]);
      }
      document.getElementById("search_users_submit_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>`;
      document.getElementById("search_users_submit_btn").disabled = false;
    })
    .catch(err => {
      setSearchUsers([]);
      document.getElementById("search_users_submit_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>`;
      document.getElementById("search_users_submit_btn").disabled = false;
    });
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
        setSearchUsers([]);
        document.getElementById("search_users_tf").value = "";
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

  function handleSearchInChats(evt){
    let search_chars = document.getElementById('search_users_in_chats_tf').value;
    search_chars = search_chars.trim();
    if(search_chars.length == 0){
      setSearchUsersInChats([]);
      return;
    }
    document.getElementById("search_users_submit_in_chats_btn").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
    document.getElementById("search_users_submit_in_chats_btn").disabled = true;

    setSearchUsersInChats([]);
    

    for(let i=0;i<list.length;i++){
      
      if((list[i].message_type.indexOf("one_to_one") > -1)){
        
        
        if(parseInt(list[i].sender_id) === parseInt(this_user)){                  
          
          
          if(list[i].receiver_nm.toLowerCase().includes(search_chars.toLowerCase())){
                 
            
            setSearchUsersInChats([...search_users_in_chats,list[i]]);
          }
        }
        else{
         
          if(list[i].sender_nm.toLowerCase().includes(search_chars.toLowerCase())){
          
            setSearchUsersInChats([...search_users_in_chats,list[i]]);
          }
        }
      }
      else if((dataFromLeftPanel.message_type.indexOf("group") > -1)){      
        
      }
      
    }
    
    document.getElementById("search_users_submit_in_chats_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" class="svg-inline--fa fa-magnifying-glass " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>`;
    document.getElementById("search_users_submit_in_chats_btn").disabled = false;
  
  }

  function change_chatter_from_search_users_in_chats(evt){

    
    
    let search_user_id = parseInt(evt.currentTarget.attributes.search_user_id.value);
    // console.log(`msg_type: ${msg_type}`);
    // console.log(`search_user_id: ${search_user_id}`);

    
    
    let new_obj = {};
    for(let i=0;i<search_users_in_chats.length;i++){
      // console.log(typeof(msg_id));
      if(search_users_in_chats[i].id === search_user_id){
        // console.log("found at: "+i);
        new_obj = search_users_in_chats[i];
        setSearchUsersInChats([]);
        document.getElementById("search_users_in_chats_tf").value = "";
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

  if(channel_for_left_panel !== null){
    // channel_for_left_panel.unbind('App\\Events\\MessageSent');
    channel_for_left_panel.bind('App\\Events\\MessageSent',(d) => {
      // console.log("from left panel" + d);
      update_list(d.last_msg);
    });
  }

  


  function openSidebar(){
    document.getElementById('sidebar').classList.remove('left-[-100%]');
    document.getElementById('sidebar').classList.add('left-0');
  }

  function startCall(evt){
    // console.log(evt);
  }

  return (
    
    // <div id="left_panel" className="w-screen flex flex-col">
    <div id="left_panel" className="w-screen lg:w-1/3 flex flex-col h-screen bg-[rgb(16,118,255)] overflow-y-scroll">
      {
        (leftPanelContent === "chat")?
          (
            <>
              {/* search users in chats field */}
              <div className="p-2 bg-[rgb(16,118,255)] shadow-lg flex flex-row justify-between items-center">
                  <div className="flex w-full relative">
                    <button onClick={openSidebar} className="mr-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center" type="button"><FontAwesomeIcon icon={faBars} /></button>
                    
                    <input id="search_users_in_chats_tf" type="text" placeholder="Search users in chats" className='rounded-sm pl-2 pb-2 pt-2 pr-11 text-md bg-[rgba(255,255,255,0.8)] w-full'/>   
                    
                    <button onClick={handleSearchInChats} id='search_users_submit_in_chats_btn' className='absolute right-[0px] h-10 ml-1 text-white bg-blue-600 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center'><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>     
                    

                  </div>
              </div>

              <div className="bg-grey-lighter flex-1 overflow-auto relative">
                
                <div className='absolute w-full rounded-md'>
                  {/* search users in chats */}
                  {search_users_in_chats.map((item)=>(
                    <div key={item.id} search_user_id={item.id} onClick={change_chatter_from_search_users_in_chats} className="w-full px-2 py-5 m-0 flex items-start cursor-pointer bg-slate-200 hover:bg-slate-400" style={{transition:'0.3s'}}>
                      <div>
                        {
                          (item.message_type.indexOf("group") > -1)?
                            (<div id={`g_icon_${item.id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.icon})`}}></div>)
                            :
                            (parseInt(item.sender_id) === parseInt(this_user))?
                              (<div  id={`oto_icon_${item.receiver_id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.receiver_icon})`}}></div>)
                              :
                              (<div id={`oto_icon_${item.sender_id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.sender_icon})`}}></div>)
                        }
                        
                      </div>
                      <div className="ml-4 flex-1 py-0">
                          {
                            (item.message_type.indexOf("group") > -1)?
                              (parseInt(item.receiver_id) === parseInt(this_user))?
                                (parseInt(item.is_receiver_seen) === 0)?
                                  (<div class="m-1 p-1 bg-green-400">Unread</div>)
                                :
                                  null
                              :
                                null
                            :
                              null
                          }
                          <div className="flex justify-between mt-5 md:mt-2">
                            <p className="text-sm font-bold md:text-sm">
                              {
                                (item.message_type.indexOf("group") > -1)?
                                  item.group_nm
                                :
                                  (parseInt(item.sender_id) === parseInt(this_user))?
                                    item.receiver_nm
                                  :
                                    item.sender_nm
                              }
                            </p>
                            <div className='flex flex-col'>
                              <p className="text-xs">
                                {
                                  (moment().diff(moment(item.created_at),'days')) === 0?
                                    ('Today')
                                  :
                                    (moment().diff(moment(item.created_at),'days')) === 1?
                                      (moment().diff(moment(item.created_at),'days')+' day ago')
                                    :
                                      (moment().diff(moment(item.created_at),'days')+' days ago')
                                }
                              </p>
                              <p className="hidden text-xs text-white">                       
                                {moment(item.created_at).format('MMM DD, YYYY hh:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-start mt-2 md:mt-2">
                            <p className="mt-1 text-sm self-start md:block">
                              {
                                (item.sender_id === this_user)?"you" : item.sender_nm
                              }:
                              {
                                (item.file_path !== null)?
                                  (JSON.parse(item.file_path).length === 1)?' Sent a file':' Sent '+JSON.parse(item.file_path).length+' files'
                                :
                                  (item.message !== null)?
                                    (item.message.length >= 15)?
                                      " " + item.message.substr(0,30)+'...'
                                    :
                                      " " + item.message
                                  :
                                  ''
                              }
                            </p>
                            
                          </div>
                            
                      </div>
                    </div>
                  ))}
                </div> 

                {/* data left panel */}
                {
                  (chat_loading)?
                    (
                      <div>
                        <div className='flex flex-col items-center justify-center text-white text-xl py-3'>
                          <img src={`${main_route}/loader.gif`} className='w-10 h-10' />
                          <span>Loading...</span>
                        </div>
                      </div>
                    )
                  :
                    list.map((item)=>(
                      <div key={item.id} message_type={item.message_type} message_id={item.id} onClick={change_chatter} className="w-full px-2 py-5 m-0 flex items-start cursor-pointer hover:bg-[rgb(4,21,30)]" style={{transition:'0.3s'}}>
                          <div>
                            {
                              (item.message_type.indexOf("group") > -1)?
                                (<div id={`g_icon_${item.id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.icon})`}}></div>)
                                :
                                (parseInt(item.sender_id) === parseInt(this_user))?
                                  (<div  id={`oto_icon_${item.receiver_id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.receiver_icon})`}}></div>)
                                  :
                                  (<div id={`oto_icon_${item.sender_id}`} className='shadow-md bg-no-repeat w-14 h-14 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.sender_icon})`}}></div>)
                            }
                            
                          </div>
                          <div className="ml-4 flex-1 py-0">
                              {
                                (item.message_type.indexOf("group") > -1)?
                                  (parseInt(item.receiver_id) === parseInt(this_user))?
                                    (parseInt(item.is_receiver_seen) === 0)?
                                      (<div class="m-1 p-1 bg-green-400">Unread</div>)
                                    :
                                      null
                                  :
                                    null
                                :
                                  null
                              }
                              <div className="flex justify-between mt-1 md:mt-1">
                                <p className="text-white text-sm font-bold md:text-sm">
                                  {
                                    (item.message_type.indexOf("group") > -1)?
                                      item.group_nm
                                    :
                                      (parseInt(item.sender_id) === parseInt(this_user))?
                                        item.receiver_nm
                                      :
                                        item.sender_nm
                                  }
                                </p>
                                <div className='flex flex-col'>
                                  <p className="text-xs text-white">
                                    {
                                      (moment().diff(moment(item.created_at),'days')) === 0?
                                        ('Today')
                                      :
                                        (moment().diff(moment(item.created_at),'days')) === 1?
                                          (moment().diff(moment(item.created_at),'days')+' day ago')
                                        :
                                          (moment().diff(moment(item.created_at),'days')+' days ago')
                                    }
                                  </p>
                                  <p className="hidden text-xs text-white">                       
                                    {moment(item.created_at).format('MMM DD, YYYY hh:mm a')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-between items-start mt-2 md:mt-2">
                                <p className="text-white mt-1 text-sm self-start md:block">
                                  {
                                    (item.sender_id === this_user)?"you" : item.sender_nm
                                  }:
                                  {
                                    (item.file_path !== null)?
                                      (JSON.parse(item.file_path).length === 1)?' Sent a file':' Sent '+JSON.parse(item.file_path).length+' files'
                                    :
                                      (item.message !== null)?
                                        (item.message.length >= 15)?
                                          " " + item.message.substr(0,30)+'...'
                                        :
                                          " " + item.message
                                      :
                                      ''
                                  }
                                </p>
                                
                              </div>
                                
                          </div>
                      </div>
                    ))
                }
              </div>
            </>
          )
        :
          (leftPanelContent === "contacts")?
            (
              <>
                {/* search users field */}
                <div className="p-2 bg-[rgb(16,118,255)] shadow-lg flex flex-row justify-between items-center">
                    <div className="flex w-full relative">
                      <button onClick={openSidebar} className="mr-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center" type="button"><FontAwesomeIcon icon={faBars} /></button>
                      
                      <input id="search_users_tf" type="text" placeholder="Search users..." className='rounded-sm pl-2 pb-2 pt-2 pr-11 text-md bg-[rgba(255,255,255,0.8)] w-full'/>   
                      
                      <button onClick={handleSearch} id='search_users_submit_btn' className='absolute right-[0px] h-10 ml-1 text-white bg-blue-600 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center'><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></button>                    

                    </div>
                </div>
                <div className='relative w-full'>
                  <div className='absolute w-full rounded-md'>
                    {/* search users */}
                    {search_users.map((item)=>(
                      <div key={item.id} search_user_id={item.id} onClick={change_chatter_from_search_users} className="w-full px-2 py-5 m-0 flex align-middle cursor-pointer bg-gray-300 hover:bg-[rgb(5,104,153)]" style={{transition:'0.3s'}}>
                        
                        <div id={`g_icon_${item.id}`} className='shadow-md bg-no-repeat w-30 h-30 bg-cover rounded-full bg-center md:w-14 md:h-14' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item.icon})`}}></div>
                        <div className='ml-3 self-center text-lg'><span>{item.user_first_name}</span></div>
                        
                                      
                      </div>
                    ))}
                  </div> 
                </div>
              </>
            )
          :
            null
      }

    </div>
  );
}

export default LeftPanel;