import axios from "axios";
import { createContext,useState,useEffect, Children } from "react";
export const teacherContext= createContext({})
export function Teachercontextprovider({children}){
    const [teacher,setteacher]=useState(null)
    useEffect(()=>{
        if(!teacher){
            axios.get("professor/profile").then(({data})=>{
                setteacher(data)
            })
        }
    },[teacher])
    //this usercontext refer to the one it declared before function
    return <teacherContext.Provider value={{teacher ,setteacher}}>
        {children} 
    </teacherContext.Provider>
}