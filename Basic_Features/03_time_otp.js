import express from 'express'
import cors from 'cors' 
import connectDB from './src/db/index.js';
import User from './src/models/Users.js'
import bcrypt from 'bcrypt'
import generateOTP from './src/otp/index.js'

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

  const otp = generateOTP();
  newUser.otp = otp;
  newUser.otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await newUser.save();

  console.log(`User Registered: OTP - ${otp}`);
  return res.status(201).json({message: "User Registered Successfully"});
  
} catch (error) {
  console.error(error)
}
})

app.post('/api/login/verify',async (req,res)=> {
  const {email,otp} = req.body;
  const user = await User.findOne({email});
  const originalOTP = user.otp;

  if(Date.now() > user.otpExpiresAt){
    console.log("Otp expired")
    return res.status(410).json({message:"OTP Expired"})
  }

  if(otp === originalOTP){
    console.log("Success");
    return res.status(200).json({message:"Success"})
  }
  else{
    console.log("verification failed")
    return res.status(409).json({message: "Failed authentication"})
  }
})

