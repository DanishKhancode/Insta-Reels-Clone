import React, { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddCommentIcon from "@mui/icons-material/AddComment";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import { CardActionArea, CardActions } from "@mui/material";

import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import DisplayComments from "./DisplayComments";
import Comment from "./Comment";

import * as ReactDOM from "react-dom";

function Post({ postData, userData }) {
  console.log("USER DATA:", userData);
  console.log("POST DATA:", postData);

  const [like, setLike] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [open, setOpen] = useState(false);

  // ------------------------------------
  // Check whether current user liked post
  // ------------------------------------
  useEffect(() => {
    if (
      userData &&
      postData &&
      postData.likes &&
      postData.likes.includes(userData.uid)
    ) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [postData, userData]);

  // ------------------------------------
  // Open comment dialog
  // ------------------------------------
  const handleClickOpen = () => {
    console.log("dialog opened");
    setOpen(true);
  };

  // ------------------------------------
  // Close comment dialog
  // ------------------------------------
  const handleClose = () => {
    console.log("dialog closed");
    setOpen(false);
  };

  // ------------------------------------
  // Like / Unlike post
  // ------------------------------------
  const handleLike = async () => {
    try {
      // Check if user is logged in
      if (!userData) {
        console.log("User is not logged in");
        alert("Please login to like this post.");
        return;
      }

      // Check user UID
      if (!userData.uid) {
        console.log("User UID is missing");
        return;
      }

      // Check post ID
      if (!postData || !postData.postId) {
        console.log("Post ID is missing");
        return;
      }

      if (like) {
        // -------------------------
        // UNLIKE
        // -------------------------
        await updateDoc(doc(db, "posts", postData.postId), {
          likes: arrayRemove(userData.uid),
        });

        setLike(false);

        console.log("Post unliked");
      } else {
        // -------------------------
        // LIKE
        // -------------------------
        await updateDoc(doc(db, "posts", postData.postId), {
          likes: arrayUnion(userData.uid),
        });

        setLike(true);

        console.log("Post liked");
      }
    } catch (error) {
      console.error("Error while liking/unliking post:", error);
    }
  };

  // ------------------------------------
  // Mute / Unmute video
  // ------------------------------------
  const handleMute = () => {
    if (isMute) {
      setIsMute(false);
    } else {
      setIsMute(true);
    }
  };

  // ------------------------------------
  // Go to next video
  // ------------------------------------
  const handleNextVideo = (e) => {
    let nextVideo = ReactDOM.findDOMNode(e.target).parentNode.nextSibling;

    if (nextVideo) {
      nextVideo.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // ------------------------------------
  // Safety check
  // ------------------------------------
  if (!postData) {
    return null;
  }

  return (
    <div className="post-container">

      {/* VIDEO */}
      <video
        src={postData.postURL}
        muted={isMute}
        onClick={handleMute}
        onEnded={handleNextVideo}
      />

      {/* POST INFORMATION */}
      <div className="videos-info">

        {/* AVATAR AND PROFILE NAME */}
        <div className="avatar-container">

          <Avatar
            alt="Profile"
            src={postData.profilePhotoURL}
            sx={{
              margin: "0.5rem",
            }}
          />

          <p style={{ color: "white" }}>
            {postData.profileName}
          </p>

        </div>

        {/* LIKE AND COMMENT */}
        <div className="post-like">

          {/* LIKE BUTTON */}
          <FavoriteIcon
            style={
              like
                ? { color: "red", cursor: "pointer" }
                : { color: "white", cursor: "pointer" }
            }
            onClick={handleLike}
          />

          {/* LIKE COUNT */}
          <p style={{ color: "white" }}>
            {postData.likes ? postData.likes.length : 0}
          </p>

          {/* COMMENT BUTTON */}
          <AddCommentIcon
            onClick={handleClickOpen}
            style={{
              color: "blue",
              fontSize: "2rem",
              cursor: "pointer",
            }}
          />

          {/* COMMENT DIALOG */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth="md"
          >

            <div className="modal-container">

              {/* VIDEO IN MODAL */}
              <div className="video-modal">

                <video
                  autoPlay
                  controls
                  muted
                  src={postData.postURL}
                />

              </div>

              {/* COMMENTS */}
              <div className="comments-modal">

                {/* DISPLAY COMMENTS */}
                <Card className="card1">

                  <DisplayComments
                    postData={postData}
                  />

                </Card>

                {/* LIKE + COMMENT */}
                <Card className="card2">

                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >

                    {postData.likes &&
                    postData.likes.length === 0
                      ? "Be the first one to like this post"
                      : `Liked by ${
                          postData.likes
                            ? postData.likes.length
                            : 0
                        } users`}

                  </Typography>

                  {/* HEART + COMMENT INPUT */}
                  <div className="post-like2">

                    {/* LIKE BUTTON */}
                    <FavoriteIcon
                      style={
                        like
                          ? {
                              color: "red",
                              cursor: "pointer",
                            }
                          : {
                              color: "black",
                              cursor: "pointer",
                            }
                      }
                      onClick={handleLike}
                    />

                    {/* COMMENT COMPONENT */}
                    <Comment
                      userData={userData}
                      postData={postData}
                    />

                  </div>

                </Card>

              </div>

            </div>

          </Dialog>

        </div>

      </div>

    </div>
  );
}

export default Post;