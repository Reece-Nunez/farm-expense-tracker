import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from "aws-amplify/auth";
import { ArrowDownIcon } from "@heroicons/react/outline";
import Logo from "../assets/Transparent1.png";
import { useLoading } from "../../context/LoadingContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { setIsLoading } = useLoading();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  const handleGoAbout = () => {
    setIsLoading(true);
    navigate("/about");
  };

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
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

        <section className="flex flex-col items-center text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Track Every Penny. Grow Every Acre.
          </h1>
          <p className="text-base sm:text-xl max-w-3xl text-gray-600">
            AgTrackr helps farmers easily track expenses, analyze spending, and grow profits with powerful yet simple tools.
          </p>
        </section>


        <section className="w-full px-4 sm:px-0 max-w-5xl mx-auto space-y-4">
          <div className="flex justify-center items-center gap-2">
            <h2 className="text-base sm:text-lg text-gray-700">
              Instructional Videos coming soon...
            </h2>
            <ArrowDownIcon className="w-5 h-5 text-green-900" />
          </div>

          <iframe
            src="https://arcade.software/embed/your-video-id"
            title="AgTrax Demo"
            className="w-full h-[250px] sm:h-[480px] rounded-xl shadow-lg"
            allowFullScreen
          ></iframe>
        </section>

      </div>

      {/* Chat Placeholder */}
      <div id="chat-widget-placeholder" className="fixed bottom-4 right-4 z-50">
        {/* Insert chat widget script here later */}
      </div>

      <footer className="text-center py-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} AgTrackr. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;