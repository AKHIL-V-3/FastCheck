import React from 'react'

function Pagination({totalPosts,postPerPage,setCurrentPage,currentPage}) {
    let pages =[]
    for(let i =1; i<=Math.ceil(totalPosts/postPerPage);i++){
         pages.push(i)
    }
  return (
    <div className='flex space-x-2 justify-end'>
        {
            pages.map((page,index)=>{
                return <button key={index} onClick={()=> setCurrentPage(page)} className='w-10 h-10 border-gray-800 border-2' >{page}</button>
            })
        }
    </div>
  )
}

export default Pagination