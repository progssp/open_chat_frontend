import Pusher from "pusher-js";

export const main_api_route = "/system/api";
export const main_route = "/app";
export const backend_images_route = "/storage";
export const info_message = "info";

var channel = null;
export let channel_for_left_panel = null;
export let video_channel = null;
let pusher = null;

export function getCurrentUser() {
  let cur_user =
    window.localStorage.getItem("cur_user") !== null
      ? window.localStorage.getItem("cur_user")
      : null;
  if (cur_user === null) {
    return null;
  } else {
    return JSON.parse(window.localStorage.getItem("cur_user"));
  }
}

export function setCurrentUser(user_obj) {
  window.localStorage.setItem("cur_user", JSON.stringify(user_obj));
}

export function getCurrentUserToken() {
  return;
  // let cur_user_token = ((window.localStorage.getItem("cur_user_token"))!==null)?(window.localStorage.getItem("cur_user_token")):null;
  // if(cur_user_token === null){
  //     return null;
  // }
  // else{
  //     return (window.localStorage.getItem("cur_user_token"));
  // }
}

export function subscribeSocket() {
  // return null;
  if (channel !== null) {
    return channel;
  }

  // let user_token =
  //   getCurrentUserToken() !== null ? getCurrentUserToken() : null;
  let user = getCurrentUser() !== null ? getCurrentUser() : null;

  if (user !== null) {
    //suscribing to pusher channel
    //code for laravel websocket
    // Pusher.logToConsole = false;
    // var pusher = new Pusher('12345', {
    //     cluster: 'mt1',
    //     broadcaster: 'pusher',
    //     authEndpoint:`${main_api_route}/broadcasting/auth`,
    //     auth: {
    //         headers: {
    //         'Authorization': 'Bearer '+user_token
    //             //'X-CSRF-TOKEN':a_tok
    //         }
    //     },
    //     //key: process.env.MIX_PUSHER_APP_KEY,
    //     //cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    //     forceTLS: false,
    //     // wsHost: "localhost",
    //     wsHost: window.location.hostname,
    //     wsPort: 6001,
    // });

    //code for online pusher console
    Pusher.logToConsole = false;
    pusher = new Pusher("649f5ddeef4b7a77a1f3", {
      cluster: "ap2",
      authEndpoint: `${main_api_route}/broadcasting/auth`,
      auth: {
        headers: {
          // 'Authorization': 'Bearer '+user_token
        },
      },
      forceTLS: true,
      // wsHost: "https://system.tailf90f7d.ts.net",
      // wsHost: window.location.hostname,
      // wsPort: 80,
      // wssPort: 443,
      // enabledTransports: ['ws','wss']
    });
    console.info(`pusher info`);
    console.info(`${pusher}`);
    // // console.log('socket authenticated for user: '+user.id);
    channel = pusher.subscribe("private-user-" + user.id);
    channel_for_left_panel = pusher.subscribe("private-user-" + user.id);
    // console.log('channel subscribed: private-user-'+user.id);
    return channel;
  } else {
    return null;
  }
}

export function subs_video_channel() {
  let user_token =
    getCurrentUserToken() !== null ? getCurrentUserToken() : null;
  // let user = getCurrentUser() !== null ? getCurrentUser() : null;
  pusher = new Pusher("649f5ddeef4b7a77a1f3", {
    cluster: "ap2",
    authEndpoint: `${main_api_route}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: "Bearer " + user_token,
      },
    },
    forceTLS: true,
    // wsHost: "https://system.tailf90f7d.ts.net",
    // wsHost: window.location.hostname,
    // wsPort: 80,
    // wssPort: 443,
    // enabledTransports: ['ws','wss']
    // wsHost: "localhost",
    // wsHost: window.location.hostname,
    // wsPort: 6001,
  });
  video_channel = pusher.subscribe("private-video_call");
  return video_channel;
}

export function isChatAndSenderSame(obj_to_check, obj_with_check) {
  if (!("message_type" in obj_with_check)) {
    if (
      (parseInt(obj_to_check.sender_id) === parseInt(getCurrentUser().id) &&
        parseInt(obj_to_check.receiver_id) === parseInt(obj_with_check.id)) ||
      (parseInt(obj_to_check.sender_id) === parseInt(obj_with_check.id) &&
        parseInt(obj_to_check.receiver_id) === parseInt(getCurrentUser().id))
    ) {
      return { is_chat_same: true, is_sender_same: true };
    } else {
      return { is_chat_same: false, is_sender_same: false };
    }
  }
  if (
    obj_to_check.message_type.indexOf("group") > -1 &&
    obj_with_check.message_type.indexOf("group") > -1
  ) {
    if (parseInt(obj_to_check.group_id) === parseInt(obj_with_check.group_id)) {
      if (
        parseInt(obj_to_check.sender_id) === parseInt(obj_with_check.sender_id)
      ) {
        return { is_chat_same: true, is_sender_same: true };
      } else {
        return { is_chat_same: true, is_sender_same: false };
      }
    } else {
      return { is_chat_same: false, is_sender_same: false };
    }
  } else if (
    obj_to_check.message_type.indexOf("one_to_one") > -1 &&
    obj_with_check.message_type.indexOf("one_to_one") > -1
  ) {
    if (
      (parseInt(obj_to_check.sender_id) ===
        parseInt(obj_with_check.sender_id) &&
        parseInt(obj_to_check.receiver_id) ===
          parseInt(obj_with_check.receiver_id)) ||
      (parseInt(obj_to_check.sender_id) ===
        parseInt(obj_with_check.receiver_id) &&
        parseInt(obj_to_check.receiver_id) ===
          parseInt(obj_with_check.sender_id))
    ) {
      return { is_chat_same: true, is_sender_same: true };
    } else {
      return { is_chat_same: false, is_sender_same: false };
    }
  } else {
    return { is_chat_same: false, is_sender_same: false };
  }
}

export function showEditProfileModal() {
  if (
    document
      .getElementById("edit-profile-modal")
      .classList.contains("invisible")
  ) {
    document.getElementById("edit-profile-modal").classList.remove("invisible");
    if (getCurrentUser() !== null) {
      document.getElementById("edit_profile_preview").src =
        `${backend_images_route}${getCurrentUser().icon}`;
      document.getElementById("edit_profile_fname").value =
        `${getCurrentUser().user_first_name}`;
      document.getElementById("edit_profile_lname").value =
        `${getCurrentUser().user_last_name}`;
      document.getElementById("edit_profile_email").value =
        `${getCurrentUser().email}`;
    }
  }
}

export function fetchImage(image_url, tag_to_place) {
  // console.log(tag_to_place);
  fetch(`${backend_images_route}${image_url}`)
    .then((response) => response.blob())
    .then((blob) => {
      const image_url = URL.createObjectURL(blob);
      // console.log(image_url);
      document.getElementById(tag_to_place).style.backgroundImage =
        `url(${image_url})`;
      // document.getElementById(tag_to_place).innerHTML = image_url;
    })
    .catch();
}
