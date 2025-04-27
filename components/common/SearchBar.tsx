import React from 'react'
import Button from './Button'
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch }:any) {
  let searchName="";
  const handleChange=(event:any)=>{
    searchName=event.target.value;
  }
  return (
    <div className='flex justify-between w-2/5 border rounded mr-8 items-center'>
      <input onChange={handleChange} className='w-full mx-2 focus:outline-none' placeholder="*ID, *Connector Name*, account*" />
      <Button>
        <SearchIcon onClick = {() => onSearch(searchName)} />
      </Button>
    </div>
  )
}

export default SearchBar