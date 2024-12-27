import axios from "axios";
import { createContext,useState,useEffect,  } from "react";
export const courseContext= createContext({})
export function Coursescontextprovider({children}){
    const [courses,setcourses]=useState(null)
    useEffect(()=>{
        if(!courses){
            axios.get("courses/allCourses").then(({data})=>{
                setcourses(data)
            })
        }
    },[courses])
    //this usercontext refer to the one it declared before function
    return <courseContext.Provider value={{courses ,setcourses}}>
        {children} 
    </courseContext.Provider>
}