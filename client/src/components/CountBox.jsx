
import React from 'react'

const CountBox = ({title, value}) => {
  return (
    <div className='flex flex-col items-cemter w-[150px]'>
      <h4>{value}</h4>
      <p>{title}</p> 
    </div>
  )
}

export default CountBox