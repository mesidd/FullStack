import express from 'express'
import cors from 'cors' 
import connectDB from './src/db/index.js';
import User from './src/models/Users.js'
import bcrypt from 'bcrypt'

const PORT = 3000

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.listen(PORT,()=> {
  console.log("Server running at 3000")
})

app.get("/",(req,res)=> {
  res.send("<h1>Welcome to the Home page</h1>")
})

app.post('/api/login', async (req,res) => {
  const { email, password } = req.body;

  if(!email || !password){
    console.log("All fields are mandatory")
    return res.status(400).json({message: "All fields are required"})
  }

try {

  const user = await User.findOne({email});
  if(user){
    const isPasswordMatch = await bcrypt.compare(password, user.password)
  
    if(!isPasswordMatch){
      console.log("User Already Exists");
      
      return res.status(401).json({message: "User already exist"})
    }
    else{
      return res.status(200).json({message: "Login Successful"})
    }
  }

  const hashedPassword = await bcrypt.hash( password, 10 );

  const newUser = new User({email,password: hashedPassword});
  await newUser.save();
  console.log("User Registered");
  return res.status(201).json({message: "User Registered Successfully"});
  
} catch (error) {
  console.error(error)
}
})
