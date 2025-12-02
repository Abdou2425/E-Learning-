import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export function Course({ course }) {
  // image uploids
  const imagePath = course.image;
  const baseURL = "http://localhost:5000/uploads/";
  const publichImage = imagePath.replace(/^.*\\uploads\\/, baseURL);
  console.log(publichImage); //
  const [visible, setvisible] = useState(false);
  const [data, setdata] = useState("");
  const [isenroll, setisenroll] = useState("");
  const navigate = useNavigate();
  console.log(course._id);
  const courseId = course._id;
  console.log(courseId);

  useEffect(() => {
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
    isenroll();
  }, [courseId]);
  async function enrollcourse(e) {
    e.preventDefault();
    const key = data;
    try {
      // Make POST request with FormData
      const { data } = await axios.post(`courses/enrollments/enroll`, {
        courseId,
        key,
      });
      toast.success(data.msg);
      console.log(data);
      navigate(`/lectures/${course._id}`);
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
  return (
    <>
      <div class="col-lg-3 col-6 mb-4">
        <div class="card card-C">
          <img src={publichImage} alt="" class="card-img-top" />
          <div class="card-body card-body-c">
            <h5 className="card-teacher" style={{marginBottom:"15px"}}>
              <i class="fa-solid fa-chalkboard-user"></i>{" "}
              {course.professor.name}
            </h5>
            {course.target.map((item, index) => (
              <h5
                className="card-teacher"
                style={{ marginTop: "8px",fontFamily:"initial" }}
                key={index}
              >
                <i className="fa-solid fa-book"></i> {item}
              </h5>
            ))}
            <h3 className="card-title">{course.title}</h3>
            <p className="card-text" style={{fontFamily:"sans-serif"}}>{course.info}</p>
            <button
              type="button"
              class="btn btn-outline-primary btn-sm enroll-btn"
              style={{
                height: "50px",
                marginTop: "5px",
                marginBottom: "5px",
                width: "80%",
              }}
              onClick={() => {
                {
                  isenroll && navigate(`/lectures/${course._id}`);
                }
                {
                  !isenroll && setvisible(true);
                }
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
                  setdata(e.target.value);
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
