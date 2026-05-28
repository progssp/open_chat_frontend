import React,{useEffect, useState} from "react";
import {main_route, main_api_route,getCurrentUser,getCurrentUserToken} from '../../utilities/ExtraUtility';
let this_user = (getCurrentUser()!==null)?getCurrentUser().id:null;
let cur_user = (getCurrentUser()!==null)?getCurrentUser():null;
let cur_user_token = (getCurrentUserToken()!==null)?getCurrentUserToken():null;

export default function CreateGroup(){

    const [group_id,setGroupId] = useState(9);
    const [members,setMembers] = useState([{id: this_user,name: cur_user.user_first_name+""+cur_user.user_last_name}]);
    const [users,setUsers] = useState([]);

    useEffect(()=>{},[]);

    function handleIconChange(evt){
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').src = e.target.result;
        }
        reader.readAsDataURL(evt.target.files[0]);
    }
    

    function closeModal(){
        document.getElementById("create-group-modal1").classList.add("invisible");
        document.getElementById("create-group-modal2").classList.add("invisible");
        document.getElementById('preview').src = `${main_route}/user_images/profile_pictures/profile2.jpg`;
        document.getElementById('icon').value = null;
    }

    function handleNextModal1(evt){
        evt.preventDefault();
        let icon = (evt.target[0].files.length !== 0)?evt.target[0].files[0]:null;
        let name = evt.target[1].value;
        let tagline = evt.target[2].value;
        let description = evt.target[3].value;

        let fd = new FormData();
        if(icon !== null){
            fd.append("icon",icon);
        }
        fd.append("name",name);
        fd.append("tagline",tagline);
        fd.append("description",description);

        
        document.getElementById("modal1_submit").disabled = true;
        document.getElementById("modal1_submit").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;
        
        fetch(`${main_api_route}/user/create-group`,{
            method: 'POST',
            headers: {
                'Authorization': "Bearer "+cur_user_token
            },
            body: fd
        })
        .then(res => res.json())
        .then(result => {
            if(result.status){     
                setGroupId(parseInt(result.data));   
                document.getElementById("create-group-modal1").classList.add("invisible");
                document.getElementById("create-group-modal2").classList.remove("invisible"); 
               
                document.getElementById("modal1_submit").disabled = false;
                document.getElementById("modal1_submit").innerHTML = `Next`;    
            }
            else{
                document.getElementById("modal1_submit").disabled = false;
                document.getElementById("modal1_submit").innerHTML = `Next`;
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById("modal1_submit").disabled = false;
            document.getElementById("modal1_submit").innerHTML = `Next`;
        });
        
    }

    function handlePrevModal2(){
        document.getElementById("create-group-modal1").classList.remove("invisible");
        document.getElementById("create-group-modal2").classList.add("invisible");
    }

    function getUsers(evt){
        let search_string = evt.target.value;
        if(search_string.length === 0){
            setUsers([]);
            return;
        }
        fetch(`${main_api_route}/user/search-users`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Authorization': "Bearer "+cur_user_token
            },
            body: `search_string=${search_string}`
        })
        .then(res => res.json())
        .then(result => {
            if(result.length == 0){
                setUsers([]);
            }
            else if(result.length > 0){
                setUsers([...result]);
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    function addToMemberList(evt){
        let user_id = evt.target.id;
        let user_nm = evt.target.innerHTML;
        let member_found = 0;
        for(var i=0;i<members.length;i++){
            if(members[i].id == user_id){
                member_found = 1;
                break;
            }
        }
        if(member_found == 1){
            console.log('member already exist');
        }
        else{
            let member_obj = {
                id: user_id,
                name: user_nm
            };
            setMembers(prev => [...prev, member_obj]);
        }
    }

    function removeMember(evt){
        console.log(evt.target.tagName);
        if(evt.target.tagName === "svg" || evt.target.tagName === "SVG"){
            let id = (evt.target.parentElement.id);
            for(var i=0;i<members.length;i++){
                if(members[i].id == id){
                    console.log('found at: '+i);
                    members.splice(i,1);
                    break;
                }
            }
            setMembers(members.filter(a => a.id !== members.id));
        }
        else if(evt.target.tagName === "path"||evt.target.tagName === "PATH"){
            let id = (evt.target.parentElement.parentElement.id);
            for(var i=0;i<members.length;i++){
                if(members[i].id == id){
                    console.log('found at: '+i);
                    members.splice(i,1);
                    break;
                }
            }
            setMembers(members.filter(a => a.id !== members.id));
        }
        else if(evt.target.tagName === "button"||evt.target.tagName === "BUTTON"){
            let id = (evt.target.id);
            for(var i=0;i<members.length;i++){
                if(members[i].id == id){
                    console.log('found at: '+i);
                    members.splice(i,1);
                    break;
                }
            }            
            setMembers(members.filter(a => a.id !== members.id));
        }
    }

    function createGroup(evt){
        let mem_id = [];
        members.forEach(element => {
            mem_id.push(element.id);            
        });
        console.log(JSON.stringify(mem_id));

        document.getElementById("modal2_submit").disabled = true;
        document.getElementById("modal2_submit").innerHTML = `<img src='${main_route}/loader.gif' style="width:1.5rem;height:1.5rem;"/>`;

        fetch(`${main_api_route}/user/add-members-in-group`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': "Bearer "+cur_user_token
            },
            body: `group_id=${group_id}&members_id=${JSON.stringify(mem_id)}`
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            document.getElementById("modal2_submit").disabled = false;
            document.getElementById("modal2_submit").innerHTML = `Create group`;
            if(result.status){
                // window.location.reload();
                document.getElementById("create-group-modal1").classList.add("invisible");
                document.getElementById("create-group-modal2").classList.add("invisible");
                document.getElementById('preview').src = `${main_route}/user_images/profile_pictures/profile2.jpg`;
                document.getElementById('icon').value = null;
            }
            else{}
            
        })
        .catch(err => {
            // console.error(err);
            document.getElementById("modal2_submit").disabled = false;
            document.getElementById("modal2_submit").innerHTML = `Create group`;
        });
    }

    return (
        <div>
            <div id="create-group-modal1" className={`invisible overflow-y-scroll fixed z-50 top-0 px-5 bg-[#000000a7] flex items-center justify-start h-screen w-full sm:px-[15%] md:px-[25%]`}>
                <div className="relative z-50 w-full max-h-full">
                    <div className="relative w-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={closeModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Group</h3>
                                <form className="space-y-6" action="#" onSubmit={handleNextModal1}>
                                    <div className="flex justify-center">
                                        <img id="preview" className="rounded-full w-40" src={`${main_route}/user_images/profile_pictures/profile2.jpg`} alt="" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Icon</label>
                                        <input type="file" onChange={handleIconChange} name="icon" id="icon" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                        <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tagline</label>
                                        <input type="text" name="tagline" id="tagline" placeholder="tagline" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                        <input type="text" name="description" id="description" placeholder="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                    </div>
                                    
                                    <button id="modal1_submit" type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Next</button>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <div id="create-group-modal2" className={`invisible overflow-y-scroll z-50 fixed top-0 px-5 bg-[#000000a7] flex items-center justify-start h-screen w-full sm:px-[15%] md:px-[25%]`}>
                <div className="relative z-50 w-full max-h-full">
                    <div className="relative w-full">
                        {/* <!-- Modal content --> */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={closeModal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add members</h3>
                                <form className="space-y-6" action="#">
                                    <input type="hidden" readOnly value={group_id} />
                                    
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search users</label>
                                        <input onChange={getUsers} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name" required />
                                    </div>
                                    
                                    <div className="h-40 max-h-40 overflow-y-scroll bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                        <ul>
                                            {users.map((element) =>
                                                (<li key={element.id} id={element.id} onClick={addToMemberList} className="inline-block rounded shadow-md cursor-pointer m-1 bg-[rgb(1,166,26)] w-auto">
                                                    {element.user_first_name+""+element.user_last_name}      
                                                </li>)                                                
                                            )}
                                        </ul>
                                    </div>


                                    <div className="h-40 max-h-50 overflow-y-scroll bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                        <ul>
                                            {members.map((element) =>
                                                (element.id == this_user)?
                                                (<li key={element.id} className="flex rounded shadow-md cursor-pointer m-1 bg-[rgb(1,166,26)] w-auto">
                                                    <span className="my-1.5 mx-2">{element.name}</span>                                   
                                                </li>):
                                                (<li className="flex rounded shadow-md cursor-pointer m-1 bg-[rgb(1,166,26)] w-auto">
                                                <span className="my-1.5 mx-2">{element.name}</span>
                                                <button onClick={removeMember} id={element.id} type="button" className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-e text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>                                                
                                            </li>)                                
                                            )}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <button onClick={handlePrevModal2} type="button" className="w-auto text-white bg-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Previous</button>
                                        <button id="modal2_submit" onClick={createGroup} type="button" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Group</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}