import React, { useContext, useEffect, useState } from "react";

import Navbar from "./Navbar";

import Image from "next/image";

import { AuthContext } from "../context/auth";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

function Profile() {
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState({});
  const [postIds, setPostIds] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  // ---------------------------------------
  // Get current user's data
  // ---------------------------------------
  useEffect(() => {
    // User is not available yet
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    console.log("Current user UID:", user.uid);

    const userRef = doc(db, "users", user.uid);

    const unsub = onSnapshot(
      userRef,
      (docSnapshot) => {
        // Check if user document exists
        if (!docSnapshot.exists()) {
          console.log("User document does not exist in Firestore");

          setUserData({});
          setPostIds([]);

          return;
        }

        // Get Firebase document data
        const data = docSnapshot.data();

        console.log("USER FIRESTORE DATA:", data);

        setUserData(data);

        // If posts doesn't exist, use empty array
        setPostIds(data.posts || []);
      },
      (error) => {
        console.error("Error getting user data:", error);
      }
    );

    // Cleanup listener
    return () => {
      unsub();
    };
  }, [user]);

  // ---------------------------------------
  // Get user's posts
  // ---------------------------------------
  useEffect(() => {
    // If there are no post IDs
    if (!postIds || postIds.length === 0) {
      setUserPosts([]);
      return;
    }

    const unsubscribeArray = [];

    postIds.forEach((pid) => {
      const postRef = doc(db, "posts", pid);

      const unsub = onSnapshot(
        postRef,
        (docSnapshot) => {
          // Check whether post exists
          if (!docSnapshot.exists()) {
            console.log("Post does not exist:", pid);
            return;
          }

          const postData = {
            ...docSnapshot.data(),
            postId: docSnapshot.id,
          };

          console.log("POST DATA:", postData);

          setUserPosts((previousPosts) => {
            // Check if post already exists
            const postExists = previousPosts.some(
              (post) => post.postId === postData.postId
            );

            if (postExists) {
              // Update existing post
              return previousPosts.map((post) =>
                post.postId === postData.postId
                  ? postData
                  : post
              );
            }

            // Add new post
            return [...previousPosts, postData];
          });
        },
        (error) => {
          console.error(
            "Error getting post:",
            pid,
            error
          );
        }
      );

      unsubscribeArray.push(unsub);
    });

    // Cleanup all post listeners
    return () => {
      unsubscribeArray.forEach((unsub) => {
        unsub();
      });
    };
  }, [postIds]);

  return (
    <div>
      {/* NAVBAR */}
      <Navbar userData={userData} />

      <div>

        {/* PROFILE INTRO */}
        <div className="profile-intro">

          {/* PROFILE IMAGE */}
          <div
            style={{
              height: "8rem",
              width: "8rem",
              clipPath: "circle(50%)",
              position: "relative",
            }}
          >
            {userData.downloadURL && (
              <Image
                layout="fill"
                src={userData.downloadURL}
                alt="Profile"
              />
            )}
          </div>

          {/* USER INFORMATION */}
          <div>
            <h1>
              {userData.fullName || "User"}
            </h1>

            <h1>
              Posts: {userData.posts?.length || 0}
            </h1>
          </div>

        </div>

        <hr />

        {/* USER POSTS */}
        <div className="profile-posts">

          {userPosts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            userPosts.map((post, index) => (
              <video
                key={post.postId || index}
                src={post.postURL}
                controls
              />
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default Profile;