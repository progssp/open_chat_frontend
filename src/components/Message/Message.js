import React from 'react';
import { getCurrentUser } from '../../utilities/ExtraUtility';

export default function Message(props){
    let data = props.data;
    return(
        <div key={data.id}>
            {(data.sender_id === getCurrentUser().id)?
                (
                    <div key={data.id} className="flex justify-end mb-2">
                        <div className="rounded py-2 px-3" style={{backgroundColor: '#E2F7CB'}}>
                            <p className="text-sm text-teal">
                                You
                            </p>
                            <p className="text-sm mt-1">
                                {data.message}
                            </p>
                            <p className="text-right text-xs text-grey-dark mt-1">
                                {data.created_at}
                            </p>
                        </div>
                    </div>
                )
                :
                (
                    <div key={data.id} className="flex mb-2">
                        <div className="rounded py-2 px-3" style={{backgroundColor: '#F2F2F2'}}>
                            <p className="text-sm text-teal">
                                {data.sender_nm}
                            </p>
                            <p className="text-sm mt-1">
                                {data.message}
                            </p>
                            <p className="text-right text-xs text-grey-dark mt-1">
                                {data.created_at}
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}