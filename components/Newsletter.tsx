import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <div className='flex flex-col items-center mx-4 my-32 md:my-40'>
            <Title title="Rejoignez notre Newsletter" description="Abonnez-vous pour recevoir nos offres exclusives, nos nouveautés et nos actualités directement dans votre boîte mail." visibleButton={false} />
            <div className='flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200 focus-within:ring-blue-400 transition'>
                <input className='flex-1 pl-5 outline-none' type="text" placeholder='Entrez votre adresse e-mail' />
                <button className='font-medium bg-blue-600 text-white px-7 py-3 rounded-full hover:bg-blue-700 hover:scale-103 transition shadow-sm'>S'abonner</button>
            </div>
        </div>
    )
}

export default Newsletter
