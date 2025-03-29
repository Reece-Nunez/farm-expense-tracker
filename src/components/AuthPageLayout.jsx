import React from "react";
import Logo from "./assets/Transparent1.png";

const AuthPageLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-gray-50 text-gray-800">
            <header className="w-full flex items-center justify-between px-6 py-4 shadow-sm bg-white">
                <a href="/" className="flex items-center gap-2">
                    <img src={Logo} alt="AgTrackr Logo" className="h-12" />
                </a>
                <nav>
                    <a href="/about" className="text-sm text-gray-700 hover:underline">About</a>
                    <a href='/contact' className="text-sm text-gray-700 hover:underline">Contact Me</a>
                </nav>
            </header>

            <main className="flex justify-center items-start py-12 px-4">
                {children}
            </main>
        </div>
    );
};

export default AuthPageLayout;
