import React from "react";
import "./auth.css"
import cour from "../../assets/register2.png"
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import register from "../../assets/register.png"
// toast
import {  toast } from 'react-toastify';
import axios from "axios";
export function Register(){
    const Navigate=useNavigate()
    const[data,setdata]=useState({
        name:"",
        email:"",
        univId:"",
        year:"",
        password:""
    })
    async function registeruser(e){
       e.preventDefault()
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
               setdata({ name:"",
                email:"",
                univId:"",
                year:"",
                password:""});
               Navigate("/student/signin");
            }
         
        }catch(error){
            
                  if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    toast.error(error.response.data.err);
                    
                  }
                  console.log(error);
                  setdata({name:"",email:"",univId:"",year:"",password:""});
        }
    }
  return<>
  <div class="wrapper">
    <div class="container main">
        <div class="row Row">
            <div class="col-md-6 side-image">
                       
            <h3>Welcome <span className="spon"> Student</span></h3>
                
                <img src={cour} alt="" className="imoge"/>
               
                
            </div>
            <div class="col-md-6 right">
                
                <div class="input-box">
                <img src={register} className="register" alt=""/>
                   <header>Register</header>
                   <form onSubmit={registeruser}>
                   <div class="input-field">
                        <input type="text" class="input" id="name" required="" autocomplete="off" value={data.name} onChange={(e)=>{setdata({...data,name:e.target.value})}}/>
                        <label for="email">Name</label> 
                    </div> 
                   <div class="input-field">
                        <input type="text" class="input" id="email" required="" autocomplete="off" value={data.email} onChange={(e)=>{setdata({...data,email:e.target.value})}}/>
                        <label for="email">Email</label> 
                    </div> 
                    <div class="input-field">
                        <input type="number" class="input" id="univ-id" required="" autocomplete="off" value={data.univId} onChange={(e)=>{setdata({...data,univId:e.target.value})}}/>
                        <label for="email">univ-ID</label> 
                    </div> 
                    <div class="input-field">
                        <input type="number" class="input" id="year" required="" autocomplete="off" value={data.year} onChange={(e)=>{setdata({...data,year:e.target.value})}}/>
                        <label for="email">Year</label> 
                    </div> 
                   <div class="input-field">
                        <input type="password" class="input" id="pass" required="" value={data.password} onChange={(e)=>{setdata({...data,password:e.target.value})}}/>
                        <label for="pass">Password</label>
                    </div> 
                  
                   <div class="input-field">
                        
                        <input type="submit" class="submit" value="Register"/>
                   </div> 
                   </form>
                   <div class="signin">
                    <span>Already have an account? <a href="/student/signin">Log in here</a></span>
                   </div>
                </div>  
            </div>
        </div>
    </div>
</div>
  </>
}