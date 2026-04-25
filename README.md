# KaviosPix

KaviosPix is a full-stack photo management and sharing application that allows users to upload, organize, and share images through albums with secure authentication and access control.

---

## Demo Link

[Demo Link](https://kaviospix-one.vercel.app/)

---

## Quick Start

```
git clone https://github.com/NagaaSaketh/KaviosPix.git
cd KaviosPix
npm install
npm run dev

```

---

## Environment Variables

- PORT=your_port_number
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_secret_key
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret
- GOOGLE_REDIRECT_URI=your_redirect_uri
- FRONTEND_URL=your_local_frontend_url
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret

---

## Technologies

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)

### Authentication

- JWT (jsonwebtoken)
- Google OAuth

### Storage

- Cloudinary (image hosting)

---

## Authentication Flow
- User logs in (Google or email)
- Server generates JWT
- Token stored in HTTP-only cookie
- Middleware (verifyAccessToken) protects routes
- User data is attached to req.user

---

## Features

### Album Management

- Create, update, and delete albums
- Share albums with other users (read-only access)
- Fetch personal and shared albums

### Image Management

- Upload images (Cloudinary integration)
- Use tags for easy searching
- Mark images as favorites
- Delete images

### Collaboration

- Comment on images
- View comments with user details
- Shared users can also comment on images.

### Filtering & Search

- Filter images by tags
- Fetch favorite images separately

---

## API References

### Auth routes

### **POST /api/login**

Login

Sample Response :

```
{
    message: Login Successfull,
    user: {_id,userID,emailID,name,photoUrl}
}
```

### **GET /api/auth/google**

### **GET /api/auth/google/callback**

Google OAuth

---

### Album routes

### **POST /api/albums**

Create an album

Sample Response :

```
{
    message: Album created successfully!,
    albumId:"...."
}
```

### **GET /api/albums**

Get all albums of the logged-in user

Sample Response :

```
[{_id,name,description,ownerID,sharedUsers,albumID},...]
```

### **PUT /api/albums/:albumID**

Update album description

Sample Response :

```
{

    message: Description updated successfully!,
    album:{_id,name,description,ownerID,sharedUsers,albumID}

}
```

### **DELETE /api/albums/:albumID**

Delete an album

Sample Response :

```
{

message: Album deleted successfully!,
deletedAlbum: {_id,name,description,albumID,...}

}
```

### **POST /api/albums/:albumID/share**

Share an album

Sample Response :

```
{

message: Album shared with read-only access,
sharedUsers: "sharedUsers details"

}
```

### Image Routes

### **POST /api/albums/:albumID/images**

Upload Image in an album

Sample Response :

```
{

message: Image uploaded successfully,
image:{_id,albumID,name,tags,isFavorite,...}

}
```

### **GET /api/albums/:albumID/images?tags=tag1,tag2**

Get Images (with optional tags)

Sample Response :

```
{

message: Image uploaded successfully,
image:{_id,albumID,name,tags,isFavorite,...}

}
```

### **GET /api/albums/:albumID/images/favorites**

Get Favorite Images from the album

Sample Response:

```
{_id,albumID,name,tags,isFavorite,...}
```

### **PUT /api/albums/:albumID/images/:imageID/favorite**

Mark/Unmark Favorite images

Sample Response:

```
{

message: Marked as favorite/unfavorite
image:{_id,albumID,name,tags,isFavorite,...}

}

```

### **POST /api/albums/:albumID/images/:imageID/comments**

Add Comments to image

Sample Response:

```
{

message: Comment added successfully,
comments: "...."

}

```

### **DELETE /api/albums/:albumID/images/:imageID**

Delete image from the album

Sample Response:

```
{message: Image deleted successfully}
```


## Contact 

For bugs or feature requests, please reach out to vadlamanisaketh25@gmail.com