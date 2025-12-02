import React, { useState } from "react";
import { useContext } from "react";
import "./course.css";
import { Course } from "./courseForm";
import { courseContext } from "../../../context/courseContext";
import { userContext } from "../../../context/userContext";
import { teacherContext } from "../../../context/teacherContext";
import { Warning } from "../warning/warning";
export const GridTemplate = () => {
  const { courses } = useContext(courseContext);
  const {student} = useContext(userContext)
  const{teacher}=useContext(teacherContext)
  
  if(!courses){
    return(  <h3 style={{ color: "#000",textAlign:"center",fontFamily:"cursive" }}>there is no courses</h3>
    )
  }
  console.log(courses)
  const elements = Array(7).fill("Web Dev");
   // Example to create multiple elements
   
  return (
    <>
      {" "}
      {/* <div className="container py-4 first-container">
        <h3 className="fw-bold text-start categorie-h">Categorie :</h3>
        <div className="row g-3 categorie-div">
          {elements.map((element, index) => (
            <div className="col-6 col-md-3" key={index}>
            <button
    className="container-style text-center p-1 categorie-elmnts" 
>
    {element}
</button>
            </div>
          ))}
        </div>
      </div> */}
      <section id="gallery">
        <div class="container">
          <div class="row">
            {courses.map((element)=> (
             <Course key={element._id} course={element} />
            ))}
          
          </div>
        </div>
      </section>
   
    </>
  );
};
