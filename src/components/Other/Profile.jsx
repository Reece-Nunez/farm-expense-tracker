import React, { useEffect, useState } from "react";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { getUser, listUsers } from "@/graphql/queries";
import { updateUser, createUser } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";

export default function Profile() {
  const [userRecord, setUserRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [farmName, setFarmName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  const defaultProfileImage = "https://farmexpensetrackerreceipts3b0d2-dev.s3.us-east-1.amazonaws.com/profile-pictures/default.jpg";
  const [profileImageUrl, setProfileImageUrl] = useState(defaultProfileImage);
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const client = generateClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const foundUser = await getCurrentUser();
        if (!foundUser) return;

        setUserRecord(foundUser);
        setUsername(foundUser.username || "");
        setFarmName(foundUser.farmName || "");
        setEmail(foundUser.email || "");
        setPhone(foundUser.phone || "");
        setAboutMe(foundUser.aboutMe || "");

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
        profilePictureKey: ""
      };

      const { data } = await client.graphql({ query: updateUser, variables: { input } });
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

      const input = {
        sub: user.sub,
        username,
        farmName,
        email,
        phone,
        aboutMe,
        profilePictureKey,
      };

      const { data } = await client.graphql({
        query: createUser,
        variables: { input },
      });

      if (!data?.createUser) {
        throw new Error("User creation returned no data.");
      }

      setUserRecord(data.createUser);

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

  const updateUserRecord = async (profilePictureKey) => {
    try {
      const input = {
        id: userRecord.id,
        username,
        farmName,
        email,
        phone,
        aboutMe,
        profilePictureKey: profilePictureKey || userRecord.profilePictureKey,
      };

      const { data } = await client.graphql({ query: updateUser, variables: { input } });
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
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block font-medium mb-1">Farm Name</label>
          <input
            type="text"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">About Me</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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