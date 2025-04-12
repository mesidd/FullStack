// frontend

import {useState} from 'react'
import axios from 'axios'

function Login(){

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", { email, password });
      
      // const response = await axios.get(`http://localhost:3000/api/login?email=${email}&password=${password}`)

    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>

    <form onSubmit={handleSubmit}>

      <div>
        <input type="text" name="" id="email" placeholder="Enter Email Id" 
        autoComplete="off" onChange={(e)=> setEmail(e.target.value)}/> 
      </div>

      <div>
       <input type="password" name="" id="password" placeholder="Password"
       onChange={(e) => setPassword(e.target.value)}/>
      </div>

      <button id="login" type="submit">Login</button>
      </form>

    </> 
  )
}

export default Login

// backend

import express from 'express'
import cors from 'cors'
const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = 3000

app.get("/",(req,res)=> {
  res.send("<h1>Welcome to the login page</h1>")
})

const dummyUser = {
  email: "hello",
  password: "123"
};

// app.get("/api/login", (req,res)=> {

//   const {email, password}  = req.query;
app.post("/api/login", (req,res)=> {

  const {email, password}  = req.body;
  console.log(`Email: ${email} Password: ${password}`)

  if(email == dummyUser.email && password === dummyUser.password){
    console.log("Done check")
    return res.status(200).json({message: "login successfully"})
  }
  else {
    return res.status(401).json({message: "Invalid"})
  }

})

app.listen(PORT, () => {
  console.log("Server listening on 3000")
})



