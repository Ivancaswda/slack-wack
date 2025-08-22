import React from 'react'
import {format} from 'date-fns'
import moment from "moment";
import {ru} from "date-fns/locale";


interface ChannelHeroProps {
    name: string;
    creationTime: number
}

const ChannelHero = ({name, creationTime}: ChannelHeroProps) => {


    return (
        <div className='mt-[88px] mx-5 mb-4'>
            <p className='text-2xl font-bold flex items-center mb-2'>
                # {name}
            </p>
            <p className='font-medium text-slate-800 mb-4'>
                Этот канал создан {format(creationTime, 'MMMM do, yyyy', {locale: ru} )}, Это только начало <strong>{name}</strong>
            </p>
        </div>
    )
}
export default ChannelHero
