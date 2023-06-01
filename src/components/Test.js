import React,{useState} from 'react';

export default function Test(){

    let arr = [
        {
            id: 1,
            name: 'name 1'
        },
        {
            id: 2,
            name: 'name 2'
        }
    ];
    const [data,setData] = useState(arr);

    function handleClick(){
        let dt = [...data];
        dt[1].name = 'dummy name';
        setData(dt);
    }

    return(
        <div className='inline-block mt-20 p-5 items-center justify-center'>
            <div>
                <button className='bg-blue-500 p-5 text-white' onClick={handleClick}>Edit State</button>
            </div>
            <br/>
            <div>
                <ul>
                    {data.map((item,i) => (<li>{item.name}</li>))}
                </ul>
            </div>
        </div>
    );
}