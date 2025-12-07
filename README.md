# InterNest app
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Node.js](https://img.shields.io/badge/Node.js-303030?style=for-the-badge&logo=node.js&logoColor=3C873A)
![Express](https://img.shields.io/badge/Express-FFFFFF?style=for-the-badge&logo=express&logoColor=000000)
![MongoDB](https://img.shields.io/badge/MongoDB-001E2B?style=for-the-badge&logo=mongodb&logoColor=4FAA41)
## Overview
Developed an e-learning web application that **connects students with teachers** for an interactive and flexible learning experience, The platform enables:
- Teachers to upload educational content including video lessons, documents, and course materials.📚
- Learners to access courses, follow structured lessons, and study at their own pace.👨‍🏫
- Seamless communication between students and instructors for questions, clarification, and guidance.💬
- Admin dashboard for managing users, courses, content, and overall platform operations.🛠️

Developed as part of **Third-year web development project**
## 🎯 Features

### 🔐 Authentication & Roles
- **Admin**: Manages teachers, students, courses, and platform content.  
- **Teacher**: Creates courses, uploads videos/documents, and manages homework submissions.  
- **Student**: Registers, enrolls in courses, watches lessons, and submits homework.

### ✉️ Email Verification
- Students receive a **verification code via email** during registration to ensure secure and valid account creation.

### 👤 Profile Section
- **Teachers and students** have profile pages where they can update personal information and track their activity.

### 📚 Course & Content Management
- Teachers can upload **video lessons**, documents, assignments, and extra learning resources.  
- Students can watch videos, access course materials, download documents, and follow lessons at their own pace.

### 📝 Homework & Assignments
- Students can **submit homework/assignments** directly through the platform.  
- Teachers can **review, grade, and provide feedback** on each submission.

### 📊 Admin Dashboard
- A powerful dashboard that allows the admin to **manage users, oversee courses, and monitor platform activity**.

## 🛠️ Tech Stack

### **Back-end**
![Node.js](https://img.shields.io/badge/Node.js-303030?style=for-the-badge&logo=node.js&logoColor=3C873A)
- Node-js REST Framework
- Email service **nodemailer** to insure more security
- Mongo-db
- Local space to save Assets

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
- CORS for fetching
  
### **Tools**
- Postman for API testing
- nodemailer for secure authentication
##  🛠️ Setup Instructions
### Prerequisites
- Node.js and npm (for React)
- Mongo-db (database)
- IDE (VS-code)
### Backend Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/Abdou2425/E-Learning-.git
    cd E-Learning
    ```
2. Install dependencies:
    ```bash
    cd server
    npm install 
    ```
3. Copy the environment variables from the .env.example file, and fill it with your data:
    ```bash
    mv ../server/.env.example .env
    ```
4. Run the server:
    ```bash
    npm start 
    ```
### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
## 🧪 Testing the API
Use **Postman** to test the API endpoints try like:
- Create a Course  (`POST /courses/newCourse/`)
- Student registration (`POST /student/register/`)
- List all existing students by admin (`GET /admin/getAllStudents`)
.....
##  👥 Contributors
Kridi mohmaed
## 📜 License
The app was created for **educational purposes** as part of a **Third-year web development project**. It demonstrates practical skills in full-stack development, including backend API creation, frontend web app development.
