import React, { useEffect, useState } from "react";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { getUser, listUsers } from "@/graphql/queries";
import { updateUser, createUser } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";

const defaultProfileImage =
    "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg";

export default function Profile() {
  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(defaultProfileImage);
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const client = generateClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const foundUser = await getCurrentUser();
        if (!foundUser) return;

        setUserRecord(foundUser);
        setFirstName(foundUser.firstName || "");
        setLastName(foundUser.lastName || "");
        setEmail(foundUser.email || "");
        setPhone(foundUser.phone || "");
        setAboutMe(foundUser.aboutMe || "");
        setJobTitle(foundUser.jobTitle || "");
        setLocation(foundUser.location || "");

        if (foundUser.profilePictureKey) {
          const { url } = await getUrl({ path: foundUser.profilePictureKey });
          setProfileImageUrl(url.href);
        } else {
          setProfileImageUrl(defaultProfileImage);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedKey = userRecord?.profilePictureKey || null;
    if (newProfilePicFile) {
      uploadedKey = await uploadProfilePicture(newProfilePicFile);
    }

    if (!userRecord) {
      await createNewUser(uploadedKey);
    } else {
      await updateUserRecord(uploadedKey);
    }
  };

  const uploadProfilePicture = async (file) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const userSub = user.sub;
      const fileKey = `profile-pictures/${Date.now()}_${userSub}_${file.name}`;
      const operation = uploadData({
        path: fileKey,
        data: file,
        options: { contentType: file.type },
      });
      await operation.result;
      return fileKey;
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      return null;
    }
  };

  const deleteProfilePicture = async () => {
    if (!userRecord?.profilePictureKey) return;

    try {
      await remove({ path: userRecord.profilePictureKey });

      const input = {
        id: userRecord.id,
        profilePictureKey: "",
      };

      const { data } = await client.graphql({
        query: updateUser,
        variables: { input },
      });
      setUserRecord(data.updateUser);
      setProfileImageUrl(defaultProfileImage);
      alert("Profile picture deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Failed to delete profile picture.");
    }
  };

  const createNewUser = async (profilePictureKey) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const checkRes = await client.graphql({
        query: listUsers,
        variables: { filter: { sub: { eq: user.sub } }, limit: 1 },
      });

      const existing = checkRes?.data?.listUsers?.items?.[0];
      if (existing) {
        setUserRecord(existing);
        return;
      }

      const input = {
        sub: user.sub,
        username: user.username, // keep it fixed from auth
        firstName,
        lastName,
        email,
        phone,
        aboutMe,
        jobTitle,
        location,
        profilePictureKey,
      };

      const { data } = await client.graphql({
        query: createUser,
        variables: { input },
      });

      setUserRecord(data.createUser);
      const { url } = await getUrl({ path: profilePictureKey });
      setProfileImageUrl(url.href);
    } catch (error) {
      console.error("Error creating new user record:", error);
    }
  };

  const updateUserRecord = async (profilePictureKey) => {
    try {
      const input = {
        id: userRecord.id,
        firstName,
        lastName,
        email,
        phone,
        aboutMe,
        jobTitle,
        location,
        profilePictureKey: profilePictureKey || userRecord.profilePictureKey,
      };

      const { data } = await client.graphql({
        query: updateUser,
        variables: { input },
      });
      setUserRecord(data.updateUser);

      if (profilePictureKey) {
        const { url } = await getUrl({ path: profilePictureKey });
        setProfileImageUrl(url.href);
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user record:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Personal Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal information and account settings</p>
      </div>

      <div className="relative flex justify-center mb-4 group">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border"
        />
        {userRecord?.profilePictureKey && (
          <button
            onClick={deleteProfilePicture}
            className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete profile picture"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
              />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title / Role</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Farm Manager, Owner, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="City, State or Region"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            About Me
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Description</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us about yourself, your experience, and your role in farming..."
            />
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
            Profile Picture
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload New Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recommended: Square image, at least 200x200px</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
