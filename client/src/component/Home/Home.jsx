import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"
import cour from "../../assets/cour.png"
import student from "../../assets/student.png"
import teacher from "../../assets/teacher.png"
export function Home(){
    return <>
    {/* background */}
    <div className='background'></div>
    <div className='overlay'></div>
    {/* homepage */}
    <div class="row">
    <div class="col-lg-6 col-12"> <h1 className='head'>welcome to <br /> <span>E-learning</span> </h1> 
    <p className='p'>welcome Here where you can learn every thing at home Here where you can learn every thing at home you can start as a student or teacher where you can find all course </p>
    <Link to="/student/signin"><button type="button" class="btn btn-light"> <img src={student} alt="" class="teach-img" /> Student</button></Link>
    <Link to="/teacher/signin"><button type="button" class="btn btn-info"> <img src={teacher} alt="" class="teach-img" />Teacher</button></Link>
    </div>
    <div class="col-lg-6 col-12"> <img src={cour} alt="" className='elearn' /></div>
    </div>
    </>
}