import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import { User } from "../../models";
import {
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  TableIcon,
  UploadIcon,
  ChartBarIcon,
  LogoutIcon,
  UserIcon,
  PlusIcon,
} from "@heroicons/react/outline";

export default function Sidebar({ onCloseSidebar = () => {} }) {
  const navigate = useNavigate();

  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
  );
  const [username, setUsername] = useState("User");
  const [userSub, setUserSub] = useState(null);

  useEffect(() => {
    let subscription;

    const fetchUserProfile = async (sub) => {
      try {
        const [foundUser] = await DataStore.query(User, (u) => u.sub.eq(sub));
        if (foundUser) {
          setUsername(foundUser.username || "User");

          if (foundUser.profilePictureKey) {
            const result = await getUrl({ path: foundUser.profilePictureKey });
            setProfileImageUrl(result.url ? result.url.href : result);
          } else {
            setProfileImageUrl(
              "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
            );
          }
        } else {
          // Reset to defaults if not found
          setUsername("User");
          setProfileImageUrl(
            "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
          );
        }
      } catch (err) {
        console.error("Error fetching user profile in sidebar:", err);
      }
    };

    const init = async () => {
      try {
        const session = await fetchAuthSession();
        const sub = session.tokens.idToken.payload.sub;
        setUserSub(sub);
        await fetchUserProfile(sub);

        // Subscribe to DataStore changes
        subscription = DataStore.observe(User).subscribe((msg) => {
          if (
            (msg.opType === "UPDATE" || msg.opType === "INSERT") &&
            msg.element.sub === sub
          ) {
            fetchUserProfile(sub);
          }
        });
      } catch (err) {
        console.error("Error in sidebar init:", err);
      }
    };

    init();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Our nav items
  const navItems = [
    { label: "Dashboard", icon: HomeIcon, route: "/dashboard" },
    { label: "Expenses", icon: CreditCardIcon, route: "/expenses" },
    { label: "Income", icon: CurrencyDollarIcon, route: "/income" },
    { label: "Import Expenses CSV", icon: UploadIcon, route: "/import-csv" },
    { label: "Import Income CSV", icon: UploadIcon, route: "/import-income" },
    { label: "Profile", icon: UserIcon, route: "/profile" },
  ];

  // Helper for nav clicks
  const handleNavClick = (route) => {
    navigate(route);
    onCloseSidebar(); // call the prop if provided
  };

  return (
    <div className="flex flex-col h-full">
      {/* Profile display */}
      <div className="p-4 border-b border-gray-200 flex flex-col items-center">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover mb-2"
        />
        <p className="text-sm">Hi, {username}</p>
      </div>

      {/* App Name */}
      <div className="p-4 border-b border-gray-200 text-xl font-bold">
        Harvest-Hub
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ label, icon: Icon, route }, idx) => (
          <button
            key={idx}
            onClick={() => handleNavClick(route)}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Add Expense / Add Income Buttons */}
      <div className="p-4 border-b border-gray-200 flex gap-2 justify-around">
        <button
          onClick={() => handleNavClick("/add-expense")}
          className="flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
        >
          <PlusIcon className="w-5 h-5 text-green-600" />
          <span>Add Expense</span>
        </button>
        <button
          onClick={() => handleNavClick("/add-income")}
          className="flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
        >
          <PlusIcon className="w-5 h-5 text-blue-600" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200 mb-20">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
