import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/albums`;

/* ---------------- FETCH ALBUMS ---------------- */
export const fetchAlbums = createAsyncThunk(
  "album/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- CREATE ALBUM ---------------- */
export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async (albumData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, albumData, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- FETCH IMAGES ---------------- */
export const fetchAlbumImages = createAsyncThunk(
  "album/fetchAlbumImages",
  async ({ albumId, tags }, { rejectWithValue }) => {
    console.log(tags);

    try {
      const res = await axios.get(`${API}/${albumId}/images`, {
        params: { tags },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- CREATE IMAGE ---------------- */
export const createImage = createAsyncThunk(
  "album/createImage",
  async ({ formData, albumId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/${albumId}/images`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.image;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- UPDATE DESCRIPTION ---------------- */
export const updateAlbumDesc = createAsyncThunk(
  "album/updateDescription",
  async ({ albumId, desc }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API}/${albumId}`,
        { description: desc },
        { withCredentials: true },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- SHARE ALBUM ---------------- */
export const addSharedUsers = createAsyncThunk(
  "album/sharedUsers",
  async ({ albumId, sharedUsers }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/${albumId}/share`,
        { sharedUsers },
        { withCredentials: true },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/*----------------- DELETE ALBUM --------------- */

export const deleteAlbum = createAsyncThunk(
  "albums/deleteAlbum",
  async ({ albumId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API}/${albumId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/*----------------- DELETE IMAGE FROM ALBUM --------------- */

export const deleteImage = createAsyncThunk(
  "albums/deleteImage",
  async ({ albumId, imageId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${API}/${albumId}/images/${imageId}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/*----------------- MARK IMAGE FAVORITE/UNFAVORITE --------------- */

export const updateImageStatus = createAsyncThunk(
  "albums/imageStatus",
  async ({ albumId, imageId, isFavorite }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API}/${albumId}/images/${imageId}/favorite`,
        { isFavorite },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/*----------------- ADD COMMENTS TO IMAGE --------------- */

export const addCommentsToImage = createAsyncThunk(
  "albums/imageComments",
  async ({ albumId, imageId, comment }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}/${albumId}/images/${imageId}/comments`,
        { comment },
        { withCredentials: true },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

/* ---------------- SLICE ---------------- */

const albumSlice = createSlice({
  name: "album",
  initialState: {
    albums: [],
    images: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH ALBUMS */
      .addCase(fetchAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = "success";
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || action.error.message;
      })

      /* CREATE ALBUM */
      .addCase(createAlbum.fulfilled, (state, action) => {
        
      })

      /* FETCH IMAGES */
      .addCase(fetchAlbumImages.fulfilled, (state, action) => {
        state.images = action.payload;
      })

      /* CREATE IMAGE */
      .addCase(createImage.fulfilled, (state, action) => {
        state.images.push(action.payload);
      })

      /* UPDATE DESCRIPTION */
      .addCase(updateAlbumDesc.fulfilled, (state, action) => {
        const updatedAlbum = action.payload.album;

        const album = state.albums.find(
          (a) => a.albumID === updatedAlbum.albumID,
        );

        if (album) Object.assign(album, updatedAlbum);
      })

      /* SHARE USERS */
      .addCase(addSharedUsers.fulfilled, (state, action) => {
        const album = state.albums.find(
          (a) => a.albumID === action.meta.arg.albumId,
        );

        if (album) {
          album.sharedUsers = action.payload.sharedUsers;
        }
      })

      /* DELETE ALBUM */
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        const deletedAlbumId = action.meta.arg.albumId;
        state.albums = state.albums.filter((a) => a.albumID !== deletedAlbumId);
      })

      /* DELETE IMAGE */

      .addCase(deleteImage.fulfilled, (state, action) => {
        const deletedImage = action.meta.arg.imageId;
        state.images = state.images.filter((i) => i.imageID != deletedImage);
      })

      /* MARK IMAGE AS FAVORITE/UNFAVORITE */
      .addCase(updateImageStatus.fulfilled, (state, action) => {
        const updatedImage = action.payload.image;

        const image = state.images.find(
          (i) => i.imageID === updatedImage.imageID,
        );

        if (image) {
          image.isFavorite = updatedImage.isFavorite;
        }
      })

      /* ADD COMMENTS TO IMAGE */

      .addCase(addCommentsToImage.fulfilled,(state,action)=>{
        const {imageId} = action.meta.arg;
        const image = state.images.find((i)=>i.imageID === imageId);

        if(image){
          image.comments = action.payload.comments;
        }
        
      })

      /* GENERIC ERROR */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload?.message || action.error.message;
        },
      );
  },
});

export default albumSlice.reducer;
