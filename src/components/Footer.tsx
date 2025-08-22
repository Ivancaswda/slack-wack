import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r bg-[#0E0E10] border-t border-gray-700 pt-6 text-white py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                {/* Логотип и описание */}
                <div className="flex flex-col gap-4 relative">
                     <Image src='/logo.png' width={110} height={50} alt='logo' />
                    <p className="max-w-xs text-sm text-white/80 ">
                        Wack — централизованная платформа для командной работы, обмена файлами и управления проектами.
                    </p>
                </div>

                {/* Навигация */}
                <div className="flex flex-col sm:flex-row gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Продукт</h3>
                        <a href="#" className="text-white/80 hover:text-white transition">Features</a>
                        <a href="#" className="text-white/80 hover:text-white transition">Pricing</a>
                        <a href="#" className="text-white/80 hover:text-white transition">Integrations</a>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Компания</h3>
                        <a href="#" className="text-white/80 hover:text-white transition">About Us</a>
                        <a href="#" className="text-white/80 hover:text-white transition">Careers</a>
                        <a href="#" className="text-white/80 hover:text-white transition">Blog</a>
                    </div>
                </div>

                {/* Социальные сети */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" aria-label="Twitter" className="hover:text-white transition">
                        <Twitter size={20} />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" aria-label="GitHub" className="hover:text-white transition">
                        <Github size={20} />
                    </a>
                </div>
            </div>

            <div className="mt-10 text-center text-white/50 text-sm">
                &copy; {new Date().getFullYear()} Wack. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;
