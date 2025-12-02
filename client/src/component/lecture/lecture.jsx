import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import register from "../../assets/register.png";
// user context
import { userContext } from "../../../context/userContext";
// teacher context
import { teacherContext } from "../../../context/teacherContext";
import file from "../../assets/file.png";
import homeworkP from "../../assets/homework.png";

//warning
import { Warning } from "../warning/warning";
import studentP from "../../assets/student.png";
import teacherP from "../../assets/teacher.png";

import "./lecture.css";
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 22 },
  { id: 2, name: "Bob Smith", email: "bob@example.com", age: 25 },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 20 },
];
export function Lecture() {
  const [ID, setID] = useState("");
  const [loading, setLoading] = useState(false);
  const { student } = useContext(userContext);
  const { teacher } = useContext(teacherContext);
  const [lectures, setLectures] = useState("");
  const [lecture, setLecture] = useState("");
  const [isenroll, setisenroll] = useState("");
  const [course, setcourse] = useState("");
  const { courseId } = useParams();
  const [visible, setVisible] = useState(false);
  const [visibleS, setvisibleS] = useState(false);
  const [visibleT, setvisibleT] = useState(false);
  const [devoirs, setdevoirs] = useState("");
  const [comment, setcomment] = useState({ commentContent: "" });
  const[comments,setcomments]=useState("")
  const [data, setData] = useState({
    title: "",
    description: "",
    attachments: [],
  });
  const [dataH, setdataH] = useState({
    title: "",
    attachment: null,
  });
  const baseURL = "http://localhost:5000/lectures/";
  const baseURL2 = "http://localhost:5000/homeworks/";
  const typed = localStorage.getItem("user_type");
  useEffect(() => {
    async function fetchLectures() {
      try {
        const { data } = await axios.get(
          `courses/allLectures/${courseId}/lectures`
        );
        setLectures(data);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    }
    async function isenroll() {
      try {
        const { data } = await axios.get(
          `courses/enrollments/enrollementCheck/${courseId}`
        );
        setisenroll(data.enrolled);
      } catch (error) {
        console.error("errrrrrrr", error);
      }
    }
    async function selectedcourse() {
      try {
        const { data } = await axios.get(`courses/oneCourse/${courseId}`);
        setcourse(data);
      } catch (error) {
        console.error("Error fetching lectures:", error);
        toast.error("Failed to fetch course");
      }
    }
    isenroll();
    selectedcourse();
    fetchLectures();
    
  }, [courseId]);

  async function addLecture(e) {
    e.preventDefault();
    setLoading(true);
    const { title, description, attachments } = data;
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (attachments) {
        attachments.forEach((file) => formData.append("attachments", file)); // Append the image file
      }

      // Make POST request with FormData
      const { data } = await axios.post(
        `courses/lectures/${courseId}/newLecture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate header for file uploads
          },
        }
      );
      toast.success(data.msg);
      setLoading(false);
      console.log(data);
      setData({ title: "", description: "", attachments: null });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
      setData({ title: "", description: "", attachments: null });
    } finally {
      setLoading(false); // Stop loading
    }
  }

  //add home work
  async function addhomework(e) {
    e.preventDefault();
    const { title, attachment } = dataH;
    console.log(dataH);
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (attachment) {
        formData.append("attachment", attachment);
      }
      // Make POST request with FormData
      const { data } = await axios.post(
        `courses/submitHomework/${ID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate header for file uploads
          },
        }
      );
      toast.success(data.msg);
      setLoading(false);
      console.log(data);
      setdataH({ title: "", attachment: null });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
      setdataH({ title: "", attachment: null });
    }
  }
  // fetchlecture
  async function fetchLecture(id) {
    try {
      console.log(id);
      const { data } = await axios.get(
        `courses/oneLecture/${courseId}/${id}`,
        {}
      );
      setLecture(data);
      await getdevoirs(id);
      await getcomments(id)
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.err);
      }
      console.log(error);
    }
  }
  async function getdevoirs(id) {
    console.log("rr" + id);
    try {
      const { data } = await axios.get(`courses/getHomeworks/${id}`);
      console.log(data.homeworks[0].title + "imi");
      setdevoirs(data.homeworks);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  }
  async function getcomments(id) {
    console.log("jj" + id);
    try {
      const { data } = await axios.get(`courses/getComments/${id}`);
      console.log(data.comments[0].comment + "jili");
      setcomments(data.comments);
    } catch (error) {
      console.error("Error fetching lectures:", error);
    }
  }
  // delete lecture
  async function deletelecture(id) {
    console.log(course._id);
    console.log(id);
    try {
      const { data } = await axios.delete(
        `courses/deleteLecture/${courseId}/${id}`
      );
      toast.success(data.msg);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response);
        toast.error(error.response.data.err);
      }
      console.log(error);
    }
  }
  //add comment
  async function addcomment(id) {
    console.log(id + "cocc");
    if(typed==="professor"){
      try {
        const { commentContent } = comment;
        const { data } = await axios.post(`courses/addProfessorComment/${id}`, {
          commentContent,
        });
        toast.success(data.msg);
        console.log(data);
        setcomment({ commentContent: "" });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.err);
          console.log(error.response);
        }
        console.log(error);
      }
    }else if(typed==="student"){
      try {
        const { commentContent } = comment;
        const { data } = await axios.post(`courses/addStudentComment/${id}`, {
          commentContent,
        });
        toast.success(data.msg);
        console.log(data);
        setcomment({ commentContent: "" });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toast.error(error.response.data.err);
          console.log(error.response);
        }
        console.log(error);
      }
    }
   
  }

  if (!student && !teacher) {
    return <Warning></Warning>;
  }
  if (!isenroll) {
    <h3 style={{ color: "#000", textAlign: "center", fontFamily: "cursive" }}>
      You are not enrolled
    </h3>;
  }
  console.log(typed)
  const transformAttachmentPath = (path) =>
    path.replace(/^.*\\lectures\\/, baseURL);
  const transformdevoirePath = (path2) =>
    path2.replace(/^.*\\homeworks\\/, baseURL2);
  return (
    <>
      <div className="container-fluid f-container">
        <div className="row line">
          <div className="col-12 col-md-7 f-col">
            {/* First column (70%) */}
            {lecture.attachments && lecture.attachments.length > 0 ? (
              <>
                <h1
                  style={{
                    fontFamily: "fantasy",
                    fontSize: "30",
                    marginBottom: "20px",
                  }}
                >
                  {lecture.title}
                </h1>
                <video
                  src={transformAttachmentPath(lecture.attachments[0])}
                  width={"100%"}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  autoPlay
                  style={{}}
                ></video>

                <h4
                  style={{
                    color: "#000",
                    textAlign: "left",
                    marginTop: "30px",
                    fontFamily: "sans-serif",
                    fontSize: "40",
                    lineHeight: "1.5",
                  }}
                >
                  {lecture.description}
                </h4>
                <h2
                  style={{
                    textAlign: "left",
                    color: "red",
                    fontFamily: "sans-serif",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  Document :{" "}
                </h2>
                {lecture.attachments.length > 1 &&
                  lecture.attachments.slice(1).map((item, index) => (
                    <div
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        textAlign: "left",
                        height: "12%",
                        paddingTop: "18px",
                        width: "50%",
                        borderRadius: "10px",
                        marginBottom: "10px",
                        paddingBottom: "12px",
                      }}
                    >
                      <img src={file} alt="" className="fileg" />
                      <a
                        href={transformAttachmentPath(item)}
                        download
                        style={{
                          textDecoration: "none",
                          fontSize: "23px",
                          fontFamily: "cursive",
                        }}
                      >
                        {lecture.title} : Chapitre {index + 1}
                      </a>
                    </div>
                  ))}
                {student && (
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-outline-dark text-body"
                    data-mdb-ripple-color="dark"
                    style={{
                      zIndex: 1,
                      width: "250px",
                      fontSize: "22px",
                      height: "55px",
                    }}
                    onClick={() => {
                      setvisibleS(true);
                      setID(lecture._id);
                    }}
                  >
                    Submit Homework
                  </button>
                )}
                {teacher && (
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-outline-dark text-body"
                    data-mdb-ripple-color="dark"
                    style={{
                      zIndex: 1,
                      width: "300px",
                      fontSize: "22px",
                      height: "55px",
                    }}
                    onClick={() => {
                      setvisibleT(true);
                    }}
                  >
                    Show All Homeworks
                  </button>
                )}
                <div
                  className="max-w-md mx-auto p-4 border rounded-lg shadow-md"
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{
                      textAlign: "left",
                      color: "blue",
                      fontFamily: "cursive",
                    }}
                  >
                    Comments :
                  </h2>
                  <div className="mb-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevents the default form submission behavior (page reload)
                        addcomment(lecture._id); // Call your addcomment function
                      }}
                    >
                      <textarea
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                        placeholder="put your comment..."
                        style={{ textAlign: "left", width: "100%" }}
                        value={comment.commentContent}
                        // value={newComment}
                        onChange={(e) =>
                          setcomment({
                            ...comment,
                            commentContent: e.target.value,
                          })
                        }
                      ></textarea>
                      <br />
                      <button
                        type="submit"
                        class="btn btn-info"
                        style={{
                          textAlign: "left",
                          width: "200px",
                          height: "50px",
                          fontSize: "18px",
                          paddingLeft: "30px",
                          marginTop: "10px",
                        }}
                      >
                        Submit Comment
                      </button>
                      {comments && comments.map((e,i)=>(
                        <div
                        style={{
                          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                          textAlign: "left",
                          height: "12%",
                          paddingTop: "18px",
                          width: "70%",
                          borderRadius: "10px",
                          marginBottom: "10px",
                          paddingBottom: "12px",
                          marginTop: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "7px", // Adjust alignment of the content
                            marginBottom: "5px",
                          }}
                        >{e.student && 
                          <>
                          <img
                            src={studentP}
                            alt=""
                            style={{
                              width: "30px",
                              borderRadius: "40px",
                            }}
                          />
                          <p style={{ marginLeft: "10px", marginTop: "8px" }}>
                            {e.student.name}
                          </p>
                          </>
                        }{ e.professor &&<>
                          <img
                            src={teacherP}
                            alt=""
                            style={{
                              width: "30px",
                              borderRadius: "40px",
                            }}
                          />
                          <p style={{ marginLeft: "10px", marginTop: "8px" }}>
                            {e.professor.name}
                          </p>
                          </>
                        }
                          
                        </div>
                        <h5 style={{marginLeft:"10px",fontFamily:"cursive",color:"#00BFFF"}}>{e.comment}</h5>
                        <h6
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#6c757d",
                            textTransform: "uppercase",
                            marginBottom: "3px",
                            marginLeft: "20px",
                            marginTop: "10px",
                          }}
                        >
                       {e.date.split("T")[0] +
                    " " +
                    " " +
                    e.date.split("T")[1].split(".")[0]}
                        </h6>
                      </div>
                      ))
                      }
                    </form>
                  </div>{" "}
                </div>
              </>
            ) : (
              <h1 style={{ marginTop: "100px", fontFamily: "monospace" }}>
                Please Select a Lecture
              </h1>
            )}
          </div>
          <div className="col-12 col-md-5 s-col">
            {/* Second column (30%) */}
            {course &&
              course.professor &&
              course.professor._id &&
              teacher &&
              teacher._id &&
              course.professor._id === teacher._id && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm "
                  style={{
                    height: "50px",
                    marginTop: "5px",
                    marginBottom: "80px",
                    width: "80%",
                  }}
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  Add Lecture
                </button>
              )}

            {lectures && lectures.length > 0 ? (
              lectures.map((e, i) => (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm "
                      style={{
                        height: "50px",
                        marginTop: "5px",
                        marginBottom: "5px",
                        width: "80%",
                      }}
                      onClick={() => {
                        fetchLecture(e._id);
                        key = { i };
                      }}
                    >
                      Lecture {i + 1}
                    </button>
                    {teacher &&
                      teacher._id &&
                      course &&
                      course.professor._id === teacher._id && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm "
                          style={{
                            height: "50px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            width: "80%",
                          }}
                          onClick={() => {
                            deletelecture(e._id);
                            key = { i };
                          }}
                        >
                          Delete {i + 1}
                        </button>
                      )}
                  </div>
                </>
              ))
            ) : (
              <h3 style={{ color: "#000" }}>
                there is no lecture in this course
              </h3>
            )}
          </div>
        </div>
      </div>
      <Modal
        id="modal"
        isOpen={visible}
        onRequestClose={() => setVisible(false)}
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
          className="input-box"
          style={{ paddingLeft: "100px", paddingTop: "50px" }}
        >
          {loading && (
            <h6 style={{ color: "#000", fontFamily: "cursive" }}>Loading...</h6>
          )}
          <img src={register} className="register" alt="" />
          <header>Add Lecture </header>
          <form onSubmit={addLecture}>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="Name"
                required=""
                autoComplete="off"
                value={data.title}
                onChange={(e) => {
                  setData({ ...data, title: e.target.value });
                }}
              />
              <label htmlFor="email">Title</label>
            </div>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="Name"
                required=""
                autoComplete="off"
                value={data.description}
                onChange={(e) => {
                  setData({ ...data, description: e.target.value });
                }}
              />
              <label htmlFor="email">Description</label>
            </div>
            <div className="input-field">
              <input
                type="file"
                className="input custom-file-input"
                id="pass"
                required=""
                onChange={(e) => {
                  const videoFile = e.target.files[0];
                  if (videoFile) {
                    setData({
                      ...data,
                      attachments: [videoFile, ...data.attachments], // Add video as the first element
                    });
                  }
                }}
              />
              <label htmlFor="email">Video</label>
            </div>
            <div className="input-field">
              <input
                type="file"
                className="input custom-file-input"
                id="pass"
                required=""
                multiple // Add this attribute to allow multiple file selection
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setData({
                    ...data,
                    attachments: [data.attachments[0], ...newFiles], // Keep the first element (video) and add new files
                  });
                }}
              />
              <label htmlFor="pass">PDF</label>
            </div>

            <div className="input-field">
              <input type="submit" className="submit" value="Submit" />
            </div>
          </form>
          {loading && <p>Loading...</p>}
        </div>
      </Modal>
      {/* home work */}
      <Modal
        id="modal"
        isOpen={visibleS}
        onRequestClose={() => setvisibleS(false)}
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
          className="input-box"
          style={{ paddingLeft: "100px", paddingTop: "50px" }}
        >
          {loading && (
            <h6 style={{ color: "#000", fontFamily: "cursive" }}>Loading...</h6>
          )}
          <img src={register} className="register" alt="" />
          <header>Add HomeWork </header>
          <form onSubmit={addhomework}>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="Name"
                required=""
                autoComplete="off"
                value={dataH.title}
                onChange={(e) => {
                  setdataH({ ...dataH, title: e.target.value });
                }}
              />
              <label htmlFor="email">Title</label>
            </div>
            <div className="input-field">
              <input
                type="file"
                className="input custom-file-input"
                id="pass"
                required=""
                onChange={(e) => {
                  setdataH({
                    ...dataH,
                    attachment: e.target.files[0], // Keep the first element (video) and add new files
                  });
                }}
              />
              <label htmlFor="pass">PDF</label>
            </div>

            <div className="input-field">
              <input type="submit" className="submit" value="Submit" />
            </div>
          </form>
          {loading && <p>Loading...</p>}
        </div>
      </Modal>
      <Modal
        id="modal"
        isOpen={visibleT}
        onRequestClose={() => setvisibleT(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(217, 234, 253, 0.5)",
            backdropFilter: "blur(4px)",
          },
          content: {
            width: "700px",
            height: "1000px",
            position: "absolute",
            left: "22%",
            top: "0px",
            borderRadius: 10,
          },
        }}
      >
        <div className="" style={{ paddingLeft: "0px", paddingTop: "50px" }}>
          <header style={{ color: "blue", fontFamily: "cursive" }}>
            All HomeWorks{" "}
          </header>
          {devoirs &&
            devoirs.map((e, i) => (
              <div
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  textAlign: "left",
                  height: "12%",
                  paddingTop: "18px",
                  width: "70%",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  paddingBottom: "12px",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "7px", // Adjust alignment of the content
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={studentP}
                    alt=""
                    style={{
                      width: "30px",
                      borderRadius: "40px",
                    }}
                  />
                  <p style={{ marginLeft: "10px", marginTop: "8px" }}>
                    {e.student.name}
                  </p>
                </div>
                <img src={homeworkP} alt="" className="fileg" />
                <a
                  href={transformdevoirePath(e.attachment)}
                  download
                  style={{
                    textDecoration: "none",
                    fontSize: "23px",
                    fontFamily: "cursive",
                  }}
                >
                  {e.title}
                </a>
                <h6
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    marginBottom: "3px",
                    marginLeft: "20px",
                    marginTop: "10px",
                  }}
                >
                  {e.date.split("T")[0] +
                    " " +
                    " " +
                    e.date.split("T")[1].split(".")[0]}
                </h6>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
}
