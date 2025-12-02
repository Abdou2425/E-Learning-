import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios, { Axios } from "axios";
export function CourseP({ course }) {
  const navigate = useNavigate();

  async function deletecourse(e) {
    e.preventDefault();
    console.log(course._id)
    try {
      const { data } = await axios.delete(`courses/deleteCourse/${course._id}`);
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

  // image uploids
  const imagePath = course.image;
  const baseURL = "http://localhost:5000/uploads/";
  const publichImage = imagePath.replace(/^.*\\uploads\\/, baseURL);
  console.log(publichImage);
  //
  return (
    <>
      <div class="col-lg-6 col-6 mb-4">
        <div class="card card-C">
          <img src={publichImage} alt="" class="card-img-top" />
          <div class="card-body card-body-c">
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
            <p className="card-text">{course.info}</p>
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
                navigate(`/lectures/${course._id}`);
              }}
            >
              SHOW
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm enroll-btn"
              style={{
                height: "50px",
                marginTop: "5px",
                marginBottom: "5px",
                width: "80%",
              }}
              onClick={deletecourse}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
