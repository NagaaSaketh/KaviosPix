import { useState } from "react";
import { createAlbum, fetchAlbums } from "../utils/albumSlice";
import { useDispatch } from "react-redux";
import Albums from "../components/Albums";

const Home = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [toast, setShowToast] = useState("");

  const dispatch = useDispatch();

  const handleCreateAlbum = async () => {
    const newAlbum = { name, description };

    const result = await dispatch(createAlbum(newAlbum));

    if (createAlbum.fulfilled.match(result)) {
      setShowToast("Album created successfully 🎉");
      setName("");
      setDescription("");

      dispatch(fetchAlbums());

    } else {
      setShowToast("Failed to create album!");
    }

    setTimeout(() => setShowToast(""), 2000);
  };

  return (
    <div className="bg-base-600 min-h-screen flex flex-col">
      <div className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-pretty-content font-stretch-ultra-condensed">
            Organize your memories into beautiful albums
          </h1>
        </div>
        <div className="mb-8">
          <button
            className="btn rounded-3xl btn-primary"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            Create Album
          </button>
        </div>

        <Albums />
      </div>

      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <h3 className="text-2xl font-bold mb-4">Create New Album</h3>

          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Album Name</span>
              </label>

              <input
                type="text"
                placeholder="My Trip Photos"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Description</span>
              </label>

              <input
                type="text"
                placeholder="Photos from my Sikkim trip"
                className="input input-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-success"
              onClick={() => {
                handleCreateAlbum();
                document.getElementById("my_modal_5").close();
              }}
            >
              Create
            </button>

            <button
              className="btn btn-error"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {toast && (
        <div className="toast toast-bottom toast-end">
          <div
            className={`alert ${
              toast.includes("success") ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Home;
