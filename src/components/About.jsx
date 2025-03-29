import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from "aws-amplify/auth";
import Logo from "./assets/Transparent1.png";

const About = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                setUser(null);
            }
        };

        checkUser();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-50 text-gray-800 p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
                <header className="w-full flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4 sm:gap-0">
                    {/* Logo */}
                    <a href='/' className="flex-shrink-0">
                        <img src={Logo} alt="AgTrackr Logo" className="h-12 sm:h-16" />
                    </a>

                    {/* About link */}
                    <nav className="text-base text-gray-700">
                        <a href="/about" className='mx-1 hover:underline hover:text-green-900'>About</a>
                        <a href='/contact' className='mx-1 hover:underline hover:text-green-900'>Contact Me</a>
                    </nav>

                    {/* Login/Dashboard Button */}
                    <Button
                        onClick={handleLogin}
                        className="text-base sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-2xl shadow-md"
                    >
                        {user ? "Dashboard" : "Login"}
                    </Button>
                </header>
                <div className="max-w-4xl py-12 mx-auto">
                    <h1 className="text-4xl font-bold mb-6 text-center">About AgTrackr</h1>
                    <p className="text-xl mb-4">
                        AgTrackr was built with farmers in mind — to make tracking farm expenses simple, accurate, and accessible.
                        From fertilizers to vet bills, AgTrackr helps you log and understand where your money goes, giving you better
                        control over your agricultural business.
                    </p>
                    <p className="text-xl mb-4">
                        Built by a hobby farmer and software engineer, AgTrackr was designed to save time, reduce stress, and help you
                        focus on what matters most: growing your farm.
                    </p>
                    <p className="text-xl">
                        Whether you're managing 5 acres or 4,000, AgTrackr is here to make your financial tracking as easy as a walk in
                        the field.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;