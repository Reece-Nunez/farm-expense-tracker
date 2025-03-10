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
} from "@heroicons/react/outline";

export default function Sidebar() {
  const navigate = useNavigate();

  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
  );
  const [username, setUsername] = useState("User");
  const [userSub, setUserSub] = useState(null);

  useEffect(() => {
    let subscription; // We'll store our DataStore subscription here

    // Helper function to fetch the user's record from DataStore
    const fetchUserProfile = async (sub) => {
      try {
        const [foundUser] = await DataStore.query(User, (u) => u.sub.eq(sub));
        if (foundUser) {
          setUsername(foundUser.username || "User");

          if (foundUser.profilePictureKey) {
            // Retrieve the profile image URL from S3
            const result = await getUrl({ path: foundUser.profilePictureKey });
            // Depending on your setup, `result` may be a string or an object with `url`
            setProfileImageUrl(result.url ? result.url.href : result);
          } else {
            // If no profilePictureKey, use a default
            setProfileImageUrl(
              "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
            );
          }
        } else {
          // If no user is found, reset to defaults
          setUsername("User");
          setProfileImageUrl(
            "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg"
          );
        }
      } catch (err) {
        console.error("Error fetching user profile in sidebar:", err);
      }
    };

    // Initialize: fetch user info and subscribe to changes
    const init = async () => {
      try {
        // 1) Get current user's sub
        const session = await fetchAuthSession();
        const sub = session.tokens.idToken.payload.sub;
        setUserSub(sub);

        // 2) Fetch their profile once on mount
        await fetchUserProfile(sub);

        // 3) Observe any changes to the User model
        subscription = DataStore.observe(User).subscribe((msg) => {
          // If there's an update or insert for THIS user's record, re-fetch
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

    // Cleanup subscription on unmount
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

  const navItems = [
    { label: "Dashboard", icon: HomeIcon, route: "/dashboard" },
    { label: "Expenses", icon: CreditCardIcon, route: "/expenses" },
    { label: "Income", icon: CurrencyDollarIcon, route: "/income" },
    { label: "Analytics", icon: ChartBarIcon, route: "/analytics" },
    { label: "Import Expenses CSV", icon: UploadIcon, route: "/import-csv" },
    { label: "Import Income CSV", icon: UploadIcon, route: "/import-income" },
    { label: "Expense Table", icon: TableIcon, route: "/expenses" },
    { label: "Profile", icon: UserIcon, route: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Profile display at the top */}
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

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ label, icon: Icon, route }, idx) => (
          <button
            key={idx}
            onClick={() => navigate(route)}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Sign Out Button */}
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
