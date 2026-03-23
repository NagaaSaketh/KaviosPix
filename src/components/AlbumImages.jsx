import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../config";

import {
  addCommentsToImage,
  addSharedUsers,
  createImage,
  deleteAlbum,
  deleteImage,
  fetchAlbumImages,
  fetchAlbums,
  updateAlbumDesc,
  updateImageStatus,
} from "../utils/albumSlice";
import { SquarePen, Share2, ImageUp, Trash2, Star } from "lucide-react";

const AlbumImages = () => {
  const [imageFile, setImageFile] = useState("");
  const [tags, setTags] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatedDesc, setUpdatedDesc] = useState("");
  const [toast, setToast] = useState("");
  const [sharedUsers, setSharedUsers] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [addComment, setAddComment] = useState(false);
  const [comments, setComments] = useState([]);
  const albumImages = useSelector((state) => state.album.images);
  console.log(albumImages);

  useEffect(() => {
    if (!selectedImage || !Array.isArray(albumImages)) return;
    if (selectedImage) {
      const updated = albumImages.find(
        (img) => img.imageID === selectedImage.imageID,
      );
      if (updated && updated !== selectedImage) {
        setSelectedImage(updated);
      }
    }
  }, [albumImages, selectedImage]);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  console.log(user);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const filteredImages = useMemo(() => {
    if (!Array.isArray(albumImages)) return [];

    return showFavorites
      ? albumImages.filter((img) => img.isFavorite)
      : albumImages;
  }, [albumImages, showFavorites]);
  const { albumId } = useParams();
  const [searchParams] = useSearchParams();
  const tagFilter = searchParams.get("tags");
  const currentAlbum = useSelector((state) =>
    state.album.albums?.find((a) => a.albumID === albumId),
  );
  console.log(currentAlbum);
  const isOwner = currentAlbum?.ownerID === user?._id;
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAlbums());
    dispatch(fetchAlbumImages({ albumId, tags: tagFilter }));
  }, [albumId, tagFilter, dispatch]);

  useEffect(() => {
    if (currentAlbum) {
      setUpdatedDesc(currentAlbum.description || "");
    }
  }, [currentAlbum]);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

  const handleImageUpload = async () => {
    if (!imageFile) {
      showToast("Please select an image first");
      return;
    }
    if (!allowedTypes.includes(imageFile.type)) {
      showToast("Invalid image type. Only jpeg, jpg, png, gif are allowed");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageFile(null);
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (imageFile.size > maxSize) {
      showToast("Image must be less than 5MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageFile(null);
      return;
    }

    const formData = new FormData();

    formData.append("file", imageFile);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((t) => t.trim().toLowerCase())),
    );
    formData.append("isFavorite", isFavorite);

    await dispatch(createImage({ formData, albumId }));

    document.getElementById("upload_modal").close();

    setImageFile(null);
    setTags("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAlbumDescUpdate = async () => {
    const result = await dispatch(
      updateAlbumDesc({ albumId, desc: updatedDesc }),
    );

    if (updateAlbumDesc.fulfilled.match(result)) {
      showToast("Description updated successfully!");
      document.getElementById("edit_desc_modal").close();
    } else {
      showToast("Failed to update description");
    }
  };

  const handleShareAccess = async () => {
    const emails = sharedUsers.split(",").map((e) => e.trim());

    const result = await dispatch(
      addSharedUsers({ albumId, sharedUsers: emails }),
    );

    if (addSharedUsers.fulfilled.match(result)) {
      showToast("Album shared successfully!");
      document.getElementById("shareAlbum_modal").close();
    } else if (addSharedUsers.rejected.match(result)) {
      const message = result.payload?.message;

      if (message?.includes("already")) {
        const users = result.payload?.users?.join(", ");
        showToast(`Album already shared with ${users}`);
      } else if (message?.includes("No valid users")) {
        showToast("No valid users found");
      } else {
        showToast("Failed to share album");
      }
    }
  };

  const handleDeleteAlbum = async () => {
    const result = await dispatch(deleteAlbum({ albumId }));

    if (deleteAlbum.fulfilled.match(result)) {
      showToast(`"${currentAlbum?.name}" deleted successfully`);
      document.getElementById("deleteAlbum_modal").close();

      setTimeout(() => {
        navigate("/");
      }, 800);
    } else {
      showToast("Failed to delete album");
    }
  };

  const handleDeleteImage = async (imageId) => {
    const result = await dispatch(deleteImage({ albumId, imageId }));

    if (deleteImage.fulfilled.match(result)) {
      showToast("Image deleted successfully!");
      document.getElementById("deleteImage_modal").close();
      setSelectedImage(null);
    } else {
      showToast("Failed to delete image");
    }
  };

  const handleImageStatus = async (image) => {
    const newStatus = !image.isFavorite;

    setSelectedImage({ ...image, isFavorite: newStatus });

    const result = await dispatch(
      updateImageStatus({
        albumId,
        imageId: image.imageID,
        isFavorite: newStatus,
      }),
    );

    if (updateImageStatus.fulfilled.match(result)) {
      showToast(
        !image.isFavorite ? "Marked as favorite ⭐" : "Removed from favorites",
      );
    } else {
      showToast("Failed to update image status");
    }
  };

  const handleImageComments = async (newComments) => {
    const result = await dispatch(
      addCommentsToImage({
        albumId,
        imageId: selectedImage.imageID,
        comment: newComments,
      }),
    );

    if (addCommentsToImage.fulfilled.match(result)) {
      showToast("Comment added successfully");
      setComments("");
    } else {
      showToast("Failed to add comment");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5 p-3">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-3xl md:text-3xl font-stretch-expanded">
            {currentAlbum?.name}
          </h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm">Favorites</span>

            <input
              type="checkbox"
              className="toggle toggle-warning"
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="btn font-stretch-expanded btn-primary rounded-3xl"
            onClick={() => document.getElementById("upload_modal").showModal()}
          >
            <ImageUp /> Upload
          </button>
          <div
            className="tooltip"
            data-tip={!isOwner ? "Only owner can share this album" : ""}
          >
            <button
              onClick={() => {
                if (!isOwner) {
                  setToast("Only owner's can share album");
                  setTimeout(() => setToast(""), 3000);
                  return;
                }

                document.getElementById("shareAlbum_modal").showModal();
              }}
              className={`btn btn-primary rounded-2xl ${
                !isOwner ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Share2 />
            </button>
          </div>
          <div
            className="tooltip"
            data-tip={!isOwner ? "Only owner can delete this album" : ""}
          >
            <button
              onClick={() => {
                if (!isOwner) {
                  setToast("Only owner's can delete album");
                  setTimeout(() => setToast(""), 3000);
                  return;
                }

                document.getElementById("deleteAlbum_modal").showModal();
              }}
              className={`btn btn-error rounded-4xl ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
      <>
        {currentAlbum?.description ? (
          <div className="flex justify-start items-center gap-4 p-3">
            <h3 className="font-stretch-expanded">
              {currentAlbum.description}
            </h3>

            <div
              className="tooltip"
              data-tip={!isOwner ? "Only owner can edit description" : ""}
            >
              <button
                onClick={() => {
                  if (!isOwner) {
                    setToast("Only the album owner can edit the description");
                    setTimeout(() => setToast(""), 3000);
                    return;
                  }

                  document.getElementById("edit_desc_modal").showModal();
                }}
                className={`btn btn-circle btn-sm ${
                  !isOwner ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <SquarePen />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="tooltip tooltip-bottom max-w-xs"
            data-tip={!isOwner ? "Only album owner can add description" : ""}
          >
            <button
              onClick={() => {
                if (!isOwner) {
                  setToast("Only the album owner can add a description");
                  setTimeout(() => setToast(""), 3000);
                  return;
                }

                document.getElementById("edit_desc_modal").showModal();
              }}
              className={`btn btn-primary m-3 ${
                !isOwner ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Add Description
            </button>
          </div>
        )}
        <dialog id="edit_desc_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Album Description</h3>

            <textarea
              value={updatedDesc}
              placeholder="Enter album description..."
              className="textarea input-bordered w-full"
              onChange={(e) => setUpdatedDesc(e.target.value)}
            />

            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Cancel</button>
              </form>

              <button
                className="btn btn-primary"
                onClick={handleAlbumDescUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </dialog>
      </>

      <dialog id="upload_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-4">Upload Image</h3>

          <fieldset className="mb-4">
            <legend className="text-sm font-semibold mb-1">Upload File</legend>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setImageFile(e.target.files[0])}
              className="file-input file-input-bordered w-full"
            />
            <p className="text-xs text-gray-400 mt-2">
              Supported: JPG, JPEG, PNG, GIF • Max size: 5MB
            </p>

            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                className="mt-3 w-full max-h-64 object-contain rounded-lg"
              />
            )}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold mb-1">Tags</legend>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="memories,happy,joy"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </fieldset>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button onClick={handleImageUpload} className="btn btn-success">
                Upload
              </button>

              <button className="btn btn-error">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="shareAlbum_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold mb-4">Share Album</h3>
          <fieldset>
            <legend className="text-sm font-medium mb-4">
              Invite people to this album
            </legend>

            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="johndoe@example.com,janedoe@example.com"
              value={sharedUsers}
              onChange={(e) => setSharedUsers(e.target.value)}
            />
          </fieldset>

          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button onClick={handleShareAccess} className="btn btn-success">
                Share
              </button>

              <button className="btn btn-error">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="deleteAlbum_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-thin text-lg mb-4">
            Are you sure you want to delete this album?
          </h3>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-secondary">No</button>
            </form>

            <button className="btn btn-warning" onClick={handleDeleteAlbum}>
              Yes
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="deleteImage_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-thin text-lg mb-4">
            Are you sure you want to delete this image?
          </h3>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-secondary">Cancel</button>
            </form>

            <button
              className="btn btn-warning"
              onClick={() =>
                selectedImage && handleDeleteImage(selectedImage.imageID)
              }
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>

      {!albumImages || albumImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4 opacity-80">
          <div className="text-6xl">📸</div>

          <h2 className="text-2xl font-semibold">No Photos Yet</h2>

          <p className="text-base-content/60">
            Upload your first image to start this album.
          </p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4 opacity-80">
          <div className="text-6xl">⭐</div>

          <h2 className="text-2xl font-semibold">No Favorites Yet</h2>

          <p className="text-base-content/60">
            Mark images as favorites to see them here.
          </p>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img._id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={`${BASE_URL}/uploads/${img.name}`}
                alt={img.name}
                onClick={() => setSelectedImage(img)}
                className="w-full h-56 object-cover cursor-pointer hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-6xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 flex justify-center items-center min-h-75 md:min-h-125">
                <img
                  src={`${BASE_URL}/uploads/${selectedImage.name}`}
                  className="rounded-2xl max-h-[80vh] object-contain shadow-xl"
                />
              </div>

              <div className="card w-full md:w-80 bg-base-200 shadow-lg border border-base-300">
                <div className="card-body p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Image Details</h2>
                    <div
                      className="tooltip sm"
                      data-tip={
                        !isOwner ? "Only owner can mark as favorite" : ""
                      }
                    >
                      <button
                        onClick={() => handleImageStatus(selectedImage)}
                        disabled={!isOwner}
                        className={`btn btn-circle btn-sm transition hover:scale-110 ${
                          selectedImage.isFavorite
                            ? "btn-warning"
                            : "btn-outline"
                        } ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {selectedImage.isFavorite ? <Star /> : <Star />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h2 className="text-sm font-medium text-base-content/70">
                      Tags
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags
                        ?.filter((tag) => tag && tag.trim() !== "")
                        .map((tag) => (
                          <span
                            key={tag}
                            className="badge badge-outline badge-primary"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex justify-between items-center gap-4 mt-3">
                      <h2 className="text-sm font-medium text-base-content/70">
                        Comments{" "}
                        <span className="badge-sm badge badge-neutral">
                          {selectedImage.comments?.length || 0}
                        </span>
                      </h2>
                      <button
                        onClick={() => setAddComment(!addComment)}
                        className="btn btn-xs btn-neutral"
                      >
                        Add Comment
                      </button>
                    </div>
                    {addComment && (
                      <div className="join w-full mt-3">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="input input-bordered join-item w-full"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleImageComments(comments);
                            }
                          }}
                        />

                        <button
                          className="btn btn-primary join-item"
                          onClick={() => handleImageComments(comments)}
                        >
                          Post
                        </button>
                      </div>
                    )}
                    <div className="max-h-60 overflow-y-auto space-y-3 mt-3">
                      {selectedImage.comments &&
                      selectedImage.comments.length > 0 ? (
                        selectedImage.comments.map((c, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="avatar">
                              <div className="w-7 rounded-full">
                                <img src={c.userID?.photoUrl} />
                              </div>
                            </div>

                            <div>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  {c.userID?.name} -
                                </span>{" "}
                                {c.comment}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-center text-gray-400 mt-3">
                          No comments yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-base-300 p-4 flex justify-between">
                  <div
                    className="tooltip"
                    data-tip={
                      !isOwner ? "Only owner can delete this image" : ""
                    }
                  >
                    <button
                      onClick={() => {
                        if (!isOwner) {
                          setToast("Only owner's can delete image");
                          setTimeout(() => setToast(""), 3000);
                          return;
                        }

                        document
                          .getElementById("deleteImage_modal")
                          .showModal();
                      }}
                      className={`btn btn-error rounded-2xl ${!isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Trash2 />
                    </button>
                  </div>

                  <button
                    className="btn btn-outline btn-error"
                    onClick={() => setSelectedImage(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      )}
      {toast && (
        <div className="toast toast-bottom toast-end">
          <div
            className={`alert shadow-lg ${
              toast.includes("success") ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumImages;
