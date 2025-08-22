import React from 'react'
import {BackgroundBeamsWithCollision} from "@/components/ui/background-beams-with-collision";
import {StarIcon} from "lucide-react";
import {TracingBeam} from "@/components/ui/tracing-beam";
import {twMerge} from "tailwind-merge";
import { calsans } from "@/app/layout";
import {dummyContent, tabs, testimonials} from "@/constants";
import {IMAGES_MANIFEST} from "next/constants";
import Image from "next/image";
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import {Tabs} from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import {TextRevealCard, TextRevealCardDescription, TextRevealCardTitle} from "@/components/ui/text-reveal-card";
import {FaGithub, FaGoogle, FaVk, FaYahoo, FaYandex} from "react-icons/fa";
import Hint from "@/components/hint";
import {Button} from "@/components/ui/button";
import Link from "next/link";


const AboutPage = () => {
    return (
        <div className='min-h-screen w-full '>

            <BackgroundBeamsWithCollision>
                <div className='flex flex-col gap-2 items-center '>
                    <div>
                        <Image width={180} height={80} src='/logo.png' alt='logo' />
                    </div>
                    <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
                        Самое лучшее приложение
                        <hr/>
                        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                <span className="">Подойдет каждому.</span>
                            </div>
                            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-green-500 via-red-500 to-orange-500 py-4">
                                <span className="">Подойдет каждому.</span>
                            </div>
                        </div>
                    </h2>
                </div>

            </BackgroundBeamsWithCollision>
            <div className='flex items-center justify-center mt-10'>
                <Button className='bg-no-repeat px-8 py-6 text-xl bg-gradient-to-r hover:from-green-500 hover:to-orange-500 hover:via-red-500  bg-gradient-to-r from-green-500 via-red-500 to-orange-500 '>
                    <Link href='/auth' >
                        Попробовать бесплатно
                    </Link>
                </Button>
            </div>


            <div className='flex items-center justify-center text-2xl my-10 gap-4 w-full text-center text-gradient-to-r from-purple-500 via-violet-500 to-pink-500 '><StarIcon/> Наш путь к процветанию <StarIcon/></div>
            <TracingBeam className="px-6">
                <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                    {dummyContent.map((item, index) => (
                        <div key={`content-${index}`} className="mb-10">
                            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
                                {item.badge}
                            </h2>

                            <p className={twMerge(calsans.className, "text-xl mb-4")}>
                                {item.title}
                            </p>

                            <div className="text-sm  prose prose-sm dark:prose-invert">
                                {item?.image && (
                                    <img
                                        src={item.image}
                                        alt="blog thumbnail"
                                        height="1000"
                                        width="1000"
                                        className="rounded-lg mb-10 object-cover"
                                    />
                                )}
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </TracingBeam>

            <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>

            <div className="h-[20rem] md:h-[40rem] [perspective:1400px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
                <Tabs tabs={tabs} />
            </div>

            <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem]  w-full">
                <TextRevealCard
                    text="Wack - просто"
                                        revealText="Wack - сложно"
                >
                    <TextRevealCardTitle>
                        Вместе с wack вы можете двигать горы
                    </TextRevealCardTitle>
                    <TextRevealCardDescription>
                       Ну а если серьёзно то очень крутое приложение советуйте друзьям
                    </TextRevealCardDescription>
                </TextRevealCard>
            </div>
            <div className='flex items-center justify-center bg-[#0E0E10] gap-8 pt-20'>
                <Hint label='Google'>
                    <FaGoogle className='text-white size-20 cursor-pointer hover:bg-black/90 p-4 rounded-2xl transition-all hover:scale-105 ' />
                </Hint>
                <Hint label='Github'>
                    <FaGithub className='text-white size-20 cursor-pointer hover:bg-black/90 p-4 rounded-2xl transition-all hover:scale-105 ' />
                </Hint>
                <Hint label='Vkontakte'>
                    <FaVk className='text-white size-20 cursor-pointer hover:bg-black/90 p-4 rounded-2xl transition-all hover:scale-105 ' />
                </Hint>
                <Hint label='Yandex'>
                    <FaYandex className='text-white size-20 cursor-pointer hover:bg-black/90 p-4 rounded-2xl transition-all hover:scale-105 ' />
                </Hint>
                <Hint label='Yahoo!'>
                    <FaYahoo className='text-white size-20 cursor-pointer hover:bg-black/90 p-4 rounded-2xl transition-all hover:scale-105 ' />
                </Hint>

            </div>

            <div>
                <Footer/>
            </div>
        </div>
    )
}
export default AboutPage
