import React, { useContext, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Modal from "react-modal";
import coursesP from "../../assets/courses.png";
import register from "../../assets/register.png";
import "./admin.css";
import { adminContext } from "../../../context/adminContext";
import { toast } from "react-toastify";
import axios from "axios";
export function Admincourse() {
  const [loading, setLoading] = useState(false);
  const [visibleS, setvisibleS] = useState(false);
  const [ID, setID] = useState("");
  const { admin } = useContext(adminContext);
  const [visible, setVisible] = useState(false);
  const [courses, setcourses] = useState("");
  const[stats,setstats]=useState("")
  const [userdata, setuserdata] = useState({
    title: "",
    target: "",
    key: "",info:""
  });
  useEffect(() => {
    async function getcourses() {
      try {
        const { data } = await axios.get(`courses/allCourses`);
        setcourses(data);
      } catch (error) {
        console.error("errrrrrrr", error);
      }
    }
    async function getstats() {
      try {
        const { data } = await axios.get(`admin/stats`);
        setstats(data.platformStats);
      } catch (error) {
        console.error("errrrrrrr", error);
      }
    }
    getcourses();
    getstats()
  }, []);
  async function deletestudent(id) {
    try {
      const { data } = await axios.delete(`admin/deleteCourse/${id}`);
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
  async function editcourse(e) {
    e.preventDefault();
    
    const { title,target, key,info } = userdata;
    try {
      const { data } = await axios.put(`admin/editInfo/course/${ID}`, {
        title,
        target,
        key,info
      });
      toast.success(data.msg);
      console.log(data);
      setuserdata({ title: "", target: "", key: "",info:"" });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
    }
    setuserdata({ key:"" });
  }
  console.log(admin);
  console.log("cc");
  if (!admin) {
    return <h3 style={{ color: "#000" }}>you are not admin</h3>;
  }
  console.log(stats+"hr");
  return (
    <>
      <div style={{ padding: "20px", backgroundColor: "#f2f8f9" }}>
        <div className="row" style={{ marginTop: "0px" }}>
            <div className="col-md-3" >
              <div
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      number of students
                    </h6>
                    <h4
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0",
                      }}
                    >
                      {stats && stats.students}
                    </h4>
                    
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#ffa502",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`fa-duotone fa-solid fa-graduation-cap`}
                      style={{ color: "#fff", fontSize: "20px" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3" >
              <div
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      number of profs
                    </h6>
                    <h4
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0",
                      }}
                    >
                      {stats && stats.professors}
                    </h4>
                    
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#51d88a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`fa-solid fa-chalkboard-user`}
                      style={{ color: "#fff", fontSize: "20px" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3" >
              <div
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      number of courses
                    </h6>
                    <h4
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0",
                      }}
                    >
                      {stats && stats.courses}
                    </h4>
                    
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#dc3545",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`fa-solid fa-book`}
                      style={{ color: "#fff", fontSize: "20px" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3" >
              <div
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h6
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                      }}
                    >
                      number of lectures
                    </h6>
                    <h4
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        margin: "0",
                      }}
                    >
                      {stats && stats.lectures}
                    </h4>
                    
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#5C7285",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`fa-solid fa-desktop`}
                      style={{ color: "#fff", fontSize: "20px" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
        </div>
       
        <div
          style={{
            margin: "10px",
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxHeight: "600px", // Limit height
            overflowY: "auto", // Enable vertical scrolling
            scrollbarWidth: "thin",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div class="scrollbar" id="scrollbar1">
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "center",
                    }}
                  ></th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Professor
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Target
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Key
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Delete
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingBottom: "10px",
                      fontSize: "18px",
                      fontFamily: "cursive",
                    }}
                  >
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses &&
                  courses.map((element, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "25px",
                        padding: "15px",
                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                        marginBottom: "10px",
                        fontFamily: "inherit",
                        fontSize: "16px",
                      }}
                    >
                      <td style={{ marginLeft: "5px" }}>
                        <img
                          src={coursesP}
                          alt=""
                          style={{
                            width: "35px",
                            borderRadius: "40px",
                            marginLeft: "7px",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                        }}
                      >
                        {element.title}
                      </td>
                      <td style={{ padding: "10px" }}>{element.professor.name}</td>
                      <td style={{ padding: "10px" }}>{element.target.join(", ")}</td>
                      <td style={{ padding: "10px" }}>{element.key}</td>
                      <td
                        style={{
                          padding: "10px",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      >
                        <button
                          type="button"
                          class="btn btn-outline-danger btn-sm"
                          style={{
                            height: "40px",
                            margin: "0",
                            fontSize: "20px",
                            borderRadius: "20px",
                            width: "120px",
                          }}
                          onClick={() => {
                            deletestudent(element._id);
                            key = { index };
                          }}
                        >
                          DELETE
                        </button>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                        }}
                      >
                        <button
                          type="button"
                          class="btn btn-outline-warning btn-sm"
                          style={{
                            height: "40px",
                            margin: "0",
                            fontSize: "20px",
                            borderRadius: "20px",
                            width: "120px",
                          }}
                          onClick={() => {
                            setVisible(true);
                            setID(element._id);
                            console.log(ID + "hrlr");
                          }}
                        >
                          EDIT
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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
          <img src={register} className="register" alt="" />
          <header>Edit Info</header>
          <form onSubmit={editcourse}>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="Name"
                required=""
                autoComplete="off"
                value={userdata.title}
                onChange={(e) => {
                  setuserdata({ ...userdata, title: e.target.value });
                }}
              />
              <label htmlFor="email">Title</label>
            </div>
            
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="pass"
                required=""
                value={userdata.target}
                onChange={(e) => {
                  setuserdata({ ...userdata, target: e.target.value });
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
                value={userdata.key}
                onChange={(e) => {
                  setuserdata({ ...userdata, key: e.target.value });
                }}
              />
              <label for="pass">Key</label>
            </div>
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="pass"
                required=""
                value={userdata.info}
                onChange={(e) => {
                  setuserdata({ ...userdata, info: e.target.value });
                }}
              />
              <label for="pass">Info</label>
            </div>

            <div className="input-field">
              <input type="submit" className="submit" value="Submit" />
            </div>
          </form>
        </div>
      </Modal>
       
    </>
  );
}
