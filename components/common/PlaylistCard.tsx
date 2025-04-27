import React from 'react'
import Button from "@mui/material/Button";
import Router from 'next/router';
import Edit from "../../assets/icons/edit.svg";
import DataTable from "../../pages/playlist/editor/index"
type PlaylistProps = {
    name : string,
    image : string,
    id : number
}

function openPlayListEditor(name:any){
    if(name){
        //setEditUserData(editUser);
        Router.push({pathname:'/playlist/editor', query: { name: name }})
    }
};

function PlaylistCard({name, image, id} : PlaylistProps) {
    console.log(name)
  return (
    <div className='min-w-[330px] min-h-[200px] max-w-[400px] border border-slate-200 shadow-lg rounded-lg flex-1 basis-1/3 aspect-[16/10] py-4 px-6 flex flex-col font-md '>
        <div className='text-slate-500'>{name}</div>
        <div className="basis-9/12 border my-3 rounded-md overflow-hidden aspect-[16/10]">
             <img src={image} alt={name} className="w-full h-full object-cover" />
         </div>
        <div>
                <Button  onClick={() => openPlayListEditor(name) }>
                    <Edit></Edit>
                </Button>
        </div>
    </div>
  )
}

export default PlaylistCard