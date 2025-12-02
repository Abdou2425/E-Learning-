import React from "react";
import { useNavigate } from "react-router-dom";
export function Warning(){
  const navigate = useNavigate();
    return(<>
    <div class="p-4 shadow-4 rounded-3" style={{backgroundColor: "#F0F0F0",textAlign:"left",margin:"20px"}}>
    <h2>Warning!</h2>
    <p style={{fontFamily:"monospace",marginTop:"20px"}}>
     You can not access here !.
    </p>
  
    <hr class="my-4" />
  
    <p style={{fontFamily:"monospace",marginBottom:"0px"}}>
     this page is a private page , you should SIgn In from the home page to access here.
    </p>
    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-warning"  style={{width:"150px",height:"60px",fontSize:"25px"}}  onClick={() => { navigate(`/`);}}
                >
    Signin
</button>
  </div>
    </>)
}