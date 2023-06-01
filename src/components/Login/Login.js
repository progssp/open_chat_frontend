import React from 'react';
import { useNavigate } from 'react-router-dom';
import { main_route, main_api_route } from '../../utilities/ExtraUtility';
import './Login.css';

export default function Login(){
    let navigate = useNavigate();
    async function handleSubmit(evt){
        evt.preventDefault();
        
        let username = (evt.target[0].value);
        let password = (evt.target[1].value);
        try{
            var result = await fetch(`${main_api_route}/user/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `username=${username}&password=${password}`
            });
            let json_result = await result.json();
            if(json_result.status){
                document.querySelector('#success_alert').innerHTML = json_result.msg;
                document.querySelector('#success_alert').classList.remove('hidden');
                window.localStorage.setItem('cur_user',JSON.stringify(json_result.user));
                window.localStorage.setItem('cur_user_token',json_result.token);
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
            document.querySelector('#error_alert').innerHTML = err;
            document.querySelector('#error_alert').classList.remove('hidden');
            setTimeout(()=>{
                document.querySelector('#error_alert').classList.add('hidden');
            },3000);
        }
    }
    return(
        <div>
            <div className="relative bg-white shadow dark:bg-gray-700">
                <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Open Chat - Login</h3>
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
                        
                        <div className="flex justify-between">
                            <button type="submit" className="w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                        </div>

                    </form>
                </div>
            </div>            
        </div>
    );
}