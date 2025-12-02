import React, {useEffect,useState,useContext} from "react";
import cour from "../../assets/register2.png";
import register from "../../assets/register.png";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom";
export function AdminSignin(){
  const Navigate=useNavigate()
  const[data,setdata]=useState({password:""})
  async function adminsignin(e) {
     e.preventDefault();
        const {password } = data;
        try {
          const { data } = await axios.post("admin/login", {
            password,
          });
          localStorage.setItem("user_type","admin");
          toast.success(data.msg);
          setdata({});
          Navigate("/dashboard/user");
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            toast.error(error.response.data.err);
          }
          console.log(error);
          setdata({ email: "", password: "" });
        }
  }
    return(<>
     <div class="wrapper">
            <div class="container main">
              <div class="row Row">
                <div class="col-md-6 side-image">
                  <h3>
                    Welcome <span className="spon"> Admin</span>
                  </h3>
    
                  <img src={cour} alt="" className="imoge" />
                </div>
                <div class="col-md-6 right">
                  <div class="input-box">
                    <img src={register} className="register" alt="" />
                    <header>Sign In</header>
                    <form onSubmit={adminsignin} >
                     
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
                      <div class="input-field">
                        <input type="submit" class="submit" value="Sign In" />
                      </div>
                    </form>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>)
}