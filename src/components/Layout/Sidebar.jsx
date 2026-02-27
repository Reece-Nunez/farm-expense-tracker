import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
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
  DocumentTextIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faChartLine } from "@fortawesome/free-solid-svg-icons";
import Icon from "../assets/Favicon.png";
import { getCurrentUser } from "../../utils/getCurrentUser";
import ThemeToggle from "../ui/ThemeToggle";
import FarmSelector from "../team/FarmSelector";
import { useFarm } from "../../context/FarmContext";

const defaultProfileImage =
  "https://farmexpensetrackerreceipts94813-main.s3.amazonaws.com/profile-pictures/default.jpg";

export default function Sidebar({ onCloseSidebar = () => {} }) {
  const navigate = useNavigate();
  const { currentFarm } = useFarm();
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
        {
          label: "Scan Receipt",
          icon: () => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          route: "/dashboard/scan-receipt",
          color: "text-purple-600",
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
      label: "Invoices & Customers",
      items: [
        {
          label: "Invoices",
          icon: DocumentTextIcon,
          route: "/dashboard/invoices",
          color: "text-purple-600",
        },
        {
          label: "Customers",
          icon: () => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          ),
          route: "/dashboard/customers",
          color: "text-blue-600",
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
      label: "Team & Farms",
      items: [
        {
          label: "Team Management",
          icon: UsersIcon,
          route: "/dashboard/team",
          color: "text-indigo-600",
        },
        {
          label: "Farm Settings",
          icon: () => (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ),
          route: "/dashboard/farm-settings",
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
          label: "Farm Inventory",
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
    groupedNavItems.forEach((group) => {
      initialState[group.label] = false;
    });
    return initialState;
  });

  const handleNavClick = (route) => {
    navigate(route);
    onCloseSidebar();
  };

  return (
    <div className="flex flex-col min-h-screen max-h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <div className="p-4 sm:p-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex flex-col items-center w-full focus:outline-none"
          >
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mb-1"
            />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Hi, {farmName}</p>
            <ChevronDownIcon
              className={`w-4 h-4 mt-1 text-gray-500 dark:text-gray-400 transition-transform ${
                profileMenuOpen ? "rotate-180" : ""
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

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => handleNavClick("/dashboard")} className="flex justify-center items-center w-full">
            <img src={Logo} alt="AgTrackr Logo" className="h-12 sm:h-14" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <FarmSelector showCreateOption={true} />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => handleNavClick("/dashboard")}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            setExpandedGroups((prev) => ({
              ...prev,
              [group.label]: !prev[group.label],
            }));
          };

          return (
            <div key={group.label}>
              <button
                className="flex justify-between items-center w-full text-left text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1"
                onClick={toggleGroup}
              >
                <span>{group.label}</span>
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-1 ml-2">
                  {group.items.map(
                    ({ label, icon: Icon, route, color }, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(route)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle variant="toggle" size="sm" showLabel={false} />
      </div>
    </div>
  );
}
