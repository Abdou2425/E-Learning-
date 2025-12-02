import React, { useContext, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Modal from "react-modal";
import studentP from "../../assets/student.png";
import register from "../../assets/register.png";
import "./admin.css";
import { adminContext } from "../../../context/adminContext";
import { toast } from "react-toastify";
import axios from "axios";
export function Adminuser() {
  const [loading, setLoading] = useState(false);
  const[stats,setstats]=useState("")
  const[data,setdata]=useState({
          name:"",
          email:"",
          univId:"",
          year:"",
          password:""
      })
  const [visibleS, setvisibleS] = useState(false);
  const [ID, setID] = useState("");
  const { admin } = useContext(adminContext);
  const [visible, setVisible] = useState(false);
  const [students, setstudents] = useState("");
  const [userdata, setuserdata] = useState({
    name: "",
    password: "",
    univId: "",
    year: "",
  });
  useEffect(() => {
    async function getstudents() {
      try {
        const { data } = await axios.get(`admin/getAllStudents`);
        setstudents(data.theStudents);
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
    getstats()
    getstudents();
  }, []);
  async function deletestudent(id) {
    try {
      const { data } = await axios.delete(`admin/deleteStudent/${id}`);
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
  async function editinfo(e) {
    e.preventDefault();
    const { name, password, univId, year } = userdata;
    try {
      const { data } = await axios.put(`admin/editInfo/student/${ID}`, {
        name,
        password,
        univId,
        year,
      });
      toast.success(data.msg);
      console.log(data);
      setuserdata({ name: "", password: "", univId: "", year: "" });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
    }
    setuserdata({ name: "", password: "", univId: "", year: "" });
  }
  //add student
  async function addstudent(e){
         e.preventDefault()
         setLoading(true)
         const{name,email,univId,year,password}=data
          try{
              const {data}=await axios.post("student/register",{
                  name,email,univId,year,password
              })
              if(data.status==="Failed"){
                  toast.error(data.message)
                  setdata({ name:"",
                      email:"",
                      univId:"",
                      year:"",
                      password:""});
              }else{
                  toast.success(data.msg)
                  setLoading(false)
                 setdata({ name:"",
                  email:"",
                  univId:"",
                  year:"",
                  password:""});
              }
           
          }catch(error){
              
                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      toast.error(error.response.data.err);
                      
                    }
                    console.log(error);
                    setdata({name:"",email:"",univId:"",year:"",password:""});
          }finally {
              setLoading(false); // Stop loading
            }
      }
  
  console.log(admin);
  console.log("cc");

  if (!admin) {
    return <h3 style={{ color: "#000" }}>you are not admin</h3>;
  }
  console.log(students);
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
            borderRadius: "10px",
          }}
          onClick={() => {
            setvisibleS(true);
          }}
        >
          Add Student
        </button>
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
                    Name
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
                    Email
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
                    univId
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
                    Year
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
                {students &&
                  students.map((element, index) => (
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
                          src={studentP}
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
                        {element.name}
                      </td>
                      <td style={{ padding: "10px" }}>{element.email}</td>
                      <td style={{ padding: "10px" }}>{element.univId}</td>
                      <td style={{ padding: "10px" }}>{element.year}</td>
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
          <form onSubmit={editinfo}>
            <div className="input-field">
              <input
                type="text"
                className="input"
                id="Name"
                required=""
                autoComplete="off"
                value={userdata.name}
                onChange={(e) => {
                  setuserdata({ ...userdata, name: e.target.value });
                }}
              />
              <label htmlFor="email">Name</label>
            </div>
            <div class="input-field">
              <input
                type="password"
                class="input"
                id="pass"
                required=""
                value={userdata.password}
                onChange={(e) => {
                  setuserdata({ ...userdata, password: e.target.value });
                }}
              />
              <label for="pass"> Password</label>
            </div>
            <div class="input-field">
              <input
                type="number"
                class="input"
                id="pass"
                required=""
                value={userdata.univId}
                onChange={(e) => {
                  setuserdata({ ...userdata, univId: e.target.value });
                }}
              />
              <label for="pass">univId</label>
            </div>
            <div class="input-field">
              <input
                type="number"
                class="input"
                id="pass"
                required=""
                value={userdata.year}
                onChange={(e) => {
                  setuserdata({ ...userdata, year: e.target.value });
                }}
              />
              <label for="pass">Year</label>
            </div>

            <div className="input-field">
              <input type="submit" className="submit" value="Submit" />
            </div>
          </form>
        </div>
      </Modal>
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
          {loading && <h6 style={{color:"#000",fontFamily:"cursive"}}>Loading...</h6>}
          <img src={register} className="register" alt="" />
          <header>Add Student </header>
          <form onSubmit={addstudent}>
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="name"
                required=""
                autocomplete="off"
                value={data.name}
                onChange={(e) => {
                  setdata({ ...data, name: e.target.value });
                }}
              />
              <label for="email">Name</label>
            </div>
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="email"
                required=""
                autocomplete="off"
                value={data.email}
                onChange={(e) => {
                  setdata({ ...data, email: e.target.value });
                }}
              />
              <label for="email">Email</label>
            </div>
            <div class="input-field">
              <input
                type="number"
                class="input"
                id="univ-id"
                required=""
                autocomplete="off"
                value={data.univId}
                onChange={(e) => {
                  setdata({ ...data, univId: e.target.value });
                }}
              />
              <label for="email">univ-ID</label>
            </div>
            <div class="input-field">
              <input
                type="number"
                class="input"
                id="year"
                required=""
                autocomplete="off"
                value={data.year}
                onChange={(e) => {
                  setdata({ ...data, year: e.target.value });
                }}
              />
              <label for="email">Year</label>
            </div>
            <div class="input-field">
              <input
                type="password"
                class="input"
                id="pass"
                required=""
                value={data.password}
                onChange={(e) => {
                  setdata({ ...data, password: e.target.value });
                }}
              />
              <label for="pass">Password</label>
            </div>

            <div className="input-field">
              <input type="submit" className="submit" value="Submit" />
            </div>
          </form>
          {loading && <p>Loading...</p>}
        </div>
      </Modal>
    </>
  );
}
