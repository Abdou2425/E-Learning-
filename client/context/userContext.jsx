import axios from "axios";
import { createContext,useState,useEffect, Children } from "react";
export const userContext= createContext({})
export function Usercontextprovider({children}){
    const [student,setstudent]=useState(null)
    useEffect(()=>{
        if(!student){
            axios.get("student/profile").then(({data})=>{
                setstudent(data)
            })
        }
    },[student])
    //this usercontext refer to the one it declared before function
    return <userContext.Provider value={{student ,setstudent}}>
        {children} 
    </userContext.Provider>
}