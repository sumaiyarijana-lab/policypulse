# PolicyPulse Deployment Instructions

This guide provides steps for deploying PolicyPulse to production environments.

## Architecture Topology
- **Frontend**: Vercel (Next.js Application)
- **Backend**: Render, Heroku, or AWS EC2 (Node.js/Express App)
- **Database**: MongoDB Atlas (Cloud DB)
- **AI Service**: Render or AWS Lambda (Flask/Python)

## 1. Database Deployment (MongoDB Atlas)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster (M0 Free Tier is sufficient for staging).
3. Under **Database Access**, create a new database user with a secure password.
4. Under **Network Access**, allow IP `0.0.0.0/0` (or restrict to your backend server IPs).
5. Copy the connection string (URI).

## 2. Backend Deployment (Render / Heroku)
1. Push your `server/` directory to a GitHub repository.
2. Log in to Render/Heroku and create a new **Web Service**.
3. Connect your GitHub repository and set the root directory to `server`.
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Configure the following Environment Variables (see `ENVIRONMENT_SETUP.md` for details):
   - `PORT`
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (Set this to your future Vercel URL)
7. Deploy the service and copy the generated Backend URL.

## 3. Frontend Deployment (Vercel)
1. Push your `client/` directory to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository and set the root directory to `client`.
4. The framework preset should automatically detect **Next.js**.
5. Configure the Environment Variables:
   - `NEXT_PUBLIC_API_URL` (Set to the Backend URL generated in step 2)
6. Click **Deploy**.
7. Once deployed, copy your Vercel URL and update the `CLIENT_URL` in your backend environment variables.

## 4. AI Service Deployment (Flask)
1. Navigate to your `/ai/` repository.
2. Deploy as a Web Service on Render or as an AWS Lambda function using Zappa.
3. Add the AI service URL to your backend `.env` file (`AI_SERVICE_URL`) to allow Node.js to communicate with the Python service.

## Post-Deployment Checklist
- [ ] Test User Registration and Login.
- [ ] Test Complaint Submission with a file upload (Verify `uploads` persistence. Note: On ephemeral file systems like Heroku, you should configure AWS S3 for `multer`).
- [ ] Test the Map functionality (Ensure CORS headers are properly set).
- [ ] Verify Admin Dashboard analytics are fetching correctly.
