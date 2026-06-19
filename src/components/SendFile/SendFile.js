import React,{useContext} from "react";
import { ChatterContext } from '../../contexts/ChatterContext';
import {main_route,main_api_route, getCurrentUser,getCurrentUserToken} from '../../utilities/ExtraUtility';
// import { faXmark,faImage,faFile } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
// let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
// let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

export default function SendFile(){
    const [dataFromLeftPanel] = useContext(ChatterContext);
    let arr_for_uploaded = [];
    let index = -1;

    //triggered on input=file change
    function handleIconChange(evt){
        // consolelog(evt.target.accept);
        arr_for_uploaded = [];

        // const images = evt.target.files;
        if(evt.target.files.length > 0){
            for(const indi_files of evt.target.files){
                arr_for_uploaded.push(indi_files);
            }
        }
        // consolelog(arr_for_uploaded);
        // consolelog(evt.target.accept.indexOf("image"));

        if(evt.target.accept.indexOf("image") > -1){
            // consolelog("ready imag");
            loadImages();
        }
        else if(evt.target.accept.indexOf("application") > -1){
            // consolelog("ready file");
            loadFiles();
        }

    }

    //code for processing and displaying images before upload
    function loadImages(){
        if(arr_for_uploaded.length > 0){
            document.getElementById("send_images_holder").classList.remove('hidden');
            index = -1;
            document.getElementById("send_images_holder").innerHTML = "";
            
            for(const indi_imag of arr_for_uploaded){
                read_file(indi_imag);
            }
        }
        else{
            document.getElementById("send_images_holder").innerHTML = "";
            document.getElementById("send_images_holder").classList.add('hidden');
        }
    }
    function read_file(image_file){
        const reader = new FileReader();
        reader.readAsDataURL(image_file);
        reader.addEventListener('load', (data) => {
            // consolelog(image_file.name + " loaded");
            
            index++;
            arr_for_uploaded.push(image_file);
            arr_for_uploaded.splice(0,1);

            let close_btn = document.createElement("button");
            close_btn.innerHTML = "X";
            let class_list = "absolute bg-gray-800 right-0 top-0 text-white text-xl font-weight shadow-md px-3 py-2 ml-auto inline-flex items-center md:px-5";
            close_btn.id = "delete_"+index;
            close_btn.addEventListener('click',deleteImage);
            let class_list_arr = class_list.split(" ");
            class_list_arr.forEach(item => {
                close_btn.classList.add(item);
            });


            let image = document.createElement('img');
            image.src = reader.result;
            image.classList.add('w-full');
            
            let imag_div = document.createElement("div");
            imag_div.classList.add("mx-2");
            imag_div.classList.add("my-2");
            imag_div.classList.add("relative");
            imag_div.classList.add("shadow-md");
            imag_div.classList.add("border");
            
            imag_div.appendChild(close_btn);
            imag_div.appendChild(image);

            document.getElementById("send_images_holder").appendChild(imag_div);
            
            // consolelog(index);
            // consolelog(arr_for_uploaded);
        });
    }
    function deleteImage(image){
        let id = image.target.id;
        id = id.split("_");
        id = parseInt(id[1]);
        // id = id - 1;
        // consolelog(id);
        arr_for_uploaded.splice(id,1);
        // consolelog(arr_for_uploaded);
        loadImages();
    }
    //code for processing and displaying images before upload (end)


    
    //code for processing and displaying files before upload
    function loadFiles(){
        if(arr_for_uploaded.length > 0){
            document.getElementById("send_images_holder").classList.remove('hidden');
            index = -1;
            document.getElementById("send_images_holder").innerHTML = "";
            
            for(const indi_file of arr_for_uploaded){
                index++;
                let file_name_span = document.createElement("span");
                file_name_span.classList.add("m-2");
                file_name_span.innerHTML = indi_file.name;

                let close_btn = document.createElement("button");
                close_btn.innerHTML = "X";
                close_btn.id = "delete_"+index;
                close_btn.addEventListener('click',deleteFile);
                let class_list = "cursor-pointer text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-e text-sm px-5 py-2 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white";
                class_list = class_list.split(" ");
                class_list.forEach(item => {
                    close_btn.classList.add(item);
                });

                let holder_div = document.createElement("div");
                
                class_list = "flex rounded shadow-md m-1 bg-[rgb(1,166,26)] w-auto";
                class_list = class_list.split(" ");
                class_list.forEach(item => {
                    holder_div.classList.add(item);
                });

                holder_div.appendChild(file_name_span);
                holder_div.appendChild(close_btn);

                document.getElementById("send_images_holder").appendChild(holder_div);

            }
        }
        else{
            document.getElementById("send_images_holder").innerHTML = "";
            document.getElementById("send_images_holder").classList.add('hidden');
        }
    }
    function deleteFile(file){
        let id = file.target.id;
        id = id.split("_");
        id = parseInt(id[1]);
        // id = id - 1;
        // consolelog(id);
        arr_for_uploaded.splice(id,1);
        // consolelog(arr_for_uploaded);
        loadFiles();
    }
    //code for processing and displaying files before upload


    
    //triggered on browse buttons click
    function browseFiles(evt){
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = handleIconChange;
        input.removeAttribute("accept");
        if(evt.target.id === "browse_images_btn"){
            input.accept = "image/*";
        }
        else if(evt.target.id === "browse_documents_btn"){
            input.accept = "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf";
        }
        
        input.click();
    }
    
    //code for closing modal
    function closeModal(){
        document.getElementById("send-file-modal").classList.add("invisible");
        document.getElementById("send_images_holder").innerHTML = "";
        document.getElementById("send_images_holder").classList.add('hidden');
    }

    
    //triggered on send button click
    function handleSendFileAsMessage(evt){
        evt.preventDefault();
        let send_file_msg = document.getElementById("send_file_msg_tf").value;
        let send_file_msg_tmp = send_file_msg;
        send_file_msg_tmp = send_file_msg.trim();
        send_file_msg_tmp = send_file_msg_tmp.replace(/ /g,"");
        // console.log(`orig string: ${send_file_msg}, tmp_string: ${send_file_msg_tmp}, string_len: ${send_file_msg_tmp.length}`);
        // return;
        // consolelog('submitted');
        if(arr_for_uploaded.length === 0){
            alert("Select files to send!");
            return;
        }
        if(Object.keys(dataFromLeftPanel).length !== 0){
            // consolelog('length not zero');
            // consolelog(dataFromLeftPanel.message_type);
          
            if(!('message_type' in dataFromLeftPanel)){
                // send_one_to_one_message(dataFromLeftPanel.id,msg);
                // consolelog('m type undefined');
                if(send_file_msg_tmp.length > 0){
                    send_file_as_one_to_one_message(dataFromLeftPanel.id,arr_for_uploaded,send_file_msg);
                }
                else{                    
                    send_file_as_one_to_one_message(dataFromLeftPanel.id,arr_for_uploaded);
                }
            }
            else {
                // consolelog('m type not undefined');
                if(dataFromLeftPanel.message_type.indexOf("group") > -1){
                    // consolelog('sending gorup msg');
                    if(send_file_msg_tmp.length > 0){
                        send_file_as_group_message(dataFromLeftPanel.group_id,arr_for_uploaded,send_file_msg);
                    }
                    else{
                        send_file_as_group_message(dataFromLeftPanel.group_id,arr_for_uploaded);
                    }
                }
                else if(dataFromLeftPanel.message_type.indexOf("one_to_one") > -1){
                    // consolelog('sending 1t1 msg');
                    if(parseInt(dataFromLeftPanel.sender_id) === parseInt(this_user)){
                        if(send_file_msg_tmp.length > 0){
                            send_file_as_one_to_one_message(dataFromLeftPanel.receiver_id,arr_for_uploaded,send_file_msg);
                        }
                        else{                    
                            send_file_as_one_to_one_message(dataFromLeftPanel.receiver_id,arr_for_uploaded);
                        }
                    }
                    else{
                        if(send_file_msg_tmp.length > 0){
                            send_file_as_one_to_one_message(dataFromLeftPanel.sender_id,arr_for_uploaded,send_file_msg);
                        }
                        else{                    
                            send_file_as_one_to_one_message(dataFromLeftPanel.sender_id,arr_for_uploaded);
                        }
                    }
                }
            }
        }    
    }

    function send_file_as_group_message(group_id, files_to_send, msg = null){
        let fd = new FormData();
        for (var i = 0; i < files_to_send.length; i++) {
            fd.append('files_to_send[]', files_to_send[i]);
        }
        if(msg !== null){
            fd.append("message",msg);
        }
        else{
            fd.delete("message");
        }
        // fd.append("files_to_send", files_to_send);
        fd.append("group_id", group_id);
        // console.log(fd);
        // return;

        document.getElementById("file_send_btn").innerHTML = `<img src='${main_route}/images/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
        document.getElementById("file_send_btn").disabled = true;

        fetch(`${main_api_route}/user/send-group-message`,{
            method: 'POST',
            headers: {
                // 'Authorization': "Bearer "+cur_user_token
            },
            body: fd
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            document.getElementById("file_send_btn").innerHTML = "Send";
            document.getElementById("file_send_btn").disabled = false;
            document.getElementById("send_images_holder").innerHTML = "";
            document.getElementById("send_images_holder").classList.add('hidden');
            document.getElementById("send_file_msg_tf").value = "";

            
        })
        .catch(err => {
            console.error(err);
            document.getElementById("file_send_btn").innerHTML = "Send";
            document.getElementById("file_send_btn").disabled = false;
        });
    }

    function send_file_as_one_to_one_message(receiver_id, files_to_send, msg = null){
        let fd = new FormData();
        for (var i = 0; i < files_to_send.length; i++) {
            fd.append('files_to_send[]', files_to_send[i]);
        }
        if(msg !== null){
            fd.append("message",msg);
        }
        else{
            fd.delete("message");
        }
        // fd.append("files_to_send", files_to_send);
        fd.append("receiver_id", receiver_id);
        // console.log(fd);
        // return;
        document.getElementById("file_send_btn").innerHTML = `<img src='${main_route}/images/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
        document.getElementById("file_send_btn").disabled = true;

        fetch(`${main_api_route}/user/send-one-to-one-message`,{
            method: 'POST',
            headers: {
                // 'Authorization': "Bearer "+cur_user_token
            },
            body: fd
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            document.getElementById("file_send_btn").innerHTML = "Send";
            document.getElementById("file_send_btn").disabled = false;
            document.getElementById("send_images_holder").innerHTML = "";
            document.getElementById("send_images_holder").classList.add('hidden');
            document.getElementById("send_file_msg_tf").value = "";
        })
        .catch(err => {
            console.error(err);
            document.getElementById("file_send_btn").innerHTML = "Send";
            document.getElementById("file_send_btn").disabled = false;
        });
    }
    

    return (
        <div>
            <div id="send-file-modal" className={`invisible fixed z-50 top-0 px-5 pb-12 bg-[#000000a7] flex items-center justify-center h-screen w-screen overflow-y-scroll`}>
                <div className="relative z-50 w-full sm:w-[60%] md:w-[60%] max-h-full">
                    <div className="relative w-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={closeModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Send File</h3>
                                <form className="space-y-6" onSubmit={handleSendFileAsMessage}>
                                    <div id="send_images_holder" className="hidden flex-wrap justify-center border w-full max-h-80 overflow-y-scroll">           
                                          
                                        {/* <div className="m-1 relative">
                                            <button type="button" className="absolute bg-gray-800 right-0 top-0 text-white text-sm p-1.5 ml-auto inline-flex items-center">
                                                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
                                            </button>
                                            <img id="send_file_preview" className="w-40" src={`${main_route}/user_images/profile_pictures/profile2.jpg`} alt="" />
                                        </div> */}
                                    
                                    </div>

                                    <div>
                                        <button onClick={browseFiles} id="browse_images_btn" type="button" className="bg-[rgba(0,157,255,0.59)] w-full text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            Browse images
                                        </button>
                                    </div>
                        
                                    {/* <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Icon</label>
                                        <input type="file" multiple onChange={handleIconChange} name="edit_profile_icon" id="files_to_send" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    </div> */}
                                    <div>
                                        <button onClick={browseFiles} id="browse_documents_btn" type="button" className="bg-[rgba(0,157,255,0.59)] w-full text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            Browse documents
                                        </button>                                        
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message</label>
                                        <input type="text" name="send_file_msg_tf" id="send_file_msg_tf" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                    </div>
                                    
                                    
                                    <button id="file_send_btn" type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}