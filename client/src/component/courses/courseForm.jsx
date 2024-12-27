import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export function Course({ course }) {
  // image uploids  
  const imagePath = course.image;
  const baseURL = "http://localhost:5000/uploads/";
  const publichImage = imagePath.replace(/^.*\\uploads\\/, baseURL);
  console.log(publichImage);
  //
  
  const [visible, setvisible] = useState(false);
  const [data, setdata] = useState("")
  const navigate = useNavigate(); 
  function enrollcourse(e){
    e.preventDefault();
    console.log(course.key)
   if(data===course.key){
  toast.success("true")
  navigate(`/lectures/${course._id}`);
   }else{
    toast.error("false")
   }

  }
  return (
    <>
      <div class="col-lg-3 col-6 mb-4">
        <div class="card card-C">
          <img src={publichImage} alt="" class="card-img-top" />
          <div class="card-body card-body-c">
            <h5 className="card-teacher">
              <i class="fa-solid fa-chalkboard-user"></i>{" "}
              {course.professor.name}
            </h5>
            <h5 className="card-teacher" style={{ marginTop: "8px" }}>
              <i class="fa-solid fa-book"></i> {course.target.join(" ,")}
            </h5>
            <h3 className="card-title">{course.title}</h3>
            <p className="card-text">{course.info}</p>
            <button
              type="button"
              class="btn btn-outline-primary btn-sm enroll-btn"
              style={{height:"50px",marginTop:"5px",marginBottom:"5px",width:"80%"}}
              onClick={() => {
                setvisible(true);
              }}
            >
              ENROLL
            </button>
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
                  <header>Enter Key </header>
                  <form onSubmit={enrollcourse}>
                    <div class="input-field">
                      <input
                        type="text"
                        class="input"
                        id="Name"
                        required=""
                        autocomplete="off"
                        value={data}
                        onChange={(e) => {
                          setdata( e.target.value );
                        }}
                      />
                      <label for="email">Key</label>
                    </div>
                    
                    <div class="input-field">
                      <input type="submit" class="submit" value="Submit" />
                    </div>
                  </form>
                </div>
              </Modal>
    </>
  );
}
