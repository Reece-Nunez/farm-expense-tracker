import React, { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { Storage } from "aws-amplify";
import { User } from "../models";

export default function Profile() {
  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [username, setUsername] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  // Profile picture
  const defaultProfileImage = "https://via.placeholder.com/150?text=No+Profile+Picture";
  const [profileImageUrl, setProfileImageUrl] = useState(defaultProfileImage);
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1) Get current user’s sub from Auth
        const session = await fetchAuthSession();
        const userSub = session.tokens.idToken.payload.sub;

        // 2) Query DataStore for an existing record by 'sub'
        const [foundUser] = await DataStore.query(User, (u) => u.sub.eq(userSub));
        if (foundUser) {
          setUserRecord(foundUser);
          // Pre-fill fields
          setUsername(foundUser.username || "");
          setFarmName(foundUser.farmName || "");
          setEmail(foundUser.email || "");
          setPhone(foundUser.phone || "");
          setAboutMe(foundUser.aboutMe || "");

          // If user has a profilePictureKey, fetch from S3
          if (foundUser.profilePictureKey) {
            const imageUrl = await Storage.get(foundUser.profilePictureKey);
            setProfileImageUrl(imageUrl);
          }
        } else {
          console.log("No existing user record found for sub:", userSub);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Called when the user picks a new file
  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicFile(e.target.files[0]);
    }
  };

  // Called when user hits "Save" in the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a new file to upload, handle that first
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

  // Uploads the selected file to S3 and returns the S3 key
  const uploadProfilePicture = async (file) => {
    try {
      const session = await fetchAuthSession();
      const userSub = session.tokens.idToken.payload.sub;

      // Example key: "profile-pictures/<sub>.jpg" 
      // or you can do something unique like `${Date.now()}_${file.name}`
      const s3Key = `profile-pictures/${userSub}_${file.name}`;

      // Upload to S3
      await Storage.put(s3Key, file, {
        contentType: file.type,
      });

      return s3Key;
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      return null;
    }
  };

  // Create a new user record
  const createNewUser = async (profilePictureKey) => {
    try {
      const session = await fetchAuthSession();
      const userSub = session.tokens.idToken.payload.sub;

      const newUser = await DataStore.save(
        new User({
          sub: userSub,
          username,
          farmName,
          email,
          phone,
          aboutMe,
          profilePictureKey,
        })
      );
      setUserRecord(newUser);

      // If we successfully uploaded a picture, display it
      if (profilePictureKey) {
        const imageUrl = await Storage.get(profilePictureKey);
        setProfileImageUrl(imageUrl);
      }

      alert("Profile created successfully!");
    } catch (error) {
      console.error("Error creating new user record:", error);
      alert("Failed to create profile.");
    }
  };

  // Update existing user record
  const updateUserRecord = async (profilePictureKey) => {
    try {
      const updated = await DataStore.save(
        User.copyOf(userRecord, (updated) => {
          updated.username = username;
          updated.farmName = farmName;
          updated.email = email;
          updated.phone = phone;
          updated.aboutMe = aboutMe;
          if (profilePictureKey) {
            updated.profilePictureKey = profilePictureKey;
          }
        })
      );
      setUserRecord(updated);

      // If we uploaded a new picture, show it
      if (profilePictureKey) {
        const imageUrl = await Storage.get(profilePictureKey);
        setProfileImageUrl(imageUrl);
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
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {/* Show profile image (default if none) */}
      <div className="flex justify-center mb-4">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Farm Name */}
        <div>
          <label className="block font-medium mb-1">Farm Name</label>
          <input
            type="text"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* About Me */}
        <div>
          <label className="block font-medium mb-1">About Me</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
          />
        </div>

        {/* Profile Picture Input */}
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
                       file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
