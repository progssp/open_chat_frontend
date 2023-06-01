import React from "react";
import {main_route, main_api_route,getCurrentUser,getCurrentUserToken, setCurrentUser} from '../../utilities/ExtraUtility';
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

export default function EditProfile(){


    function handleIconChange(evt){
        console.log(evt.target.files.length);
        console.log(evt.target.files[0]);
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('edit_profile_preview').src = e.target.result;
        }
        reader.readAsDataURL(evt.target.files[0]);
    }
    

    function closeModal(){
        document.getElementById("edit-profile-modal").classList.add("invisible");
        document.getElementById('preview').src = `${main_route}/user_images/profile_pictures/profile2.jpg`;
        document.getElementById('icon').value = null;
    }

    function handleSubmit(evt){
        evt.preventDefault();
        let edit_profile_icon = evt.target[0].files[0];
        let edit_profile_name = evt.target[1].value;
        let edit_profile_email = evt.target[2].value;

        let fd = new FormData();
        fd.append("edit_profile_icon",edit_profile_icon);
        fd.append("edit_profile_name",edit_profile_name);
        fd.append("edit_profile_email",edit_profile_email);
        
        fetch(`${main_api_route}/user/edit-profile`,{
            method: 'POST',
            headers: {
                'Authorization': "Bearer "+cur_user_token
            },
            body: fd
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if(result.status){
                let user_obj = getCurrentUser();
                user_obj = result.user;
                setCurrentUser(user_obj);
                window.location.reload();
            }
            else{
            }
        })
        .catch(err => {
            console.error(err);
        });
        
    }

    return (
        <div>
            <div id="edit-profile-modal" className={`invisible fixed top-0 px-5 pb-12 bg-[#000000a7] flex items-center justify-center h-screen w-screen overflow-y-scroll sm:px-[15%] md:px-[25%]`}>
                <div className="relative z-50 w-full max-h-full">
                    <div className="relative w-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={closeModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Profile</h3>
                                <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                                    <div className="flex justify-center">
                                        <img id="edit_profile_preview" className="rounded-full w-40" src={`${main_route}/user_images/profile_pictures/profile2.jpg`} alt="" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Icon</label>
                                        <input type="file" onChange={handleIconChange} name="edit_profile_icon" id="edit_profile_icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                        <input type="text" name="edit_profile_name" id="edit_profile_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                        <input type="email" name="edit_profile_email" id="edit_profile_email" placeholder="email@email.com" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    </div>
                                    
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}