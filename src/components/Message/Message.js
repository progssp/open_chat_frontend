import React from 'react';
import moment from 'moment';
import { getCurrentUser } from '../../utilities/ExtraUtility';
import { backend_images_route,info_message } from '../../utilities/ExtraUtility';

export default function Message(props){
    
    let data = props.data;

    return(
        <div key={data.id}>
            {(data.message_type.indexOf(info_message) > -1)?
                (
                    <div key={data.id} className="flex w-auto justify-center">
                        <div className="rounded py-2 px-3" style={{backgroundColor: '#E2F7CB'}}>                            
                            <p className="text-sm mt-1">
                                {data.message}
                            </p>
                        </div>
                    </div>
                )
                :
                (parseInt(data.sender_id) === parseInt(getCurrentUser().id))?
                    (
                        <div className='my-5' key={data.id}>
                            <div key={data.id} style={{transition:'0.5s'}} className="flex justify-end">
                                <div className="rounded-s-3xl rounded-br-3xl p-4 w-auto max-w-[60%] bg-[rgb(2,135,209)]">
                                    <p className="text-sm text-white">
                                        You
                                    </p>
                                    {
                                        (data.file_path !== null)?
                                            JSON.parse(data.file_path).map((item,index)=>
                                            (
                                                <div key={index} className='shadow-md m-1 bg-no-repeat w-52 h-52 bg-cover rounded bg-center md:w-40 md:h-40' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item})`}}></div>
                                            ))
                                            :
                                            null
                                    }
                                    {
                                        (data.message !== null)?
                                            (
                                                <p className="text-sm mt-1 text-white">
                                                    {data.message}
                                                </p>
                                            )
                                        :
                                            null
                                    }
                                </div>
                            </div>
                            <p className="text-right text-xs text-grey-dark">
                                {
                                    (moment().diff(moment(data.created_at),'days')) === 0?
                                        ('Today')
                                    :
                                        (moment().diff(moment(data.created_at),'days')) === 1?
                                            (moment().diff(moment(data.created_at),'days')+' day ago')
                                        :
                                            (moment().diff(moment(data.created_at),'days')+' days ago')
                                }
                            </p>
                            <p className="text-right text-xs text-grey-dark">
                                { moment(data.created_at).format('MMMM DD YYYY, h:mm a') }
                            </p>
                        </div>
                    )
                :
                    (
                        <div className='my-5' key={data.id}>
                            <div key={data.id} style={{transition:'0.5s'}} className="flex justify-start">
                                <div className="rounded-e-3xl rounded-bl-3xl p-4 w-auto max-w-[60%]" style={{backgroundColor: '#F2F2F2'}}>
                                    <p className="text-[13px] text-[#000000] font-bold">
                                        {data.sender_nm}
                                    </p>
                                    {
                                        (data.file_path !== null)?
                                            JSON.parse(data.file_path).map((item,index)=>
                                            (
                                                <div key={index} className='shadow-md m-1 bg-no-repeat w-52 h-52 bg-cover rounded bg-center md:w-40 md:h-40' style={{backgroundSize:'cover',backgroundImage:`url(${backend_images_route}${item})`}}></div>
                                            ))
                                            :
                                            null
                                    }
                                    {
                                        (data.message !== null)?
                                            (
                                                <p className="text-sm mt-1">
                                                    {data.message}
                                                </p>
                                            )
                                        :
                                            null
                                    }
                                </div>
                            </div>
                            <p className="text-left text-xs text-grey-dark mt-1">
                                {
                                    (moment().diff(moment(data.created_at),'days')) === 0?
                                        ('Today')
                                    :
                                        (moment().diff(moment(data.created_at),'days')) === 1?
                                            (moment().diff(moment(data.created_at),'days')+' day ago')
                                        :
                                            (moment().diff(moment(data.created_at),'days')+' days ago')
                                }
                            </p>
                            <p className="text-left text-xs text-grey-dark mt-1">
                                { moment(data.created_at).format('MMMM DD YYYY, h:mm a') }
                            </p>
                        </div>
                    )
            }
        </div>
    );
}