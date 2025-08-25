# MERN Stack Developer Machine Test  

This is a **MERN (MongoDB, Express.js, React, Node.js)** stack application designed as part of a Machine Test for a MERN Stack Developer position.  

The application provides an **Admin Dashboard** for user authentication, agent management, and a unique feature for uploading and distributing tasks from a CSV file.  

---

## ✨ Features  

- **Admin User Login** – Secure login for an admin user using **JWT (JSON Web Token)** for authentication.  
- **Agent Creation & Management** – Protected route for admin to create and manage agents.  
- **CSV Upload & Task Distribution** – Upload a CSV/XLSX file with tasks, validate, and auto-distribute tasks equally among all agents.  
- **Data Persistence** – All user, agent, and task data stored in **MongoDB Atlas**.  

---

## 💻 Tech Stack  

**Frontend**  
- React.js  
- axios (API communication)  
- react-router-dom (routing)  

**Backend**  
- Node.js  
- Express.js  

**Database**  
- MongoDB Atlas (cloud-hosted NoSQL DB)  
- mongoose (ODM for MongoDB)  

**Authentication**  
- jsonwebtoken (JWT auth)  
- bcryptjs (secure password hashing)  

**File Handling**  
- multer (file uploads)  
- fast-csv (CSV parsing)  

**Utilities**  
- dotenv (environment variables)  
- cors (cross-origin requests)  

---

## 🚀 Getting Started  

Follow these steps to set up and run the application locally.  

---

### 1️⃣ Database Setup (MongoDB Atlas)  

1. **Create an Account** – Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).  
2. **Deploy a Free Cluster** – Create a free M0 cluster.  
3. **Create a Database User**  
   - Go to **Security > Database Access**  
   - Click **Add New Database User** → create a user with a strong password.  
   - Assign **Read and write to any database** privileges.  
4. **Whitelist Your IP**  
   - Go to **Security > Network Access**.  
   - Add your IP or allow access from anywhere (`0.0.0.0/0`) for development.  
5. **Get Connection String**  
   - Go to **Databases > Connect > Drivers (Node.js)**.  
   - Copy connection string, e.g.:  
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager-db
     ```

---

### 2️⃣ Backend Setup  

1. Navigate to the **backend** directory:  
   ```bash
   cd backend
```
2. Install dependencies:
```bash
    npm install
```

3. Create a .env file in the backend root and add the following:
```bash
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-manager-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_very_secure_and_long_jwt_secret

```
4. Start the backend server:

```bash
node server.js
```
### 3️⃣ Backend Setup  

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The app will be available at: http://localhost:3000

### 4️⃣ Initializing the Admin User

1. Since the database starts empty, create the first Admin User:

2. Open Postman (or any API client).

Send a POST request to:
```bash
http://localhost:5000/api/auth/register
```

3. Set request body (JSON):
```bash
{
  "email": "admin@example.com",
  "password": "strongPassword123"
}
```

4. Send the request → the Admin will now be created in your database.

### 🖥️ Running the Application

Log In – Navigate to the app in your browser and log in with the created Admin credentials.

Agent Management – Use the form to add new agents, view them in a table.

File Upload – Upload a CSV file with tasks → tasks will be auto-distributed among agents and saved to MongoDB.