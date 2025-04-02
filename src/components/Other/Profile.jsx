import React, { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { fetchAuthSession } from "@aws-amplify/auth";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { User } from "../../models";

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
  const defaultProfileImage = "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg";
  const [profileImageUrl, setProfileImageUrl] = useState(defaultProfileImage);
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession();
        const userSub = session.tokens.idToken.payload.sub;

        // Query for a User record by sub
        const [foundUser] = await DataStore.query(User, (u) => u.sub.eq(userSub));
        if (foundUser) {
          setUserRecord(foundUser);
          setUsername(foundUser.username || "");
          setFarmName(foundUser.farmName || "");
          setEmail(foundUser.email || "");
          setPhone(foundUser.phone || "");
          setAboutMe(foundUser.aboutMe || "");

          // If user has a profile pic, fetch its URL from S3
          if (foundUser.profilePictureKey) {
            const { url } = await getUrl({ path: foundUser.profilePictureKey });
            setProfileImageUrl(url.href);
          } else {
            setProfileImageUrl(defaultProfileImage);
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

  // Called when user hits "Save"
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a new file, upload it first
    let uploadedKey = userRecord?.profilePictureKey || null;
    if (newProfilePicFile) {
      uploadedKey = await uploadProfilePicture(newProfilePicFile);
    }

    // Create or update the User record
    if (!userRecord) {
      await createNewUser(uploadedKey);
    } else {
      await updateUserRecord(uploadedKey);
    }
  };

  // Uploads file to S3 using your existing "uploadData" approach
  const uploadProfilePicture = async (file) => {
    try {
      const session = await fetchAuthSession();
      const userSub = session.tokens.idToken.payload.sub;

      const fileKey = `profile-pictures/${Date.now()}_${userSub}_${file.name}`;

      // "uploadData" from "aws-amplify/storage"
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

  // Deletes the profile picture from S3 and updates the user record
  const deleteProfilePicture = async () => {
    if (!userRecord?.profilePictureKey) return;

    try {
      // Remove from S3 using your removeData function
      const operation = remove({ path: userRecord.profilePictureKey });
      await operation.result;

      // Update user record to remove the profilePictureKey
      const updated = await DataStore.save(
        User.copyOf(userRecord, (updated) => {
          updated.profilePictureKey = "";
        })
      );
      setUserRecord(updated);
      setProfileImageUrl(defaultProfileImage);
      alert("Profile picture deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("Failed to delete profile picture.");
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

      // If we uploaded a new pic, fetch and display it
      if (profilePictureKey) {
        const { url } = await getUrl({ path: profilePictureKey });
        setProfileImageUrl(url.href);
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

      // If we uploaded a new pic, fetch and display it
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
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {/* Profile Picture Section with hover trash icon */}
      <div className="relative flex justify-center mb-4 group">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border"
        />
        {/* Trash icon overlay */}
        {userRecord?.profilePictureKey && (
          <button
            onClick={deleteProfilePicture}
            className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete profile picture"
          >
            {/* Trashcan Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
            </svg>
          </button>
        )}
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
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
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