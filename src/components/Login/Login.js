import React,{useState} from 'react';
// import { useNavigate } from 'react-router-dom';
import { main_route, main_api_route } from '../../utilities/ExtraUtility';
import './Login.css';

export default function Login(){
    // let n = useNavigate();
    const [login_visible,set_login_visible] = useState(true);
    const [register_submit_btn_disabled,set_register_submit_btn_disabled] = useState(true);
    const [username_available,set_username_available] = useState(false);
    
    async function handleSubmit(evt){
        evt.preventDefault();
        
        let username = (evt.target[0].value);
        let password = (evt.target[1].value);
        document.getElementById("login_btn").classList.add('hidden');
        document.getElementById("loader").classList.remove('hidden');
        try{
            var result = await fetch(`${main_api_route}/user/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${username}&password=${password}`
            });
            let json_result = await result.json();
            
            document.getElementById("login_btn").classList.remove('hidden');
            document.getElementById("loader").classList.add('hidden');
            if(json_result.status){
                document.querySelector('#success_alert').innerHTML = json_result.msg;
                document.querySelector('#success_alert').classList.remove('hidden');
                window.localStorage.setItem('cur_user',JSON.stringify(json_result.user));
                // window.localStorage.setItem('cur_user_token',json_result.token);

                // n("/app/chat",{replace:true});

                // let date = new Date(Date.now() + 86400e3);
                // date = date.toUTCString();
                // document.cookie = "access_token="+json_result.token+"; expires="+date+"; samesite=strict;";
                // setTimeout(()=>{
                //     document.querySelector('#success_alert').classList.add('hidden');
                // },4000);
                window.location.href = `${main_route}/chat`; 
                // return navigate(`${main_route}/chat`);
                
            }
            else{
                document.querySelector('#error_alert').innerHTML = json_result.msg;
                document.querySelector('#error_alert').classList.remove('hidden');
                setTimeout(()=>{
                    document.querySelector('#error_alert').classList.add('hidden');
                },3000);
            }    
        }
        catch(err){
            document.getElementById("login_btn").classList.remove('hidden');
            document.getElementById("loader").classList.add('hidden');
            
            document.querySelector('#error_alert').innerHTML = err;
            document.querySelector('#error_alert').classList.remove('hidden');
            setTimeout(()=>{
                document.querySelector('#error_alert').classList.add('hidden');
            },3000);
        }
    }

    async function handleRegister(evt){
        
        evt.preventDefault();
        
        let f_nm = (evt.target[0].value);
        let l_nm = (evt.target[1].value);
        let email = (evt.target[2].value);
        let password = (evt.target[3].value);
        let u_nm = (evt.target[4].value);

        let returned_errors = validateInput(evt);
        if(returned_errors.length > 0){
            showErrors(returned_errors,document.querySelector('#signup_error_alert'));
            return;
        }


        document.getElementById("signup_btn").classList.add('hidden');
        document.getElementById("signup_loader").classList.remove('hidden');

        try{
            var result = await fetch(`${main_api_route}/user/register`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `firstname=${f_nm}&lastname=${l_nm}&email=${email}&password=${password}&username=${u_nm}`
            });
            let json_result = await result.json();
            
            document.getElementById("signup_btn").classList.remove('hidden');
            document.getElementById("signup_loader").classList.add('hidden');
            if(json_result.status){
                document.querySelector('#signup_success_alert').innerHTML = json_result.msg;
                document.querySelector('#signup_success_alert').classList.remove('hidden');
                window.localStorage.setItem('cur_user',JSON.stringify(json_result.user));

                window.location.href = `${main_route}/chat`; 
                
            }
            else{
                showValidationErrors(json_result.errors,document.querySelector('#signup_error_alert'));
            }    
        }
        catch(err){            
            
            document.getElementById("signup_btn").classList.remove('hidden');
            document.getElementById("signup_loader").classList.add('hidden');
            
            document.querySelector('#signup_error_alert').innerHTML = "Request unavailable. Try again later.";
            document.querySelector('#signup_error_alert').classList.remove('hidden');
            setTimeout(()=>{
                document.querySelector('#signup_error_alert').classList.add('hidden');
            },3000);
        }
    }

    function validateInput(evt){
        let error_list = [];

        if(username_available){
            

            let f_nm = (evt.target[0].value);
            let l_nm = (evt.target[1].value);
            let email = (evt.target[2].value);
            let password = (evt.target[3].value);
            let u_nm = (evt.target[4].value);

        

            if(f_nm.trim().length === 0){
                error_list = [...error_list,"Enter first name"];
            }
            if(l_nm.trim().length === 0){
                error_list = [...error_list,"Enter last name"];
            }
            
            if(email.trim().length === 0){
                error_list = [...error_list,"Enter email"];
            }
            else{
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!(emailPattern.test(email))){
                    error_list = [...error_list,"Enter email properly"];
                }
            }        

            if(password.trim().length === 0){
                error_list = [...error_list,"Enter password"];
            }
            if(u_nm.trim().length === 0){
                error_list = [...error_list,"Enter username"];
            }
        }
        else{
            error_list = [...error_list,"First check username availability"];
        }
        return error_list;

        
    }

    function showErrors(error_list, tag_to_display){
        if(error_list.length > 0){
            tag_to_display.innerHTML = "";
            console.log(error_list);
            let list = document.createElement("ul");
            error_list.forEach(error => {
                let list_item = document.createElement("li");
                list_item.innerHTML = error;
                list_item.style.color = 'red';
                list.appendChild(list_item);                
            });  
            tag_to_display.appendChild(list);
            tag_to_display.classList.remove('hidden');  
            setTimeout(()=>{
                tag_to_display.classList.add('hidden');
            },5000);  
            return;      
        }
        else{
            console.log("no errors");
        }
    }

    function showValidationErrors(error_list, tag_to_display){
        
        
        
        if(Object.entries(error_list).length > 0){
            tag_to_display.innerHTML = "";
            let list = document.createElement("ul");
            for(const error in error_list){
                
                error_list[error].forEach(error_data => {
                    let list_item = document.createElement("li");
                    list_item.innerHTML = error_data;
                    list_item.style.color = 'red';
                    list.appendChild(list_item); 
                });                               
            }  
            tag_to_display.appendChild(list);
            tag_to_display.classList.remove('hidden');  
            setTimeout(()=>{
                tag_to_display.classList.add('hidden');
            },5000);  
            return;      
        }
        else{
            console.log("no errors");
        }
    }

    function handleFormChange(evt){
        set_login_visible(!login_visible);
    }

    async function checkUsernameAvailability(evt){
        let username = document.getElementById("username").value;
        if(username.split(" ").join("").length !== 6){
            set_register_submit_btn_disabled(true);
            set_username_available(false);
            document.getElementById("signup_success_alert").classList.add("hidden");
            document.getElementById("signup_error_alert").classList.remove("hidden");
            document.getElementById("signup_error_alert").innerHTML = "username length should be 6 characters";
            setTimeout(()=>{                
                document.getElementById("signup_error_alert").classList.add("hidden");
                document.getElementById("signup_error_alert").innerHTML = "";
            },3000);
            return;
        }
        document.getElementById("username_check_loader").classList.remove("hidden");
        for(let i=0;i<(document.getElementsByTagName("a").length);i++){
            document.getElementsByTagName("a")[i].style.pointerEvents = "none";
        }

        try{
            let response = await fetch(`${main_api_route}/user/check-username-availability`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${username}`
            });
            let result = await response.json();
            // console.log(result);   
            document.getElementById("username_check_loader").classList.add("hidden"); 
            for(let i=0;i<(document.getElementsByTagName("a").length);i++){
                document.getElementsByTagName("a")[i].style.pointerEvents = "all";
            }   
            
            if(result.status){
                set_register_submit_btn_disabled(false);
                set_username_available(true);
                document.getElementById("signup_error_alert").classList.add("hidden");
                document.getElementById("signup_success_alert").classList.remove("hidden");
                document.getElementById("signup_success_alert").innerHTML = result.msg;
                setTimeout(()=>{                
                    document.getElementById("signup_success_alert").classList.add("hidden");
                    document.getElementById("signup_success_alert").innerHTML = "";
                },5000); 
            }
            else{
                set_register_submit_btn_disabled(true);
                set_username_available(false);
                document.getElementById("signup_success_alert").classList.add("hidden");
                document.getElementById("signup_error_alert").classList.remove("hidden");
                document.getElementById("signup_error_alert").innerHTML = (result.msg);
                setTimeout(()=>{                
                    document.getElementById("signup_error_alert").classList.add("hidden");
                    document.getElementById("signup_error_alert").innerHTML = "";
                },5000);
            }
            
        }
        catch(ex){
            // console.error(ex); 
            set_register_submit_btn_disabled(true);
            set_username_available(false);
            document.getElementById("username_check_loader").classList.add("hidden"); 
            document.getElementById("signup_success_alert").classList.add("hidden");
            document.getElementById("signup_error_alert").classList.remove("hidden");
            document.getElementById("signup_error_alert").innerHTML = ex;
            setTimeout(()=>{                
                document.getElementById("signup_error_alert").classList.add("hidden");
                document.getElementById("signup_error_alert").innerHTML = "";
            },5000); 
            for(let i=0;i<(document.getElementsByTagName("a").length);i++){
                document.getElementsByTagName("a")[i].style.pointerEvents = "all";
            }          
        }
    }

    return(
        <div>
            {(login_visible)?
                <div className="flex flex-col items-center overflow-y-scroll justify-center h-screen bg-slate-200 dark:bg-gray-700 px-2">
                    <div className='flex flex-col items-center'>
                        <img src="/app/logo192.png" alt="openchat logo" className='rounded-full w-40'/>
                        <h3 className="my-4 text-xl font-medium text-gray-900 dark:text-white">Open Chat - Sign in</h3>
                    </div>
                    <div className="rounded-md px-6 py-6 lg:px-8 shadow bg-slate-50 dark:bg-gray-500 w-full sm:w-3/4 md:w-[500px]">
                        <form  onSubmit={handleSubmit} className="space-y-6" action="#">                            
                            <div id="success_alert" className="hidden w-auto p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert"></div>
                            <div id="error_alert" className="hidden p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert"></div>
                    
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
                                <input type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="user name" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="tagline" id="tagline" placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                            </div>                            
                            
                            <div className="flex">
                                <button type="submit" id="login_btn" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Sign in
                                </button>
                                <img id="loader" src={`${main_route}/loader.gif`} alt='loader' className='hidden w-10'/>
                
                                <button className='ml-5 w-auto text-blue bg-slate-300 hover:text-white hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={handleFormChange}>Sign up</button>
                            </div>

                        </form>
                    </div>
                </div> 
            :
                <div className="flex flex-col items-center justify-center overflow-y-scroll h-screen bg-slate-200 dark:bg-gray-700 px-2">
                    <div className='flex flex-col items-start'>
                        <img src="/app/logo192.png" alt="openchat logo" className='rounded-full w-40'/>
                        <h3 className="my-4 text-xl font-medium text-gray-900 dark:text-white">Open Chat - Sign up</h3>
                    </div>
                    <div className="rounded-md px-6 py-6 lg:px-8 shadow bg-slate-50 dark:bg-gray-500 w-full sm:w-3/4 md:w-[500px]">
                        
                        <form onSubmit={handleRegister} className="space-y-6" action="#">                            
                            <div id="signup_success_alert" className="hidden w-auto p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert"></div>
                            <div id="signup_error_alert" className="hidden p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert"></div>
                    
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                    <input type="text" name="email" id="f_nm" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="First name" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                    <input type="text" name="email" id="l_nm" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Last name" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Email" />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Password" />
                                </div>
                                <div className='col-span-2'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Username" />
                                    
                                    <button type="button" className='underline w-auto text-white text-center' onClick={checkUsernameAvailability}>Check availability</button>
                                    <img id="username_check_loader" src={`${main_route}/loader.gif`} alt='loader' className='hidden w-5'/>
                                </div>
                            </div>                     
                            
                            <div className="flex">
                                <button type="submit" id="signup_btn" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={register_submit_btn_disabled}>
                                    Sign up
                                </button>
                                <img id="signup_loader" src={`${main_route}/loader.gif`} alt='loader' className='hidden w-10'/>

                                <button className='ml-5 w-auto text-blue bg-slate-300 hover:text-white hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center' onClick={handleFormChange}>Sign in</button>
                            </div>

                        </form>
                    </div>
                </div> 
            }
        </div>
    );

}