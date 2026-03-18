import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbums } from "../utils/albumSlice";
import { Link } from "react-router-dom";

const Albums = () => {
  const { albums } = useSelector((state) => state.album);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  console.log(albums);

  return (
    <div className="card bg-base-300 border border-base-300 my-6 py-6 px-4 shadow-lg">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold mb-6">
        My Albums
        <span className="badge badge-info ml-3">
          {albums?.length || 0}
        </span>
      </h2>


      {albums?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-70">
          <p className="text-xl font-medium">No Albums Yet 📸</p>
          <p className="text-sm mt-1">Create your first album to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center">

          {albums?.map((a) => (
            <Link key={a._id} to={`albums/${a.albumID}/images`}>

              <div className="flex flex-col items-center group">

                <div className="hover-3d">

                  <figure className="w-60 h-80 mt-4 rounded-2xl overflow-hidden shadow-xl">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={`https://placehold.co/300x400/1f2937/ffffff?text=${encodeURIComponent(
                        a.name
                      )}`}
                      alt={a.name}
                    />
                  </figure>


                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>

                </div>

  
                <p className="mt-3 text-center font-semibold">
                  {a.name}
                </p>

              </div>

            </Link>
          ))}

        </div>
      )}
    </div>
  );
};

export default Albums;