import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar } from "./Navbar/navbar.jsx";
import { Home } from "./Home/Home.jsx";
import { Signin } from "./auth/Signin.jsx";
import { SigninT } from "./auth/Signin-T.jsx";
import { Register } from "./auth/Register.jsx";
import { RegisterT } from "./auth/Register-T.jsx";
import { Profiles } from "./profile/profiles.jsx";
import { GridTemplate } from "./courses/course.jsx";
import { Lecture } from "./lecture/lecture.jsx";
//admin app
import { Adminapp } from "./Dashboard/adminApp.jsx";
import { Adminprof } from "../component/Dashboard/adminprof.jsx";
import { Adminuser } from "./Dashboard/adminuser.jsx";
import { AdminSignin } from "./Dashboard/signin.jsx";
import { Admincourse } from "./Dashboard/admincourse.jsx";
// toast
import { ToastContainer } from "react-toastify";
//usercontext
import { Usercontextprovider } from "../../context/userContext.jsx";
// teacher context
import { Teachercontextprovider } from "../../context/teacherContext.jsx";
//coursecontext
import{Coursescontextprovider} from "../../context/courseContext.jsx"
//admin context
import { Admincontextprovider } from "../../context/adminContext.jsx";
///axios
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/student/signin",
    element: <Signin />,
  },
  {
    path: "/teacher/signin",
    element: <SigninT />,
  },
  {
    path: "/courses",
    element: <GridTemplate />,
  },
  {
    path: "/student/register",
    element: <Register />,
  },
  
  {
    path: "/about",
    element: <Navbar />,
  },
  {
    path: "/profiles",
    element: <Profiles />,
  },
  {
    path: "/lectures/:courseId",
    element: <Lecture />,
  },
  {
    path: "/dashboard",
    element: <Adminapp />,
    children: [
      {
        index: true, // This sets the default route for /dashboard
        element: <AdminSignin />, // Set Adminprof as the default page
      },
      {
        path: "prof",
        element: <Adminprof />,
      },
      {
        path: "user",
        element: <Adminuser />,
      },
      {
        path: "course",
        element: <Admincourse />,
      },
     
     
    ],
  },
  
]);
export function App() {
  return (
    <>
      <Navbar></Navbar>
      <Usercontextprovider>
        <Teachercontextprovider>
        <Coursescontextprovider>
         <Admincontextprovider>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          theme="colored"
          closeOnClick
          pauseOnHover={false}
        />
        <RouterProvider router={router} />

        {/* footer */}
        </Admincontextprovider>
        </Coursescontextprovider>
        </Teachercontextprovider>
      </Usercontextprovider>
    </>
  );
}
