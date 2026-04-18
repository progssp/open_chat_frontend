import React, { useEffect, useState, useContext } from "react";
import { ChatterContext } from "../../contexts/ChatterContext";
import {
  main_route,
  main_api_route,
  getCurrentUser,
  getCurrentUserToken,
} from "../../utilities/ExtraUtility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVolumeUp,
  faVolumeOff,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import {
  subscribeSocket,
  subs_video_channel,
  backend_images_route,
} from "../../utilities/ExtraUtility";
let channel = subscribeSocket();
let video_channel = subs_video_channel();
let this_user = getCurrentUser() !== null ? getCurrentUser().id : null;
let cur_user = getCurrentUser() !== null ? getCurrentUser() : null;
let cur_user_token =
  getCurrentUserToken() !== null ? getCurrentUserToken() : null;

// Initialize variables
let localVideo = null;
let localStream = null;
let remoteVideo = document.querySelector("#rec_vid");
let remoteAudio = null;
let remoteStream = null;
let to = null;
let pc = null;
let cameraAccess = 0;
let timeout = null;

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall() {
  const [caller, set_caller] = useState({});
  const [callee, set_callee] = useState({});
  const [dataFromLeftPanel, setDataFromLeftPanel, chats, setChats] =
    useContext(ChatterContext);
  const [stop_video, set_stop_video] = useState(false);
  const [stop_audio, set_stop_audio] = useState(false);

  useEffect(() => {}, []);

  // getCam();
  async function getCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // console.log('Received local stream');
      localVideo = document.querySelector("#sender_vid");
      remoteVideo = document.querySelector("#rec_vid");
      remoteAudio = document.querySelector("#rec_audio");
      localStream = stream;
      localVideo.srcObject = stream;
      localStream.getVideoTracks().forEach((track) => (track.enabled = false));
      // console.log(stream);
    } catch (e) {
      // console.error(e);
      // console.error("no cam/mic access");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        //   console.log('Received local stream');
        localVideo = document.querySelector("#sender_vid");
        remoteVideo = document.querySelector("#rec_vid");
        remoteAudio = document.querySelector("#rec_audio");
        localStream = stream;
        localVideo.srcObject = stream;
        localStream
          .getVideoTracks()
          .forEach((track) => (track.enabled = false));
        //   console.log(stream);
      } catch (e) {
        // console.error("no cam access");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          // console.log('Received local stream');
          localVideo = document.querySelector("#sender_vid");
          remoteVideo = document.querySelector("#rec_vid");
          remoteAudio = document.querySelector("#rec_audio");
          localStream = stream;
          localVideo.srcObject = stream;
          // console.log(stream);
        } catch (e) {
          // console.error("no mic access");
          if (
            document
              .getElementById("video-call-modal")
              .classList.contains("visible")
          ) {
            document
              .getElementById("video-call-modal")
              .classList.remove("visible");
            document
              .getElementById("video-call-modal")
              .classList.add("invisible");
          }
          throw new Error("no cam and mic access");
        }
      }
    }
  }

  function triggerChannelEvent(channel, event, data) {
    channel.trigger(event, data);
  }

  function closeModal() {
    document.getElementById("video-call-modal").classList.add("invisible");
  }

  function acceptCall(evt) {
    // let to = document.getElementById("call_from_span").innerHTML;
    video_channel.trigger("client-accept-call", { from: this_user, to: to });
    document.getElementById("call-request-modal").classList.add("invisible");
    document.getElementById("video-call-modal").classList.remove("invisible");
    clearTimeout(timeout);
  }

  function rejectCall(evt) {
    // let to = document.getElementById("call_from_span").innerHTML;
    video_channel.trigger("client-reject-call", { from: this_user, to: to });
    document.getElementById("call-request-modal").classList.add("invisible");
    stopBothVideoAndAudio();
  }

  function endCall(evt) {
    pc.close();
    pc = null;
    video_channel.trigger("client-end-call", { from: this_user, to: to });
    document.getElementById("call-request-modal").classList.add("invisible");
    hideVideoCallModal();
    stopBothVideoAndAudio();
  }

  function stopVideo() {
    set_stop_video(!stop_video);
    // const video = document.getElementById('sender_vid');
    // const mediaStream = video.srcObject;
    // const tracks = mediaStream.getVideoTracks();
    localStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = stop_video));

    // // console.log(tracks[0].enabled);
  }

  function stopAudio() {
    set_stop_audio(!stop_audio);
    const video = document.getElementById("sender_vid");
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getAudioTracks();
    tracks[0].enabled = stop_audio;
    // console.log(tracks[0].enabled);
  }

  async function createPeerConnection() {
    pc = new RTCPeerConnection();

    // console.log(localStream.getTracks());

    pc.onicecandidate = (e) => {
      const message = {
        type: "candidate",
        candidate: null,
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      setTimeout(() => {
        video_channel.trigger("client-ice_candidate", {
          from: this_user,
          to: to,
          data: message,
        });
      }, 1);
      // console.log(e.candidate);
      // console.log("from: " + this_user + "to: " + to);
    };

    pc.onconnectionstatechange = (evt) => {
      // console.log(evt.target.connectionState);

      if (evt.target.connectionState == "connected") {
        // console.log(evt);
        showVideoCallModal();

        // localVideo.muted = !localVideo.muted;
        // remoteVideo.muted = !remoteVideo.muted;
        // remoteVideo.srcObject = remoteStream;
      }
    };
    // console.log("done candidate adding");

    pc.ontrack = (e) => {
      // console.log(e);
      remoteVideo.srcObject = e.streams[0];
      // remoteVideo = e.streams[0];
      remoteAudio.srcObject = e.streams[0];
    };

    localStream
      .getAudioTracks()
      .forEach((track) => pc.addTrack(track, localStream));
    localStream
      .getVideoTracks()
      .forEach((track) => pc.addTrack(track, localStream));

    localStream.getTracks().forEach((track) => (track.enabled = false));
    set_stop_audio(true);
    set_stop_video(true);
    // document.getElementById("sender_vid").srcObject.getTracks().forEach(track => pc.addTrack(track,localStream));
  }

  if (video_channel != null) {
    video_channel.unbind("client-make-call-request");
    video_channel.bind("client-make-call-request", handleCallRequest);

    video_channel.unbind("client-accept-call");
    video_channel.bind("client-accept-call", makeCall);

    video_channel.unbind("client-offer");
    video_channel.bind("client-offer", handleOffer);

    video_channel.unbind("client-answer");
    video_channel.bind("client-answer", handleAnswer);

    video_channel.unbind("client-ice_candidate");
    video_channel.bind("client-ice_candidate", handleCandidate);

    video_channel.unbind("client-stop-call");
    video_channel.bind("client-stop-call", handleStopCall);

    video_channel.unbind("client-end-call");
    video_channel.bind("client-end-call", handleEndCall);

    video_channel.unbind("client-reject-call");
    video_channel.bind("client-reject-call", handleRejectCall);

    video_channel.unbind("client-unanswered-call");
    video_channel.bind("client-unanswered-call", handleUnansweredCall);
  }

  function handleCallRequest(data) {
    if (
      parseInt(data.callee.callee_id) === parseInt(this_user) ||
      parseInt(data.from.id) === parseInt(this_user)
    ) {
      // console.log(data);
      set_caller(data.from);
      set_callee(data.callee);
    }

    // console.log(data);
    // condition for caller
    if (parseInt(data.from.id) == parseInt(this_user)) {
      const video = document.getElementById("sender_vid");

      // A video's MediaStream object is available through its srcObject attribute
      const mediaStream = video.srcObject;
      localStream = mediaStream;
      to = data.to;
      remoteVideo = document.querySelector("#rec_vid");
      remoteAudio = document.querySelector("#rec_audio");

      document
        .getElementById("call-request-modal")
        .classList.remove("invisible");
      document.getElementById("call_from_span").innerHTML = "";
      document.getElementById("call_from_name_span").innerHTML =
        data.callee.callee_name;
      document.getElementById("call_from_image").style.backgroundImage =
        `url('${backend_images_route}${data.callee.callee_icon}`;
      document.getElementById("accept_call_btn").style.display = `none`;
      timeout = setTimeout(() => {
        triggerChannelEvent(video_channel, "client-unanswered-call", {
          from: this_user,
          to: to,
        });
        document
          .getElementById("call-request-modal")
          .classList.add("invisible");
        stopBothVideoAndAudio();
        clearTimeout(timeout);
      }, 40000);
    }

    //condition for callee
    if (parseInt(data.to) == parseInt(this_user)) {
      // if(!pc){
      to = data.from.id;
      document
        .getElementById("call-request-modal")
        .classList.remove("invisible");
      document.getElementById("call_from_span").innerHTML = parseInt(
        data.from.id,
      );
      document.getElementById("call_from_name_span").innerHTML =
        data.from.user_first_name;
      document.getElementById("call_from_image").style.backgroundImage =
        `url('${backend_images_route}${data.from.icon}`;
      document.getElementById("accept_call_btn").style.display = `block`;
      timeout = setTimeout(() => {
        triggerChannelEvent(video_channel, "client-unanswered-call", {
          from: this_user,
          to: to,
        });
        document
          .getElementById("call-request-modal")
          .classList.add("invisible");
        stopBothVideoAndAudio();
        clearTimeout(timeout);
      }, 30000);
      getCam()
        .then(() => {
          // console.log("now trigger event");
        })
        .catch((err) => {
          // console.error(err);
          document
            .getElementById("call-request-modal")
            .classList.add("invisible");
          triggerChannelEvent(video_channel, "client-stop-call-", {
            from: this_user,
            to: to,
          });
        });
      // }
    }
  }

  async function makeCall(data) {
    if (parseInt(data.to) == parseInt(this_user)) {
      document.getElementById("call-request-modal").classList.add("invisible");
      clearTimeout(timeout);
      // console.log('started making call to:' + data.from);
      showVideoCallModal();

      await createPeerConnection();

      const offer = await pc.createOffer({ offerToReceiveVideo: true });
      // console.log("offer from caller side: " + offer);

      // socket.emit('offer',mySocketId,to,offer);
      video_channel.trigger("client-offer", {
        from: this_user,
        to: data.from,
        offer: offer,
      });
      await pc.setLocalDescription(offer);
    }
  }

  async function handleOffer(data) {
    if (parseInt(data.to) == parseInt(this_user)) {
      // console.log(data);

      to = data.from;
      // if (pc) {
      //     // console.error('existing peerconnection');
      //     return;
      // }
      await createPeerConnection();

      await pc.setRemoteDescription(data.offer);

      const answer = await pc.createAnswer({ offerToReceiveVideo: true });
      await pc.setLocalDescription(answer);
      // socket.emit('answer',mySocketId, data.from, answer);
      video_channel.trigger("client-answer", {
        from: this_user,
        to: to,
        answer: answer,
      });

      // console.log(data.offer);
    }
  }

  async function handleAnswer(data) {
    if (parseInt(data.to) == parseInt(this_user)) {
      // console.log(data);
      // if (!pc) {
      // console.error('no peerconnection');
      // return;
      // }
      // console.log(data.answer);

      await pc.setRemoteDescription(data.answer);
    }
  }

  async function handleCandidate(candidate) {
    if (parseInt(candidate.to) == parseInt(this_user)) {
      //   console.log(candidate.data);

      if (!pc) {
        // console.error('no peerconnection');
        return;
      }
      if (!candidate.data.candidate) {
        await pc.addIceCandidate(null);
      } else {
        await pc.addIceCandidate(candidate.data);
      }
    }
  }

  async function handleStopCall(data) {
    // console.log("call stopped from: "+data.from);

    if (parseInt(data.to) === parseInt(this_user)) {
      hideVideoCallModal();
      stopBothVideoAndAudio();
      pc.close();
      pc = null;
    }
  }

  async function handleEndCall(data) {
    //setting pc = null for receiver. triggered from videocall component
    if (parseInt(data.to) === parseInt(this_user)) {
      pc.close();
      pc = null;
      // console.log("call ended from: "+data.from);
      hideVideoCallModal();
      stopBothVideoAndAudio();
      // console.log(pc);
    }
  }

  async function handleRejectCall(data) {
    if (parseInt(data.to) === parseInt(this_user)) {
      // console.log("call rejected from: "+data.from);
      hideVideoCallModal();
      stopBothVideoAndAudio();
      document.getElementById("call-request-modal").classList.add("invisible");
      clearTimeout(timeout);
    }
  }

  async function handleUnansweredCall(data) {
    // console.log("call unanswered from: "+data.from);
    if (parseInt(data.to) === parseInt(this_user)) {
      stopBothVideoAndAudio();
      document.getElementById("call-request-modal").classList.add("invisible");
      clearTimeout(timeout);
    }
  }

  // stop both mic and camera
  function stopBothVideoAndAudio() {
    localStream.getTracks().forEach((track) => {
      if (track.readyState == "live") {
        track.stop();
      }
    });
  }

  function showVideoCallModal() {
    if (
      document
        .getElementById("video-call-modal")
        .classList.contains("invisible")
    ) {
      document.getElementById("video-call-modal").classList.remove("invisible");
    }
  }

  function hideVideoCallModal() {
    document.getElementById("video-call-modal").classList.add("invisible");
  }

  return (
    <div>
      <div
        id="video-call-modal"
        className={`invisible fixed z-20 top-0 bg-[#000000a7] flex justify-center h-screen w-screen overflow-y-scroll`}
      >
        <div className="relative z-50 w-full max-h-full">
          <div className="relative w-full">
            {/* <!-- Modal content --> */}
            <div className="relative shadow h-screen bg-gray-800">
              {/* <button onClick={closeModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-white hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" style={{"zIndex":"999"}} data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button> */}

              <div className="relative px-2 rounded-md">
                <div className="flex justify-center h-screen">
                  <video
                    muted
                    id="rec_vid"
                    className="object-cover sm:object-contain w-screen"
                    autoPlay
                  ></video>
                  <audio id="rec_audio" autoPlay></audio>
                </div>
                <div className="absolute w-full left-0 bottom-0 flex flex-col items-start sm:flex-row sm:items-end justify-between p-3">
                  <div className="flex flex-col sm:flex-row">
                    <button
                      onClick={endCall}
                      className="m-[2px] rounded-full bg-red-600 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 text-white font-bold text-sm"
                      style={{ rotate: "135deg" }}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </button>
                    <button
                      onClick={stopVideo}
                      className="m-[2px] rounded-full bg-blue-600 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 text-white font-bold text-sm"
                    >
                      {stop_video ? (
                        <FontAwesomeIcon icon={faPlay} />
                      ) : (
                        <FontAwesomeIcon icon={faStop} />
                      )}
                    </button>
                    <button
                      onClick={stopAudio}
                      className="m-[2px] rounded-full bg-blue-600 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 text-white font-bold text-sm"
                    >
                      {stop_audio ? (
                        <FontAwesomeIcon icon={faVolumeOff} />
                      ) : (
                        <FontAwesomeIcon icon={faVolumeUp} />
                      )}
                    </button>
                  </div>
                  <div>
                    <video
                      muted
                      id="sender_vid"
                      className="bg-green-400 rounded-md object-contain w-6/12 sm:w-52 block md:block"
                      autoPlay
                    ></video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="call-request-modal"
        className={`invisible fixed z-20 top-0 px-5 pb-12 bg-[#000000a7] flex items-center justify-center h-screen w-screen overflow-y-scroll sm:px-[15%] md:px-[25%]`}
      >
        <div className="relative z-50 w-auto max-h-full">
          <div className="relative w-auto">
            {/* <!-- Modal content --> */}
            <div className="relative p-5 bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex flex-col justify-center items-center">
                <span className="text-blue-800 dark:text-white text-md">
                  Call from:{" "}
                </span>
                <span id="call_from_span" className="hidden"></span>
                <div
                  id="call_from_image"
                  style={{
                    backgroundImage: `url('/system/storage/user_icons/WSDLYKsfAU8OHqp4tMaJ47eTrLX3GlSIMVnGAhZm.jpg')`,
                  }}
                  className="w-28 h-28 rounded-full bg-no-repeat bg-center bg-cover"
                ></div>
                <span
                  id="call_from_name_span"
                  className="text-blue-800 dark:text-white text-xl"
                ></span>
              </div>
              <div className="p-4 flex justify-center">
                <button
                  id="accept_call_btn"
                  onClick={acceptCall}
                  className="rounded-full bg-green-600 w-12 h-12 text-white font-bold text-lg mx-2"
                >
                  <FontAwesomeIcon icon={faPhone} />
                </button>
                <button
                  id="reject_call_btn"
                  onClick={rejectCall}
                  style={{ rotate: "135deg" }}
                  className="rounded-full bg-red-600 w-12 h-12 text-white font-bold text-lg mx-2"
                >
                  <FontAwesomeIcon icon={faPhone} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
