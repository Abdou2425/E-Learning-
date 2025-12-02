import React from "react";
import "./auth.css";
import cour from "../../assets/register2.png";
import register from "../../assets/register.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
export function SigninT() {
  const Navigate = useNavigate();
  const [data, setdata] = useState({
    email: "",
    password: "",
  });
  async function loginuser(e) {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("professor/login", {
        email,
        password,
      });
      localStorage.setItem("user_type","professor");
      toast.success(data.msg);
      setdata({});
      Navigate("/profiles");
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
  return (
    <>
      <div class="wrapper">
        <div class="container main">
          <div class="row Row">
            <div class="col-md-6 side-image">
              <h3>
                Welcome <span className="spon"> Teacher</span>
              </h3>

              <img src={cour} alt="" className="imoge" />
            </div>
            <div class="col-md-6 right">
              <div class="input-box">
                <img src={register} className="register" alt="" />
                <header>Sign In</header>
                <form onSubmit={loginuser}>
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
    </>
  );
}
