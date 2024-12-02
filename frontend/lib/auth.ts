import CredentialsProvider  from "next-auth/providers/credentials";


export const authOptions  = {
    providers:[
        CredentialsProvider({
            name: "credentials", 
            credentials:{
                email:{label: "email" , placeholder:"asdasd",  }
            }
        })
    ]
}