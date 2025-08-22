'use client'
import React, {useState} from 'react'
import {SignInFlow} from "@/features/auth/types";
import SignInCard from "@/features/auth/components/sign-in-card";
import SignUpCard from "@/features/auth/components/sign-up-card";
import Image from "next/image";
import {useRouter} from "next/navigation";
import Hint from "@/components/hint";

const AuthScreen = () => {

    const [state, setState] = useState<SignInFlow>('signIn')
    const router = useRouter()
    return (
        <>
            <Hint label='Перейти на about страницу' >
                <div className='pb-20 flex cursor-pointer items-start justify-left '>
                    <Image onClick={() => router.push('/about')} src='/logo.png' width={120} height={80}  alt='Logo' />
                </div>
            </Hint>

            <div className='h-full flex items-start justify-center '>

                <div className='md:h-auto md:w-[420px]'>
                    {state === 'signIn' ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>}
                </div>
            </div>
        </>

    )
}
export default AuthScreen
