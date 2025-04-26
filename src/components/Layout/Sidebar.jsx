import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { onUpdateUser } from "@/graphql/subscriptions";
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
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
  ChevronDownIcon,
} from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faChartLine } from "@fortawesome/free-solid-svg-icons";
import Icon from "../assets/Favicon.png";
import { getCurrentUser } from "../../utils/getCurrentUser";

const defaultProfileImage = "https://farmexpensetrackerreceipts94813-main.s3.amazonaws.com/profile-pictures/default.jpg";

export default function Sidebar({ onCloseSidebar = () => { } }) {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(defaultProfileImage);
  const [username, setUsername] = useState("User");
  const [userSub, setUserSub] = useState(null);
  const [farmName, setFarmName] = useState("");

  useEffect(() => {
    let subscription;

    const fetchUserProfile = async (user) => {
      try {
        setUsername(user.username || "User");
        setFarmName(user.farmName || "");

        if (user.profilePictureKey) {
          try {
            const { url } = await getUrl({ path: user.profilePictureKey });
            setProfileImageUrl(url.href);
          } catch (err) {
            console.error("Failed to fetch profile image URL:", err);
            setProfileImageUrl(defaultProfileImage);
          }
        } else {
          setProfileImageUrl(defaultProfileImage);
        }
      } catch (err) {
        console.error("Error fetching user profile in sidebar:", err);
      }
    };

    const client = generateClient();

    const init = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        setUserSub(user.sub);
        await fetchUserProfile(user);

        const subscription = client
          .graphql({
            query: onUpdateUser,
          })
          .subscribe({
            next: ({ data }) => {
              const updatedUser = data?.onUpdateUser;
              if (updatedUser?.sub === user.sub) {
                fetchUserProfile(updatedUser);
              }
            },
            error: (err) => console.error("Subscription error:", err),
          });

        // Store `subscription` somewhere so you can unsubscribe on cleanup
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
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const groupedNavItems = [
    {
      label: "Expenses",
      items: [
        {
          label: "Expenses",
          icon: CreditCardIcon,
          route: "/dashboard/expenses",
          color: "text-blue-600",
        },
        {
          label: "Add Expense",
          icon: PlusIcon,
          route: "/dashboard/add-expense",
          color: "text-blue-600",
        },
      ],
    },
    {
      label: "Income",
      items: [
        {
          label: "Income",
          icon: CurrencyDollarIcon,
          route: "/dashboard/income",
          color: "text-green-600",
        },
        {
          label: "Add Income",
          icon: PlusIcon,
          route: "/dashboard/add-income",
          color: "text-green-600",
        },
      ],
    },
    {
      label: "CSV Import",
      items: [
        {
          label: "Import Expenses CSV",
          icon: UploadIcon,
          route: "/dashboard/import-csv",
          color: "text-blue-600",
        },
        {
          label: "Import Income CSV",
          icon: UploadIcon,
          route: "/dashboard/import-income",
          color: "text-green-600",
        },
      ],
    },
    {
      label: "Other",
      items: [
        {
          label: "Reports",
          icon: ChartBarIcon,
          route: "/dashboard/reports",
          color: "text-yellow-600",
        },
        {
          label: "Inventory (New)",
          icon: () => (
            <FontAwesomeIcon
              icon={faBoxesStacked}
              className="w-5 h-5 text-brown-800"
            />
          ),
          route: "/dashboard/inventory",
        },
      ],
    },
  ];

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initialState = {};
    groupedNavItems.forEach(group => {
      initialState[group.label] = true;
    });
    return initialState;
  });

  // Helper for nav clicks
  const handleNavClick = (route) => {
    navigate(route);
    onCloseSidebar(); // call the prop if provided
  };

  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
      <div className="flex-shrink-0">

        {/* Profile display */}
        <div className="p-4 sm:p-2 border-b border-gray-200">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex flex-col items-center w-full focus:outline-none"
          >
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mb-1"
            />
            <p className="text-sm font-medium">Hi, {farmName}</p>
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
          <a href="/" className="flex-shrink-0">
            <img src={Logo} alt="AgTrackr Logo" className="h-10 sm:h-12" />
          </a>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => handleNavClick("/dashboard")}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FontAwesomeIcon
            icon={faChartLine}
            className="w-5 h-5 text-orange-600"
          />
          <span>Dashboard</span>
        </button>
        {groupedNavItems.map((group, groupIdx) => {
          const isExpanded = expandedGroups[group.label];
          const toggleGroup = () => {
            setExpandedGroups(prev => ({
              ...prev,
              [group.label]: !prev[group.label]
            }));
          };


          return (
            <div key={group.label}>
              {/* Group Label */}
              <button
                className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-600 mb-1"
                onClick={toggleGroup}
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
                  {group.items.map(
                    ({ label, icon: Icon, route, color }, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(route)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Icon className={`w-5 h-5 ${color}`} />
                        <span>{label}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
