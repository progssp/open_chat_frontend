import React, {useEffect,useContext} from 'react';
import { ChatterContext } from '../../contexts/ChatterContext';
import { faArrowLeft,faPaperPlane,faFile} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Message from '../../components/Message/Message';
import { main_api_route,backend_images_route,showEditProfileModal,getCurrentUser,getCurrentUserToken,isChatAndSenderSame,subscribeSocket} from '../../utilities/ExtraUtility';
import SendFile from '../SendFile/SendFile';
let channel = subscribeSocket();
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;

function Chatter() {
  const [dataFromLeftPanel,setDataFromLeftPanel,chats,setChats] = useContext(ChatterContext);

  useEffect(()=>{
    function getOneToOneData(sender_id,receiver_id){
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
        setChats(data);
      })
      .catch(err => {
        console.error(err);
      });
    }
    function getGroupData(group_id){
      fetch(`${main_api_route}/user/get-group-messages`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'group_id='+group_id
      })
      .then(result => result.json())
      .then(data => {
        // console.log(data);
        setChats(data);
      })
      .catch(err => {
        console.error(err);
      });
    }
    if((dataFromLeftPanel.message_type === "one_to_one")||(dataFromLeftPanel.message_type === "one_to_one_info")){
      if(dataFromLeftPanel.sender_id === this_user){
        // getOneToOneData(this_user,dataFromLeftPanel.receiver_id);
      }
      else{
        // console.log(`getdata(${dataFromLeftPanel.sender_id},${this_user})`)
        // getOneToOneData(dataFromLeftPanel.sender_id,this_user);
      }
    }
    else if((dataFromLeftPanel.message_type === "group")||(dataFromLeftPanel.message_type === "group_info")){      
      // console.log(`getgroupdata(${dataFromLeftPanel.group_id}`)
      // getGroupData(dataFromLeftPanel.group_id);
    }


    if(window.innerWidth >= 768){
      document.getElementById("chatter").classList.add("flex");
      document.getElementById("chatter").classList.add("flex-col");
      document.getElementById("chatter").classList.add("w-2/3");
      document.getElementById("chatter").classList.remove("w-screen");
      document.getElementById("chatter").classList.remove("hidden");
      if(document.getElementById("btn_backToLeftPanel")!==null){
        document.getElementById("btn_backToLeftPanel").classList.add('hidden');
      }
    }
    else {
      if(Object.keys(dataFromLeftPanel).length === 0){
        document.getElementById("chatter").classList.add("flex");
        document.getElementById("chatter").classList.add("flex-col");
        document.getElementById("chatter").classList.remove("w-2/3");
        document.getElementById("chatter").classList.add("w-screen");
        document.getElementById("chatter").classList.add("hidden");
      }
      else{
        document.getElementById("chatter").classList.add("flex");
        document.getElementById("chatter").classList.add("flex-col");
        document.getElementById("chatter").classList.remove("w-2/3");
        document.getElementById("chatter").classList.remove("hidden");
        document.getElementById("chatter").classList.add("w-screen");
        document.getElementById("btn_backToLeftPanel").classList.remove('hidden');
      }
    }
  },[dataFromLeftPanel.id,dataFromLeftPanel.message_type]);

  function handleSendMessage(evt){
    let msg = document.querySelector("#msg_field").value;
    if(Object.keys(dataFromLeftPanel).length !== 0){
      
      if(Object.keys(dataFromLeftPanel).message_type === undefined){
        send_one_to_one_message(dataFromLeftPanel.id,msg);
      }
      else {
        if(dataFromLeftPanel.message_type.indexOf("group") > -1){
          send_group_message(dataFromLeftPanel.group_id,msg);
        }
        else if(dataFromLeftPanel.message_type.indexOf("one_to_one") > -1){
          if(dataFromLeftPanel.sender_id === this_user){
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
    fetch(`${main_api_route}/user/send-one-to-one-message`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+getCurrentUserToken()
      },
      body: `receiver_id=${user_id}&message=${msg}`
    })
    .then(result => result.json())
    // .then(data => console.log(data))
    .catch(err => console.error(err));
  }

  function send_group_message(group_id, msg){
    fetch(`${main_api_route}/user/send-group-message`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+getCurrentUserToken()
      },
      body: `group_id=${group_id}&message=${msg}`
    })
    .then(result => result.json())
    // .then(data => console.log(data))
    .catch(err => console.error(err));
  }

  if(channel !== null){
    channel/*.unbind('App\\Events\\MessageSent')*/.bind('App\\Events\\MessageSent',(d) => {
      if(isChatAndSenderSame(d,dataFromLeftPanel).is_chat_same){
        console.log('same');
        let prevData = chats;
        prevData = [...prevData,d];
        setChats(prevData);
      }
      else{
        console.log('not same');
      }
    });
  }

  window.addEventListener('resize', function(evt){
    if(window.innerWidth >= 768){
      document.getElementById("chatter").classList.add("flex");
      document.getElementById("chatter").classList.add("flex-col");
      document.getElementById("chatter").classList.add("w-2/3");
      document.getElementById("chatter").classList.remove("w-screen");
      document.getElementById("chatter").classList.remove("hidden");
      if(document.getElementById("btn_backToLeftPanel")!==null){
        document.getElementById("btn_backToLeftPanel").classList.add('hidden');
      }
    }
    else {
      if(Object.keys(dataFromLeftPanel).length === 0){
        document.getElementById("chatter").classList.add("flex");
        document.getElementById("chatter").classList.add("flex-col");
        document.getElementById("chatter").classList.remove("w-2/3");
        document.getElementById("chatter").classList.add("w-screen");
        document.getElementById("chatter").classList.add("hidden");
      }
      else{
        document.getElementById("chatter").classList.add("flex");
        document.getElementById("chatter").classList.add("flex-col");
        document.getElementById("chatter").classList.remove("w-2/3");
        document.getElementById("chatter").classList.remove("hidden");
        document.getElementById("chatter").classList.add("w-screen");
        document.getElementById("btn_backToLeftPanel").classList.remove('hidden');

      }
    }
  });

  function backToLeftPanel(){    
      document.getElementById("left_panel").classList.remove("hidden");
      document.getElementById("chatter").classList.add("hidden");
  }

  function showSendFileModal(){
    if(document.getElementById("send-file-modal").classList.contains("invisible")){
        document.getElementById("send-file-modal").classList.remove("invisible");
    }
}

 
  
  
  return (
    (Object.keys(dataFromLeftPanel).length === 0)?
        (
          <div id="chatter" className="flex flex-col w-2/3 h-screen bg-slate-400">

            <div className="p-1 flex flex-row shadow-md justify-center items-center">
              <div className="flex items-center">
                <button onClick={showEditProfileModal} style={{transition:'0.4s'}} className='p-3 w-auto h-auto bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700
              '>Edit Profile</button>          
              </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="py-2 px-3">
                  <div className='flex justify-center items-center'>
                    <p className='text-5xl'>Welcome {getCurrentUser().name}</p>
                  </div>
            
                  <div className='flex justify-center items-center'>
                    <div className='my-10 shadow-xl bg-no-repeat w-0 h-0 bg-contain rounded-full bg-center sm:w-20 sm:h-20 md:w-40 md:h-40 lg:w-60 lg:h-60' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${getCurrentUser().icon})`}}></div>
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
          <div id="chatter" className="flex flex-col w-2/3 h-screen">
            
            <div className="py-1 px-2 bg-gray-400 flex flex-row justify-between items-center">
                <div className="flex items-center">
                    <div>
                      <button id='btn_backToLeftPanel' onClick={backToLeftPanel} className="py-[6px] mr-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center" type="button"><FontAwesomeIcon icon={faArrowLeft} /></button>
                    </div>
                    <div>
                        {
                          (Object.keys(dataFromLeftPanel).length === 0)?
                            (<div className='bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center' style={{backgroundSize:'cover'}}></div>)
                            :  
                            (!('message_type' in dataFromLeftPanel))?
                              (<div className='shadow-md bg-no-repeat w-12 h-12 bg-cover rounded-full bg-center md:w-12 md:h-12' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${dataFromLeftPanel.icon})`}}></div>)
                              :                      
                              (dataFromLeftPanel.message_type == "group"||dataFromLeftPanel.message_type == "group_info")?
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
                              dataFromLeftPanel.name
                              :
                              (dataFromLeftPanel.group_id)?
                                dataFromLeftPanel.group_nm:
                                (dataFromLeftPanel.sender_id === this_user)?
                                  dataFromLeftPanel.receiver_nm : dataFromLeftPanel.sender_nm
                          }
                        </p>
                        <p className="text-grey-darker text-xs mt-1">
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="py-2 px-3">
                  {chats.map((item)=>(
                    <Message key={item.id} data={item} />
                  ))}
                </div>
            </div> 

            <div className="bg-gray-300 px-4 py-4 flex items-center">
              
              <div className="flex w-full">
                <form onSubmit={handleSendMessage} className='flex w-full'>
                  <input id="msg_field" className="w-full rounded px-2 py-2" type="text"/>                      
                  <button type="submit" className="py-[6px] ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center"><FontAwesomeIcon icon={faPaperPlane} /></button>
                </form>
              </div>
              <div className='flex'>
                <button type="button" onClick={showSendFileModal} className="py-[6px] ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-lg px-3 text-center"><FontAwesomeIcon icon={faFile} /></button>
              </div>
              
            </div>

                
            <SendFile/>

          </div>
        )
    
  )
}

export default Chatter;