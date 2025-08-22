"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

// Основная карта для текста
export const TextRevealCard = ({
                                   text,
                                   revealText,
                                   children,
                                   className,
                                   theme = "dark", // Добавим тему
                               }: {
    text: string;
    revealText: string;
    children?: React.ReactNode;
    className?: string;
    theme?: "dark" | "light" | "gradient";
}) => {
    const [widthPercentage, setWidthPercentage] = useState(0);
    const cardRef = useRef<HTMLDivElement | any>(null);
    const [left, setLeft] = useState(0);
    const [localWidth, setLocalWidth] = useState(0);
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        if (cardRef.current) {
            const { left, width } = cardRef.current.getBoundingClientRect();
            setLeft(left);
            setLocalWidth(width);
        }
    }, []);

    function mouseMoveHandler(event: any) {
        event.preventDefault();
        const { clientX } = event;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    function mouseLeaveHandler() {
        setIsMouseOver(false);
        setWidthPercentage(0);
    }
    function mouseEnterHandler() {
        setIsMouseOver(true);
    }

    function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
        event.preventDefault();
        const clientX = event.touches[0]!.clientX;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    const rotateDeg = (widthPercentage - 50) * 0.1;

    // Подбор цветов по теме
    const themeStyles = {
        dark: "bg-[#1d1c20] border border-white/[0.08]",
        light: "bg-white border border-gray-200",
        gradient:
            "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 border-none",
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
            onMouseMove={mouseMoveHandler}
            onTouchStart={mouseEnterHandler}
            onTouchEnd={mouseLeaveHandler}
            onTouchMove={touchMoveHandler}
            className={cn(
                `w-[40rem] rounded-lg p-8 relative overflow-hidden ${themeStyles[theme]}`,
                className
            )}
        >
            {children}

            {/* Основной текст */}
            <div className="h-40 relative flex items-center overflow-hidden">
                <motion.div
                    style={{ width: "100%" }}
                    animate={
                        isMouseOver
                            ? {
                                opacity: widthPercentage > 0 ? 1 : 0,
                                clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                            }
                            : {
                                clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                            }
                    }
                    transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
                    className="absolute z-20 w-full"
                >
                    <p
                        style={{ textShadow: "3px 3px 12px rgba(0,0,0,0.5)" }}
                        className={twMerge(
                            "text-[2rem] sm:text-[3rem] md:text-[4rem] font-extrabold bg-clip-text text-transparent",
                            theme === "dark" && "bg-gradient-to-b from-white to-neutral-300",
                            theme === "light" && "bg-gradient-to-b from-gray-900 to-gray-700",
                            theme === "gradient" && "bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-600"
                        )}
                    >
                        {revealText}
                    </p>
                </motion.div>

                <motion.div
                    animate={{
                        left: `${widthPercentage}%`,
                        rotate: `${rotateDeg}deg`,
                        opacity: widthPercentage > 0 ? 1 : 0,
                    }}
                    transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
                    className="h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent absolute z-50"
                ></motion.div>

                <div className="overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
                    <p
                        className={twMerge(
                            "text-[2rem] sm:text-[3rem] md:text-[4rem] font-extrabold bg-clip-text text-transparent",
                            theme === "dark" ? "text-[#323238]" : "",
                            theme === "light" ? "text-gray-300" : "",
                            theme === "gradient" ? "text-white" : ""
                        )}
                    >
                        {text}
                    </p>
                    <MemoizedStars />
                </div>
            </div>
        </div>
    );
};

export const TextRevealCardTitle = ({
                                        children,
                                        className,
                                    }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h2 className={twMerge("text-white text-lg mb-2", className)}>{children}</h2>
);

export const TextRevealCardDescription = ({
                                              children,
                                              className,
                                          }: {
    children: React.ReactNode;
    className?: string;
}) => (
    <p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>
);

const Stars = () => {
    const randomMove = () => Math.random() * 4 - 2;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();
    return (
        <div className="absolute inset-0">
            {[...Array(80)].map((_, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${random() * 100}% + ${randomMove()}px)`,
                        left: `calc(${random() * 100}% + ${randomMove()}px)`,
                        opacity: randomOpacity(),
                        scale: [1, 1.2, 0],
                    }}
                    transition={{ duration: random() * 10 + 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute",
                        width: 2,
                        height: 2,
                        backgroundColor: "#FFD700",
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                />
            ))}
        </div>
    );
};

export const MemoizedStars = memo(Stars);
