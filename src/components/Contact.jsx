import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from "aws-amplify/auth";
import Logo from "../components/assets/Transparent1.png";

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

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
      
        try {
          const response = await fetch(
            "https://lj1sxlo8yg.execute-api.us-east-1.amazonaws.com/main/sendEmail",
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
      
          if (!response.ok) {
            const error = await response.text();
            console.error("Error sending message:", error);
            alert("Something went wrong.");
          } else {
            console.log("Success!");
            alert("Message sent!");
          }
        } catch (err) {
          console.error("Network error:", err);
          alert("Network error");
        }
      };
      

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
                    <h1 className="text-4xl font-bold mb-6 text-center">Contact Me</h1>

                    <p className="text-xl mb-6 text-center">
                        Have questions, feedback, or want to collaborate? I’d love to hear from you.
                        Whether you're a farmer with ideas to improve AgTrackr or a small business owner looking for custom software solutions — let’s connect.
                    </p>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <form
                            action="https://formsubmit.co/your@email.com" // Replace with your actual form handler
                            method="POST"
                            className="space-y-6"
                        >
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="5"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg shadow-md transition"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-10 text-center text-gray-600">
                        <p>Or email me directly at:</p>
                        <a
                            href="mailto:reece@agtrackr.com"
                            className="text-green-700 font-medium hover:underline"
                        >
                            reece@nunezdev.com
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;