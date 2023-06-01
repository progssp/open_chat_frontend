import Pusher from "pusher-js";

export const main_api_route = "/api";
export const main_route = "/frontend";
export const backend_images_route = "/storage";
var channel = null;

export function getCurrentUser(){
    let cur_user = ((window.localStorage.getItem("cur_user"))!==null)?(window.localStorage.getItem("cur_user")):null;
    if(cur_user === null){
        return null;
    }
    else{
        return JSON.parse(window.localStorage.getItem("cur_user"));
    }
}

export function setCurrentUser(user_obj){
    window.localStorage.setItem('cur_user',JSON.stringify(user_obj));
}

export function getCurrentUserToken(){
    let cur_user_token = ((window.localStorage.getItem("cur_user_token"))!==null)?(window.localStorage.getItem("cur_user_token")):null;
    if(cur_user_token === null){
        return null;
    }
    else{
        return (window.localStorage.getItem("cur_user_token"));
    }
}

export function subscribeSocket(){
    if(channel !== null){
        return channel;
    }

    let user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;
    let user = (getCurrentUser()!==null)?getCurrentUser():null;
    
    if(user !== null){
        //suscribing to pusher channel
        Pusher.logToConsole = false;
        var pusher = new Pusher('12345', {
            cluster: 'mt1',
            broadcaster: 'pusher',
            authEndpoint:`${main_api_route}/broadcasting/auth`,
            auth: {
                headers: {
                'Authorization': 'Bearer '+user_token
                    //'X-CSRF-TOKEN':a_tok
                }
            },
            //key: process.env.MIX_PUSHER_APP_KEY,
            //cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: false,
            // wsHost: "localhost",
            wsHost: window.location.hostname,
            wsPort: 6001,
        });
        console.log('socket authenticated for user: '+user.id);
        channel = pusher.subscribe('private-user-'+user.id);
        
        console.log('channel subscribed: private-user-'+user.id);
        return channel;
    }
    else{
        return null;
    }
}

export function isChatAndSenderSame(obj_to_check,obj_with_check){
    if((obj_to_check.message_type == obj_with_check.message_type) && (obj_to_check.message_type == "group")){
        if(obj_to_check.group_id === obj_with_check.group_id){
            if(obj_to_check.sender_id === obj_with_check.sender_id){
                return {is_chat_same:true, is_sender_same: true};
            }
            else{
                return {is_chat_same:true, is_sender_same: false};
            }
        }
        else{
            return {is_chat_same:false, is_sender_same: false};
        }
    }
    else if((obj_to_check.message_type == obj_with_check.message_type) && (obj_to_check.message_type == "one_to_one")){
        if(((obj_to_check.sender_id == obj_with_check.sender_id)&&(obj_to_check.receiver_id == obj_with_check.receiver_id))||((obj_to_check.sender_id == obj_with_check.receiver_id)&&(obj_to_check.receiver_id == obj_with_check.sender_id))){
            return {is_chat_same:true, is_sender_same: true};
        }
        else{
            return {is_chat_same: false, is_sender_same: false};
        }
    }
    else{
        return {is_chat_same: false, is_sender_same: false};
    }
}

export function showEditProfileModal(){
    if(document.getElementById("edit-profile-modal").classList.contains("invisible")){
        document.getElementById("edit-profile-modal").classList.remove("invisible");
        if(getCurrentUser() !== null){
            document.getElementById('edit_profile_preview').src = `${backend_images_route}${getCurrentUser().icon}`;
            document.getElementById('edit_profile_name').value = `${getCurrentUser().name}`;
            document.getElementById('edit_profile_email').value = `${getCurrentUser().email}`;
        }
    }
}