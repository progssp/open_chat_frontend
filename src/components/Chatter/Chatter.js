import React, {useEffect,useContext, useState,useRef} from 'react';
import $ from 'jquery';
import preloader from '../../preloader.gif';
import { ChatterContext } from '../../contexts/ChatterContext';
import { faArrowLeft,faPaperPlane,faFile,faPhone} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from '../../components/Message/Message';
import { main_route,main_api_route,backend_images_route,showEditProfileModal,getCurrentUser,getCurrentUserToken,isChatAndSenderSame,subscribeSocket,subs_video_channel} from '../../utilities/ExtraUtility';
let channel = subscribeSocket();
let video_channel = subs_video_channel();
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let sender = (getCurrentUser()!==null)?getCurrentUser():null;

let cameraAccess = 0;
let localStream = null;
let localVideo = null;
let remoteAudio = null;
let remoteVideo = null;



function Chatter() {

  const [dataFromLeftPanel,setDataFromLeftPanel,chats,setChats] = useContext(ChatterContext);
  const [scroll, setScroll] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(()=>{
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
      setChats([]);
    function getOneToOneData(sender_id,receiver_id){
      document.getElementById("chat_loader").classList.remove("hidden");
      document.getElementById("chat_loader").classList.add("inline");
      fetch(`${main_api_route}/user/get-one-to-one-messages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'sender_id='+sender_id+'&receiver_id='+receiver_id
      })
      .then(result => result.json())
      .then(data => {
          // console.log(data);
          data = data.messages.reverse();
          setChats(data.messages);
          setScroll(parseInt(document.getElementById('chats_container').scrollHeight));
          // console.log(scroll);
    
        document.getElementById('chats_container').scrollTop = document.getElementById('chats_container').scrollHeight;
        setTimeout(()=>{document.getElementById('box_end').scrollIntoView({ behavior: 'smooth', block: 'end' });},500);
        document.getElementById("chat_loader").classList.remove("inline");
        document.getElementById("chat_loader").classList.add("hidden");
      })
      .catch(err => {
        // console.error(err);
        document.getElementById("chat_loader").classList.remove("inline");
        document.getElementById("chat_loader").classList.add("hidden");
      });
    }
    function getGroupData(group_id){
      document.getElementById("chat_loader").classList.remove("hidden");
      document.getElementById("chat_loader").classList.add("inline");
      fetch(`${main_api_route}/user/get-group-messages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'group_id='+group_id
      })
      .then(result => result.json())
      .then(data => {
        if(data.status){
          console.log(data.messages);        
          data = data.messages.reverse();
          setChats(data.messages);
          // console.log(scroll);
        }
        setScroll(parseInt(document.getElementById('chat_list_div').scrollHeight));
        document.getElementById('chat_list_div').scrollTop = document.getElementById('chat_list_div').scrollHeight;
        document.getElementById('chat_list_div').scrollIntoView({ behavior: 'smooth', block: 'end' });
        document.getElementById("chat_loader").classList.remove("inline");
        document.getElementById("chat_loader").classList.add("hidden");
      })
      .catch(err => {
        // console.error(err);
        document.getElementById("chat_loader").classList.remove("inline");
        document.getElementById("chat_loader").classList.add("hidden");
      });
    }

    if(Object.entries(dataFromLeftPanel).length !== 0){
      if(!('message_type' in dataFromLeftPanel)){
        getOneToOneData(this_user,dataFromLeftPanel.id);
      }
      else{
        if((dataFromLeftPanel.message_type.indexOf("one_to_one") > -1)){
          if(dataFromLeftPanel.sender_id === this_user){
            getOneToOneData(this_user,dataFromLeftPanel.receiver_id);
          }
          else{
            // console.log(`getdata(${dataFromLeftPanel.sender_id},${this_user})`)
            getOneToOneData(dataFromLeftPanel.sender_id,this_user);
          }
        }
        else if((dataFromLeftPanel.message_type.indexOf("group")>-1)){      
          // console.log(`getgroupdata(${dataFromLeftPanel.group_id}`)
          getGroupData(dataFromLeftPanel.group_id);
        }
      }
    }


    if(window.innerWidth >= 768){
      document.getElementById("chatter").classList.remove("hidden");
      document.getElementById("left_panel").classList.remove("hidden");
      if(document.getElementById("btn_backToLeftPanel")!==null){
        document.getElementById("btn_backToLeftPanel").classList.add('hidden');
      }
      
    }
    else {
      if(Object.keys(dataFromLeftPanel).length === 0){
      
        document.getElementById("chatter").classList.add("hidden");
        document.getElementById("left_panel").classList.remove("hidden");
      }
      else{
        document.getElementById("chatter").classList.remove("hidden");
        document.getElementById("left_panel").classList.add("hidden");
        if(document.getElementById("btn_backToLeftPanel")!==null){
          document.getElementById("btn_backToLeftPanel").classList.remove('hidden');
        }
      
      }
    }
  },[dataFromLeftPanel]);

  function handleSendMessage(evt){
    evt.preventDefault();
    let msg = document.querySelector("#msg_field").value;
    let msg_tmp = msg;
    msg_tmp = msg_tmp.trim();
    msg_tmp = msg_tmp.replace(/ /g,"");
    if(msg_tmp.length <= 0){
      alert('Write a message');
      return;
    }

    if(Object.keys(dataFromLeftPanel).length !== 0){
      
      if(!('message_type' in dataFromLeftPanel)){
        send_one_to_one_message(dataFromLeftPanel.id,msg);
      }
      else {
        if(dataFromLeftPanel.message_type.indexOf("group") > -1){
          send_group_message(dataFromLeftPanel.group_id,msg);
        }
        else if(dataFromLeftPanel.message_type.indexOf("one_to_one") > -1){
          if(parseInt(dataFromLeftPanel.sender_id) === parseInt(this_user)){
            send_one_to_one_message(dataFromLeftPanel.receiver_id,msg);
          }
          else{
            send_one_to_one_message(dataFromLeftPanel.sender_id,msg);
          }
        }
      }
    }    
  }

  function send_one_to_one_message(user_id, msg){
    document.getElementById("send_btn").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
    document.getElementById("send_btn").disabled = true;

    fetch(`${main_api_route}/user/send-one-to-one-message`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': 'Bearer '+getCurrentUserToken()
      },
      body: `receiver_id=${user_id}&message=${msg}`
    })
    .then(result => result.json())
    .then(data => {
      document.getElementById("send_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"></path></svg>`;
      document.getElementById("send_btn").disabled = false;
      document.getElementById("msg_field").value = "";
    })
    .catch(err => {
      document.getElementById("send_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"></path></svg>`;
      document.getElementById("send_btn").disabled = false;
    });
  }

  function send_group_message(group_id, msg){
    document.getElementById("send_btn").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
    document.getElementById("send_btn").disabled = true;

    fetch(`${main_api_route}/user/send-group-message`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': 'Bearer '+getCurrentUserToken()
      },
      body: `group_id=${group_id}&message=${msg}`
    })
    .then(result => result.json())
    .then(data => {
      document.getElementById("send_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"></path></svg>`;
      document.getElementById("send_btn").disabled = false;
      document.getElementById("msg_field").value = "";
    })
    .catch(err => {
      // console.error(err);
      document.getElementById("send_btn").innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" class="svg-inline--fa fa-paper-plane " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"></path></svg>`;
      document.getElementById("send_btn").disabled = false;
    });
  }

  

  window.addEventListener('resize', function(evt){
    // if (!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
      if(window.innerWidth >= 768){
        document.getElementById("chatter").classList.remove("hidden");
        document.getElementById("left_panel").classList.remove("hidden");
        if(document.getElementById("btn_backToLeftPanel")!==null){
          document.getElementById("btn_backToLeftPanel").classList.add('hidden');
        }
      }
      else {
        // console.log(Object.keys(dataFromLeftPanel).length);
        // console.log(dataFromLeftPanel)
        if(Object.keys(dataFromLeftPanel).length === 0){
          document.getElementById("chatter").classList.add("hidden");
          document.getElementById("left_panel").classList.remove("hidden");
         
        }
        else{
          document.getElementById("chatter").classList.remove("hidden");
          document.getElementById("left_panel").classList.add("hidden");
          
          if(document.getElementById("btn_backToLeftPanel")!==null){
            document.getElementById("btn_backToLeftPanel").classList.remove('hidden');
          }

        }
      }
    
  });

  function backToLeftPanel(){    
    document.getElementById("left_panel").classList.remove("hidden");
    document.getElementById("chatter").classList.add("hidden");
    setDataFromLeftPanel({});
  }

  function showSendFileModal(){
    if(document.getElementById("send-file-modal").classList.contains("invisible")){
        document.getElementById("send-file-modal").classList.remove("invisible");
    }
  }

  

  function chatter_scroll_change(evt){
    // console.log(evt);
  }

  function startVideoCall(evt){
    let callee = {};
    let to = null;
    if(Object.entries(dataFromLeftPanel).length !== 0){
      if(!('message_type' in dataFromLeftPanel)){
        to = dataFromLeftPanel.id;
        callee.callee_id = to;
        callee.callee_name = dataFromLeftPanel.user_first_name;
        callee.callee_icon = dataFromLeftPanel.icon;
      }
      else{
        if((dataFromLeftPanel.message_type.indexOf("one_to_one") > -1)){
          if(dataFromLeftPanel.sender_id === this_user){
            to = dataFromLeftPanel.receiver_id;
            callee.callee_id = to;
            callee.callee_name = dataFromLeftPanel.receiver_nm;
            callee.callee_icon = dataFromLeftPanel.receiver_icon;
          }
          else{
            to = dataFromLeftPanel.sender_id;
            callee.callee_id = to;
            callee.callee_name = dataFromLeftPanel.sender_nm;
            callee.callee_icon = dataFromLeftPanel.sender_icon;
          }
        }
        else if((dataFromLeftPanel.message_type.indexOf("group")>-1)){      
          // console.log(`getgroupdata(${dataFromLeftPanel.group_id}`)
          // getGroupData(dataFromLeftPanel.group_id);
        }
      }
    }
    
    getCam().then(() => {
      triggerChannelEvent(video_channel,'client-make-call-request',{from:sender,to:to,callee:callee});
    }).catch(err => {
      // console.error(err);
    });
  }

  // getCam();
  async function getCam(){
    try{
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
        // console.log('Received local stream');
        localVideo = document.querySelector("#sender_vid");
        remoteVideo = document.querySelector("#rec_vid");
        remoteAudio = document.querySelector("#rec_audio");
        localStream = stream;
        localVideo.srcObject = stream;
        
    }
    catch(e){
        console.error("no cam/mic access");
        try{
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          // console.log('Received local stream');
          localVideo = document.querySelector("#sender_vid");
          remoteVideo = document.querySelector("#rec_vid");
          remoteAudio = document.querySelector("#rec_audio");
          localStream = stream;
          localVideo.srcObject = stream;
          
        }
        catch(e){
          console.error("no cam access");
          try{
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            // console.log('Received local stream');
            localVideo = document.querySelector("#sender_vid");
            remoteVideo = document.querySelector("#rec_vid");
            remoteAudio = document.querySelector("#rec_audio");
            localStream = stream;
            localVideo.srcObject = stream;
            
          }
          catch(e){
            console.error("no mic access");
            if(document.getElementById("video-call-modal").classList.contains("visible")){
                document.getElementById("video-call-modal").classList.remove("visible");
                document.getElementById("video-call-modal").classList.add("invisible");
            }
            throw new Error("no cam and mic access");
          }
        }
    }
  }

  function triggerChannelEvent(channel,event,data){
    channel.trigger(event,data);
  }

  
 

  

  

  




  if(channel !== null){
    // channel.unbind('App\\Events\\MessageSent');
    channel.bind('App\\Events\\MessageSent',(d) => {
      // console.log("from chatter: " + d);
      
      if(isChatAndSenderSame(d.last_msg,dataFromLeftPanel).is_chat_same){
        // console.log('same');
        let prevData = chats;
        prevData = [...prevData,d.last_msg];
        setChats(prevData);
      }
      else{
        // console.log('not same');
      }
    });    
  }

  

  
  


  


  

  return (
    (Object.keys(dataFromLeftPanel).length === 0)?
        (
          <div id="chatter" className="flex flex-col w-screen h-screen lg:w-2/3">

            {/* {JSON.stringify(dataFromLeftPanel)} */}

            <div className="p-1 flex flex-row shadow-md justify-center items-center">
              <div className="flex items-center">
                <button onClick={showEditProfileModal} style={{transition:'0.4s'}} className='p-3 w-auto h-auto bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700
              '>Edit Profile</button>          
              </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="py-2 px-3">
                  <div className='flex justify-center items-center'>
                    <p className='text-5xl'>Welcome {getCurrentUser().user_first_name+" "+getCurrentUser().user_last_name}</p>
                  </div>
            
                  <div className='flex justify-center items-center'>
                    <div id="profile_icon" className='my-10 shadow-xl bg-no-repeat w-0 h-0 bg-contain rounded-full bg-center sm:w-20 sm:h-20 md:w-40 md:h-40 lg:w-60 lg:h-60' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${getCurrentUser().icon})`}}></div>
                  </div>

                </div>
            </div> 

            <div className="bg-gray-300 px-4 py-4 flex items-center">
              
              <div className="flex mx-4">
                <p className='text-lg'>You can start chatting either through left window or by searching any user from given text box in left panel.</p>
              </div>
              
            </div>




          </div>
        )
        :
        (
          <div id="chatter" className="flex flex-col w-screen h-screen lg:w-2/3">            
            {/* {JSON.stringify(dataFromLeftPanel)} */}
            
            <div className="py-1 px-2 bg-slate-100 flex flex-row justify-between items-center shadow-lg">
                <div className="flex items-center">
                  <div>
                    <button id='btn_backToLeftPanel' onClick={backToLeftPanel} className="mr-2 text-white shadow-md px-2 py-1 bg-[rgb(16,118,255)] rounded-lg hover:inset-2" type="button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                  </div>
                  <div>
                      {
                        (Object.keys(dataFromLeftPanel).length === 0)?
                          (<div className='bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center' style={{backgroundSize:'cover'}}></div>)
                          :  
                          (!('message_type' in dataFromLeftPanel))?
                            (<div className='shadow-md bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center md:w-12 md:h-12' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${dataFromLeftPanel.icon})`}}></div>)
                            :                      
                            (dataFromLeftPanel.message_type.indexOf("group") > -1)?
                              (<div className='shadow-md bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center md:w-12 md:h-12' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${dataFromLeftPanel.icon})`}}></div>)
                              :
                              (dataFromLeftPanel.sender_id == this_user)?
                                (<div className='shadow-md bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center md:w-12 md:h-12' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${dataFromLeftPanel.receiver_icon})`}}></div>)
                                :
                                (<div className='shadow-md bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center md:w-12 md:h-12' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${dataFromLeftPanel.sender_icon})`}}></div>)
                      }
                  </div>
                  <div className="ml-4">
                      <p className="text-grey-darkest">         
                        {
                          (Object.keys(dataFromLeftPanel).length === 0)?null
                          :
                          (!('message_type' in dataFromLeftPanel))?
                            dataFromLeftPanel.user_first_name
                            :
                            (dataFromLeftPanel.group_id)?
                              dataFromLeftPanel.group_nm:
                              (parseInt(dataFromLeftPanel.sender_id) === parseInt(this_user))?
                                dataFromLeftPanel.receiver_nm : dataFromLeftPanel.sender_nm
                        }
                      </p>
                      <p className="text-grey-darker text-xs mt-1">
                        
                      </p>
                  </div>
                </div>
                <div>
                   <button onClick={startVideoCall} className='text-white shadow-md px-2 py-1 bg-[rgb(16,118,255)] rounded-lg hover:inset-2'><FontAwesomeIcon icon={faPhone} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto" id='chat_list_div' onScroll={chatter_scroll_change}>

              <div className='flex justify-between'>
                {/* <video id="sender_vid" autoPlay></video> */}
                {/* <video id="rec_vid" autoPlay style={{"border":"2px"}}></video> */}
               
              </div>
              
                <div className="py-2 px-3" id="chats_container" ref={messagesEndRef}>
                  {(chats.length !== 0)?
                    chats.map((item)=>(
                      <Message key={item.id} data={item} />
                    ))
                    :
                    (
                      null
                    )
                  }
                  <div ref={messagesEndRef} id="box_end"></div>
                </div>

                
            </div> 

            <div className='flex justify-center'>  
              <img src={preloader} alt="chat_loader" id="chat_loader" className='hidden w-10'/>
            </div>

            <div className="bg-gray-300 px-4 py-4 flex items-center">
              
              <div className="flex w-full">
                <form onSubmit={handleSendMessage} className='flex w-full'>
                  <input id="msg_field" className="w-full rounded px-2 py-2" type="text"/>                      
                  <button type="submit" id="send_btn" className="py-[6px] ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center"><FontAwesomeIcon icon={faPaperPlane} /></button>
                  
                </form>
              </div>
              <div className='flex'>
                
                <button type="button" onClick={showSendFileModal} className="py-[6px] ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center"><FontAwesomeIcon icon={faFile} /></button>
                
              
              </div>
              
            </div>
            
            {/* {(document.getElementById('chat_list_div'))!==null?document.getElementById('chat_list_div').scrollTop = scroll:null} */}

          </div>
        )

        
  )

}
export default Chatter;