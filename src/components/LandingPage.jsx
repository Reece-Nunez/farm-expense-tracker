import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from "aws-amplify/auth";
import { ArrowDownIcon } from "@heroicons/react/outline";

const LandingPage = () => {
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

        <header className="w-full flex items-center justify-between px-6 py-4">
          <div className="flex justify-between flex-1">
            <a href='/'>
              <img src="/src/assets/Transparent1.png" alt="AgTrackr Logo" className="h-16" />
            </a>
            <nav className="flex items-center">
              <div>
                <div>
                  <a href='/about'>About</a>
                </div>
              </div>
            </nav>
            <Button onClick={handleLogin} className="text-lg px-3 rounded-2xl shadow-md">
              {user ? "Dashboard" : "Login"}
            </Button>
          </div>
        </header>


        <section className='flex flex-col items-center text-center'>
          <h1 className="text-5xl font-extrabold mb-4">Track Every Penny. Grow Every Acre.</h1>
          <p className="text-xl max-w-3xl text-gray-600">
            AgTrax helps farmers easily track expenses, analyze spending, and grow profits with powerful yet simple tools.
          </p>
        </section>

        <section className="w-full max-w-5xl mx-auto">
          <div className='flex justify-center' >
            <h1>Instructional Videos coming soon...</h1>
            <ArrowDownIcon className="w-5 h-5 text-green-900" />
          </div>
          <iframe
            src="https://arcade.software/embed/your-video-id"
            title="AgTrax Demo"
            className="w-full h-[480px] rounded-xl shadow-lg"
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