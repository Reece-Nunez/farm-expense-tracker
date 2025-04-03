import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import { User } from "../../models";
import Logo from "../assets/Transparent1.png";
import {
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  UploadIcon,
  ChartBarIcon,
  LogoutIcon,
  UserIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faChartLine } from "@fortawesome/free-solid-svg-icons";
import Icon from "../assets/Favicon.png";


export default function Sidebar({ onCloseSidebar = () => { } }) {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
      navigate('/')
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const groupedNavItems = [
    {
      label: "Expenses",
      items: [
        { label: "Expenses", icon: CreditCardIcon, route: "/dashboard/expenses", color: "text-blue-600" },
        { label: "Add Expense", icon: PlusIcon, route: "/dashboard/add-expense", color: "text-blue-600" },
      ],
    },
    {
      label: "Income",
      items: [
        { label: "Income", icon: CurrencyDollarIcon, route: "/dashboard/income", color: "text-green-600" },
        { label: "Add Income", icon: PlusIcon, route: "/dashboard/add-income", color: "text-green-600" },
      ],
    },
    {
      label: "CSV Import",
      items: [
        { label: "Import Expenses CSV", icon: UploadIcon, route: "/dashboard/import-csv", color: "text-blue-600" },
        { label: "Import Income CSV", icon: UploadIcon, route: "/dashboard/import-income", color: "text-green-600" },
      ],
    },
    {
      label: "Other",
      items: [
        { label: "Reports", icon: ChartBarIcon, route: "/dashboard/reports", color: "text-yellow-600" },
        {
          label: "Inventory (New)",
          icon: () => <FontAwesomeIcon icon={faBoxesStacked} className="w-5 h-5 text-brown-800" />,
          route: "/dashboard/inventory",
        },
        {
          label: "Homepage",
          icon: () => (
            <img
              src={Icon}
              alt="Logo"
              className="w-5 h-5 object-contain"
            />
          ),
          route: "/",
        },
        //{ label: "Debug", icon: PlusIcon, route: "/util/debug", color: "text-red-300"},
      ],
    }
  ];


  // Helper for nav clicks
  const handleNavClick = (route) => {
    navigate(route);
    onCloseSidebar(); // call the prop if provided
  };

  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto">
      {/* Profile display */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="flex flex-col items-center w-full focus:outline-none"
        >
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-1"
          />
          <p className="text-sm">Hi, {username}</p>
          <ChevronDownIcon
            className={`w-4 h-4 mt-1 text-gray-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {profileMenuOpen && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => handleNavClick("/dashboard/profile")}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <UserIcon className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}

      </div>


      {/* App Name */}
      <div className="p-4 border-b border-gray-200 text-xl font-bold">
        <a href='/' className="flex-shrink-0">
          <img src={Logo} alt="AgTrackr Logo" className="h-10 sm:h-12" />
        </a>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => handleNavClick("/dashboard")}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-orange-600" />
          <span>Dashboard</span>
        </button>
        {groupedNavItems.map((group, groupIdx) => {
          const [expanded, setExpanded] = useState(true); // expand by default, or toggle for collapsed
          const isExpanded = expanded; // You could persist state per-group with a more complex setup

          return (
            <div key={group.label}>
              {/* Group Label */}
              <button
                className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-600 mb-1"
                onClick={() => setExpanded(!expanded)}
              >
                <span>{group.label}</span>
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {/* Group Items */}
              {isExpanded && (
                <div className="space-y-1 ml-2">
                  {group.items.map(({ label, icon: Icon, route, color }, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavClick(route)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
