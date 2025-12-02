import React from "react";
import "./auth.css"
import cour from "../../assets/register2.png"
import register from "../../assets/register.png";
export function RegisterT(){
  return<>
  <div class="wrapper">
    <div class="container main">
        <div class="row Row">
            <div class="col-md-6 side-image">
                       
            <h3>Welcome <span className="spon"> Teacher</span></h3>
                
                <img src={cour} alt="" className="imoge"/>
               
                
            </div>
            <div class="col-md-6 right">
                
                <div class="input-box">
                <img src={register} className="register" alt=""/>
                   <header>Register</header>
                   <div class="input-field">
                        <input type="text" class="input" id="email" required="" autocomplete="off"/>
                        <label for="email">Email</label> 
                    </div> 
                   <div class="input-field">
                        <input type="password" class="input" id="pass" required=""/>
                        <label for="pass">Password</label>
                    </div> 
                    <div class="input-field">
                        <input type="password" class="input" id="pass" required=""/>
                        <label for="pass">Password</label>
                    </div> 
                    <div class="input-field">
                        <input type="password" class="input" id="pass" required=""/>
                        <label for="pass">Password</label>
                    </div> 
                   <div class="input-field">
                        
                        <input type="submit" class="submit" value="Register"/>
                   </div> 
                   <div class="signin">
                    <span>Already have an account? <a href="/teacher/signin">Log in here</a></span>
                   </div>
                </div>  
            </div>
        </div>
    </div>
</div>
  </>
}