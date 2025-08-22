import React, {useState} from 'react'
import {Card, CardDescription, CardHeader,CardContent,CardTitle,CardAction,CardFooter} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import {useAuthActions} from "@convex-dev/auth/react";
import {TriangleAlert} from "lucide-react";

const SignInCard = ({setState}: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {signIn} = useAuthActions()
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)
    const handleProviderSignin = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value).finally(() => {
            setPending(false)
        })
    }
    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setPending(true)
        signIn('password', {email, password, flow: 'signIn'}).catch(() => {
            setError('Invalid email or password')
        }).finally(() => {
            setPending(false)
        })
    }

    return (
        <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                  Войти в аккаунт
                </CardTitle>
                <CardDescription>
                     Войдите в ваш аккаунт и продолжайте пользоваться нашей уникальной wack платформой
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-4'>
                    <TriangleAlert/>
                    {error}
                </div>
            )}
            <CardContent>
                <form onSubmit={onPasswordSignIn} className='space-y-2.5'>
                    <Input placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={false} type='email' required/>
                    <Input placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={false} type='email' required/>
                    <Button type='submit' disabled={pending} size='lg' className='w-full'>
                        Продолжить
                    </Button>
                </form>
                <Separator/>
                <div className='flex flex-col gap-y-3 mt-3'>
                    <Button disabled={pending} onClick={() =>  handleProviderSignin('google')} variant='outline' className='w-full relative' >
                            <FcGoogle className='size-5 absolute top-2 left-2.5'/>
                            Продолжить через Google
                    </Button>
                    <Button disabled={pending} onClick={() =>  handleProviderSignin('github')} variant='outline' className='w-full relative' >
                        <FaGithub className='size-5 absolute top-2 left-2.5'/>
                       Продолжить через Github
                    </Button>
                </div>
                <p className='text-xs text-muted-foreground mt-3'>
                    Нету аккаунта <span className='text-green-500' onClick={() => setState('signUp')}>зарегистрироваться</span>
                </p>

            </CardContent>
        </Card>
    )
}
export default SignInCard
