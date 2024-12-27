import React, { useState,useEffect } from "react";
import { useContext } from "react";
import studentP from "../../assets/student.png";
import teacherP from "../../assets/teacher.png";
// user context
import { userContext } from "../../../context/userContext";
// teacher context
import { teacherContext } from "../../../context/teacherContext";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import "./profiles.css";
import Modal from "react-modal";
export function Profiles() {
  const [visibleC, setvisibleC] = useState(false);
  const [visible, setvisible] = useState(false);
  const { student } = useContext(userContext);
  const{ teacher }=useContext(teacherContext)
  console.log(teacher)
  console.log(student)
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  useEffect(() => {
    // Simulate async data fetch from localStorage
    const type = localStorage.getItem("user_type");
    setUserType(type); // Set userType from localStorage
    setLoading(false); // Set loading to false after initialization
  }, []);
  // this is for edit profile
  const [userdata, setuserdata] = useState({
    newName: "",
    oldPass: "",
    newPass: "",
  });
  const [coursedata, setcoursedata] = useState({
    title: "",
    target: "",
    key: "",
    info: "",
    image: null,
  });
  async function editprofile(e) {
    e.preventDefault();
    const { newName, oldPass, newPass } = userdata;
    if (!oldPass && !newPass && !newName) {
      toast.warning("you must fill what you wana edit");
    } else if (!oldPass && !newPass) {
      try {
        const { data } = await axios.put( `${userType}/profile/updateName`, {
          newName,
        });
        toast.success(data.msg);
        console.log(data);
        setuserdata({ newName: "" });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.err);
          console.log(error.response);
        }
        console.log(error);
        setuserdata({ newName: "", oldPass: "", newPass: "" });
      }
    } else if (!newName) {
      try {
        const { data } = await axios.put(`${userType}/profile/updatePassword`, {
          oldPass,
          newPass,
        });
        toast.success(data.msg);
        console.log(data);
        setuserdata({ oldPass: "", newPass: "" });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response);
          toast.error(error.response.data.err);
        }
        console.log(error);
        setuserdata({ newName: "", oldPass: "", newPass: "" });
      }
    } else {
      toast.warning(
        "you cant edit all of them at same time choose one then the other"
      );
      setuserdata({ newName: "", oldPass: "", newPass: "" });
    }
  }
  // this for add course
  async function addcourse(e) {
    e.preventDefault();
    const { title, target, key, info, image } = coursedata;
    console.log(coursedata)
    try {
      const formData = new FormData();
    formData.append('title', title);
    coursedata.target.forEach((item, index) => {
      formData.append(`target[${index}]`, item); // Send array in a format compatible with many backends
    });
    formData.append('key', key);
    formData.append('info', info);

    if (image) {
      formData.append('image', image); // Append the image file
    }

    // Make POST request with FormData
    const { data } = await axios.post("courses/new", formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the appropriate header for file uploads
      },
    });
      toast.success(data.msg);
      console.log(data);
      setcoursedata({title: "",
        target: "",
        key: "",
        info: "",
        image: null})
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
      setcoursedata({
        key: "",
      });
    }
  }
  if (!student && !teacher) {
    return (
      <>
        <h3 style={{ color: "#000" }}>you cant access here</h3>
      </>
    );
  }
  
  if (!userType) {
    return (
      <>
        <h3 style={{ color: "#000" }}>Please sign in again</h3>
      </>
    );
  }

  return (
    <>
      <section class="h-100 gradient-custom-2">
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center">
            <div class="col col-lg-9 col-xl-8">
              <div class="card">
                <div class="rounded-top text-white d-flex flex-row top-div">
                  <div class="ms-4 mt-5 d-flex flex-column second-div">
                    {!visible && !visibleC && (
                      <>
                        <img
                          src={userType === "professor" ? teacherP : studentP}
                          alt="Generic placeholder image"
                          className="img-fluid img-thumbnail mt-4 mb-2 type-img"
                        />
                        <button
                          type="button"
                          data-mdb-button-init
                          data-mdb-ripple-init
                          className="btn btn-outline-dark text-body"
                          data-mdb-ripple-color="dark"
                          style={{ zIndex: 1 }}
                          onClick={() => {
                            setvisible(true);
                          }}
                        >
                          Edit profile
                        </button>
                      </>
                    )}
                  </div>
                  <div class="ms-3" style={{ marginTop: "130px" }}>
                    <h5>
                      {userType==="professor" ? (teacher.name.charAt(0).toUpperCase() + teacher.name.slice(1)) : (student.name.charAt(0).toUpperCase() + student.name.slice(1))}
                    </h5>
                    <p style={{ textAlign: "left", fontSize: "20px" }}>
                      {userType === "professor" ? "Teacher" : "Student"}
                    </p>
                  </div>
                </div>
                <div class="p-4 text-black bg-body-tertiary">
                  <div class="d-flex justify-content-end text-center py-1 text-body">
                    <div>
                      <p class="mb-1 h5">253</p>
                      <p class="small text-muted mb-0">Photos</p>
                    </div>
                    <div class="px-3">
                      <p class="mb-1 h5">1026</p>
                      <p class="small text-muted mb-0">Followers</p>
                    </div>
                    <div>
                      <p class="mb-1 h5">478</p>
                      <p class="small text-muted mb-0">Following</p>
                    </div>
                  </div>
                </div>
                <div class="card-body p-4 text-black">
                  <div class="mb-4  text-body">
                    <p class="lead fw-normal mb-1">Information</p>
                    <div className="p-4 bg-body-tertiary">
                      <div className="row mb-2">
                        <div className="col-4 text-start fw-bold border-end">
                          Email
                        </div>
                        <div className="col-8 text-start">{userType==="professor" ? teacher.email : student.email}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 text-start fw-bold border-end">
                          Name
                        </div>
                        <div className="col-8 text-start">{userType==="professor" ? teacher.name : student.name}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-4 text-start fw-bold border-end">
                         {userType==="professor" ? "Domaine" : "univId"} 
                        </div>
                        <div className="col-8 text-start">
                          {/* {user.domaine.join(", ")} */}
                          {userType==="professor" ? teacher.domaine.join(", ") : student.univId}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4 text-start fw-bold border-end">
                          {userType==="teacher" ? "Grade" : "Year"}
                        </div>
                        <div className="col-8 text-start">{userType==="professor" ? teacher.grade : student.year}</div>
                      </div>
                      {userType==="professor" && (
                         <div className="row">
                         <div className="col-4 text-start fw-bold border-end">
                           Adress
                         </div>
                         <div className="col-8 text-start">{teacher.address}</div>
                       </div>
                      )
                      }
                    </div>
                  </div>
                  {userType === "professor" && (
                    <button
                      className="btn btn-outline-primary btn-sm enrrol-btn addd-btn"
                      style={{
                        width: "40%",
                        height: "auto",
                        padding: "5px",
                        textAlign: "center",
                        boxSizing: "border-box",
                        marginLeft: "0px",
                        marginTop: "5px",
                        margin: "5px",
                      }}
                      onClick={() => {
                        setvisibleC(true);
                      }}
                    >
                      Add Course
                    </button>
                  )}

                  <div class="d-flex justify-content-between align-items-center mb-4 text-body">
                    <p class="lead fw-normal mb-0">
                      {userType === "professor"
                        ? "Created Courses"
                        : "Enrolle Courses"}
                    </p>
                    <p class="mb-0">
                      <a href="#!" class="text-muted">
                        Show all
                      </a>
                    </p>
                  </div>
                  <div class="row g-2">
                    <div class="col mb-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                        alt="image 1"
                        class="w-100 rounded-3"
                      />
                    </div>
                    <div class="col mb-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                        alt="image 1"
                        class="w-100 rounded-3"
                      />
                    </div>
                  </div>
                  <div class="row g-2">
                    <div class="col">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                        alt="image 1"
                        class="w-100 rounded-3"
                      />
                    </div>
                    <div class="col">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                        alt="image 1"
                        class="w-100 rounded-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          id="modal"
          isOpen={visible}
          onRequestClose={() => setvisible(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(217, 234, 253, 0.5)",
              backdropFilter: "blur(4px)",
            },
            content: {
              width: "500px",
              height: "500px",
              position: "absolute",
              left: "30%",
              top: "80px",
              borderRadius: 10,
            },
          }}
        >
          <div
            class="input-box"
            style={{ paddingLeft: "100px", paddingTop: "50px" }}
          >
            <img src="./public/register.png" className="register" alt="" />
            <header>Edit Profile </header>
            <form onSubmit={editprofile}>
              <div class="input-field">
                <input
                  type="text"
                  class="input"
                  id="Name"
                  required=""
                  autocomplete="off"
                  value={userdata.newName}
                  onChange={(e) => {
                    setuserdata({ ...userdata, newName: e.target.value });
                  }}
                />
                <label for="email">Name</label>
              </div>
              <h5 style={{ marginTop: "5px", marginBottom: "25px" }}>OR</h5>
              <div class="input-field">
                <input
                  type="password"
                  class="input"
                  id="pass"
                  required=""
                  value={userdata.oldPass}
                  onChange={(e) => {
                    setuserdata({ ...userdata, oldPass: e.target.value });
                  }}
                />
                <label for="pass">Old Password</label>
              </div>
              <div class="input-field">
                <input
                  type="password"
                  class="input"
                  id="pass"
                  required=""
                  value={userdata.newPass}
                  onChange={(e) => {
                    setuserdata({ ...userdata, newPass: e.target.value });
                  }}
                />
                <label for="pass">New Password</label>
              </div>
              <div class="input-field">
                <input type="submit" class="submit" value="Edit" />
              </div>
            </form>
          </div>
        </Modal>
        {/* this is for courses */}
        <Modal
          id="modal"
          isOpen={visibleC}
          onRequestClose={() => setvisibleC(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(217, 234, 253, 0.5)",
              backdropFilter: "blur(4px)",
            },
            content: {
              width: "500px",
              height: "500px",
              position: "absolute",
              left: "30%",
              top: "80px",
              borderRadius: 10,
            },
          }}
        >
          <div
            class="input-box"
            style={{ paddingLeft: "100px", paddingTop: "50px" }}
          >
            <img src="./public/register.png" className="register" alt="" />
            <header>Add Course </header>
            <form onSubmit={addcourse}>
              <div class="input-field">
                <input
                  type="text"
                  class="input"
                  id="email"
                  required=""
                  autocomplete="off"
                  value={coursedata.title}
                  onChange={(e) => {
                    setcoursedata({ ...coursedata, title: e.target.value });
                  }}
                />
                <label for="email">Title</label>
              </div>
              <div class="input-field">
                <input
                  type="text"
                  class="input"
                  id="pass"
                  required=""
                  value={coursedata.target}
                  onChange={(e) => {
                    setcoursedata({
                      ...coursedata,
                      target: e.target.value
                        .split(",")
                        .map((item) => item.trim()),
                    });
                  }}
                />
                <label for="pass">Target</label>
              </div>
              <div class="input-field">
                <input
                  type="text"
                  class="input"
                  id="pass"
                  required=""
                  value={coursedata.key}
                  onChange={(e) => {
                    setcoursedata({ ...coursedata, key: e.target.value });
                  }}
                />
                <label for="text">Key</label>
              </div>
              <div class="input-field">
                <input
                  type="text"
                  class="input"
                  id="pass"
                  required=""
                  value={coursedata.info}
                  onChange={(e) => {
                    setcoursedata({ ...coursedata, info: e.target.value });
                  }}
                />
                <label for="pass">Info</label>
              </div>
              <div class="input-field">
                <input
                  type="file"
                  class="input custom-file-input"
                  id="pass"
                  required=""
                  onChange={(e) => {
                    setcoursedata({ ...coursedata, image: e.target.files[0] });
                  }}
                />
                <label for="pass">Image</label>
              </div>
              <div class="input-field">
                <input
                  type="submit"
                  class="submit"

                />
              </div>
            </form>
          </div>
        </Modal>
      </section>
    </>
  );
}
