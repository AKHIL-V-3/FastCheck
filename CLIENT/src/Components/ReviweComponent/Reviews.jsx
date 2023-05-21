import React from 'react'

function Reviews({Review}) {

    const date = new Date(Review.createdAt)
    const formattedDate = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <section>


            <div className='h-full'>
                <div className=' flex space-x-4'>
                    <div className='w-12 h-12 rounded-full bg-white bg-cover' style={{ backgroundImage: `url(${Review?.User?.photoUrl})` }}>
                    </div>
                    <div className='w-10/12'>
                        <h1 className='font-semibold text-xl'>{Review?.User?.UserName}</h1>
                        <p className='opacity-50 max-w-20'>{formattedDate}</p>
                    </div>
                </div>

                <div className='mt-6'>
                    <p>{Review.reviewtext} </p>
                </div>
            </div>



        </section>
    )
}

export default Reviews