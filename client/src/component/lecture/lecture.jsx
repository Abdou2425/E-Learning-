import React, { useState } from "react";
import Modal from "react-modal";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "./lecture.css";
export function Lecture() {
  const { courseId } = useParams();
  const [visible, setvisible] = useState(false);
  const [data, setdata] = useState({
    title: "",
    description: "",
    attachments: null,
  });
  async function addlecture(e) {
    e.preventDefault();
    const { title, description, attachments } = data;
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (attachments) {
        formData.append("attachments", attachments); // Append the image file
      }

      // Make POST request with FormData
      const { data } = await axios.post(
        `courses/${courseId}/newLecture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the appropriate header for file uploads
          },
        }
      );
      toast.success(data.msg);
      console.log(data);
      setdata({ title: "", description: "", attachments: null });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.err);
        console.log(error.response);
      }
      console.log(error);
      setdata({ title: "", description: "", attachments: null });
    }
  }
  return (
    <>
      <div className="container-fluid f-container">
        <div className="row line">
          <div className="col-12 col-md-7 f-col">
            {/* First column (70%) */}
          </div>
          <div className="col-12 col-md-5 s-col">
            {/* Second column (30%) */}
            <button
              type="button"
              class="btn btn-outline-primary btn-sm "
              style={{
                height: "50px",
                marginTop: "5px",
                marginBottom: "5px",
                width: "80%",
              }}
              onClick={() => {
                setvisible(true);
              }}
            >
              Add Lecture
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
          <header>Add Lecture </header>
          <form onSubmit={addlecture}>
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="Name"
                required=""
                autocomplete="off"
                value={data.title}
                onChange={(e) => {
                  setdata({ ...data, title: e.target.value });
                }}
              />
              <label for="email">Title</label>
            </div>
            <div class="input-field">
              <input
                type="text"
                class="input"
                id="Name"
                required=""
                autocomplete="off"
                value={data.description}
                onChange={(e) => {
                  setdata({ ...data, description: e.target.value });
                }}
              />
              <label for="email">Description</label>
            </div>
            <div class="input-field">
              <input
                type="file"
                class="input custom-file-input"
                id="pass"
                required=""
                onChange={(e) => {
                  setdata({ ...data, attachments: e.target.files[0] });
                }}
              />
              <label for="email">Video</label>
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
