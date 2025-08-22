import React, {useState} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {TriangleAlert} from "lucide-react";
import {useAuthActions} from "@convex-dev/auth/react";

const SignUpCard = ({setState}: any) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const {signIn} = useAuthActions()

    const handleProviderSignup = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value).finally(() => {
            setPending(false)
        })
    }
    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Пароли не совпадают')
            return
        }
        setPending(true)
        signIn('password', {name, email, password, flow: 'signUp'}).catch(() => {
            setError('Что-то пошло не так!')
        }).finally(() => {
            setPending(false)
        })
    }

    return ( <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Зарегистрироваться чтобы продолжить
                </CardTitle>
                <CardDescription>
                   Начните пользоваться wack бесплатно и прямо сейчас!
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-4'>
                    <TriangleAlert/>
                    {error}
                </div>
            )}
        <CardContent>
            <form onSubmit={onPasswordSignUp} className='space-y-2.5'>
                <Input placeholder='Имя пользователя' value={name} onChange={(e) => setName(e.target.value)} disabled={false} type='name' required/>
                <Input placeholder='Электронная почта' value={email} onChange={(e) => setEmail(e.target.value)} disabled={false} type='email' required/>
                <Input placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} disabled={false} type='password' required/>
                <Input placeholder='Подтвердить пароль' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={false} type='confirmPassword' required/>
                <Button type='submit' size='lg' className='w-full'>
                   Продолжить
                </Button>
            </form>
            <Separator/>
            <div className='flex flex-col gap-y-2.5 mt-2'>
                <Button disabled={pending} onClick={() =>  handleProviderSignup('google')} variant='outline' className='w-full relative' >
                    <FcGoogle className='size-5 absolute top-2 left-2.5'/>
                    Продолжить через Google
                </Button>
                <Button disabled={pending} onClick={() =>  handleProviderSignup('github')} variant='outline' className='w-full relative' >
                    <FaGithub className='size-5 absolute top-2 left-2.5'/>
                    Продолжить через Github
                </Button>
            </div>
            <p className='text-xs text-muted-foreground'>
                Есть аккаунт <span className='text-green-500' onClick={() => setState('signIn')}>Войти</span>
            </p>

        </CardContent>
    </Card>
    )
}
export default SignUpCard
