# Image-Processing-Service

This is an image processing service built with Node.js, Express, and MongoDB. It provides a RESTful API for user authentication and image management, including uploading images to Cloudinary and storing their details in a MongoDB database.

## Features

  - **User Authentication**: Register, login, and logout functionalities are provided.
  - **JWT-based Security**: API endpoints are secured using JSON Web Tokens (JWT) for user verification.
  - **Image Upload**: Upload images via URL to Cloudinary.
  - **Image Management**: List and delete images stored in the database and on Cloudinary.
  - **Cloudinary Integration**: Utilizes Cloudinary for efficient cloud-based image storage and processing.
  - **Local File Handling**: Includes utilities for handling and deleting local files.
  - **Image Transformation**: The API supports applying transformations to existing images on Cloudinary.

## Technologies Used

The project uses the following technologies and libraries:

  - **Node.js & Express**: The backend framework.
  - **Mongoose**: A MongoDB object data modeling (ODM) library for Node.js.
  - **MongoDB**: The database used to store user and image information.
  - **Cloudinary**: A cloud service for image and video management.
  - **bcrypt**: A library to help hash passwords.
  - **jsonwebtoken**: A library to implement JSON Web Tokens.
  - **dotenv**: A zero-dependency module that loads environment variables from a `.env` file.
  - **multer**: A middleware for handling `multipart/form-data`, which is primarily used for uploading files.
  - **cors**: A Node.js middleware for handling cross-origin resource sharing.
  - **cookie-parser**: A middleware for parsing cookies attached to the client request object.
  - **nodemon**: A development utility that monitors for any changes in your source and automatically restarts the server.

## Installation and Setup

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd Image-Processing-Service
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory. The `.gitignore` file indicates that this file is not tracked by Git.
    You will need to configure the following variables:

      - `PORT`: The port your server will run on.
      - `CORS_ORIGIN`: The origin for cross-origin resource sharing.
      - `MONGODB_URI`: The connection URI for your MongoDB database. The database name is `imageProcessingService`.
      - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
      - `CLOUDINARY_API_KEY`: Your Cloudinary API key.
      - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
      - `ACCESS_TOKEN_SECRET`: A secret for signing JWT access tokens.
      - `REFRESH_TOKEN_SECRET`: A secret for signing JWT refresh tokens.
      - `ACCESS_TOKEN_EXPIRY`: Expiry time for access tokens (e.g., "15m").
      - `REFRESH_TOKEN_EXPIRY`: Expiry time for refresh tokens (e.g., "7d").

4.  **Run the application**:

    ```bash
    npm run dev
    ```

    This script automatically loads the environment variables using `dotenv` and runs the server with `nodemon`.

## API Endpoints

The API is served under the `/api/v1` base path.

### User Routes (`/api/v1/users`)

  - `POST /register`: Registers a new user.
  - `POST /login`: Logs in a user.
  - `POST /logout`: Logs out a user (requires authentication).

### Image Routes (`/api/v1/images`)

  - `POST /upload`: Uploads an image (requires authentication).
  - `GET /`: Lists all images uploaded by the authenticated user.
  - `DELETE /:id`: Deletes a specific image by its ID (requires authentication).
  - `POST /transform/:id`: Transforms a specific image by its ID (requires authentication). The request body should contain a `transformations` object with valid Cloudinary transformation parameters.

https://roadmap.sh/projects/image-processing-service
