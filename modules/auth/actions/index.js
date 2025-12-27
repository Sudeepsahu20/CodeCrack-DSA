'use server'
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"


export const onBoardUser=async()=>{
  try {
      const user=await currentUser();
      if(!user){
        return {success:false,error:"No authenticated user found"}
      }

      const {id,firstName,lastName,imageUrl,emailAddresses}=user;
      const newUser=await db.user.upsert({
        where:{
            clerkId:id
        },
        update:{
            firstName:firstName||null,
            lastName:lastName||null,
            imageUrl:imageUrl||null,
            email:emailAddresses[0]?.emailAddress||""
        },
        create:{ 
          clerkId:id,
           firstName:firstName||null,
            lastName:lastName||null,
            imageUrl:imageUrl||null,
            email:emailAddresses[0]?.emailAddress||""
        },
      })
      return {
        success:true,
        useer:newUser,
        message:"User onboarded successfully",
      }
  } catch (error) {
     console.log("User onboarding error❌",error);
     return {
         success:false,
         error:"failed to onboard user"
     };
  }
}

export const currentUserRole=async()=>{
    
  try {
       const user=await currentUser();
       if(!user){
        return{
          success:false,
          error:"Not authenticated user found❌"
        }
      }

      const {id}=user;

        const userRole=await db.user.findUnique({
          where:{
           clerkId:id
          },
          select:{
             role:true
          }
        })
       return userRole.role;
  } catch (error) {
    console.error("Error in userRole",error);
    return {
success:false,
error:"Something went wrong in userRole"
    }
  }
}

export const getCurrentUser= async()=>{
  const user=await currentUser();

  if (!user) return null;

  const dbUser=await db.user.findUnique({
    where:{
      clerkId:user.id
    },
    select:{
      id:true
    }
  })
  return dbUser;
}