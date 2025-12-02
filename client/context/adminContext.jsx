import axios from "axios";
import { createContext,useState,useEffect, Children } from "react";
export const adminContext= createContext({})
export function Admincontextprovider({children}){
    const [admin,setadmin]=useState(null)
    useEffect(()=>{
        if(!admin){
            try{
                axios.get("admin/profile").then(({data})=>{
                    setadmin(data)
                })
            }catch(err){
                console.log("admingetprofile error")
            }
            
        }
    },[admin])
    //this usercontext refer to the one it declared before function
    return <adminContext.Provider value={{admin ,setadmin}}>
        {children} 
    </adminContext.Provider>
}