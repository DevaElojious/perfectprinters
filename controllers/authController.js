import JWT from 'jsonwebtoken';
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

export const registerController = async(req,res) => {
    try {
        const {name, email, password, phone, address, answer} = req.body
        // validations
        if(!name){
            return res.status(400).send({message:'Name is required'})
        }
        if(!email){
            return res.status(400).send({message:'Email is required'})
        }
        if(!password){
            return res.status(400).send({message:'Password is required'})
        }
        if(!phone){
            return res.status(400).send({message:'Phone Number is required'})
        }
        if(!address){
            return res.status(400).send({message:'Address is required'})
        }
        if(!answer){
            return res.status(400).send({message:'Answer is required'})
        }

        // checking user
        const existingUser = await userModel.findOne({email})

        // checking existing user
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already registered, Please Login'
            })
        }
        //register the user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name, email, phone, address, password:hashedPassword, answer}).save()
        res.status(201).send({
            success:true,
            message:'User Registered Successfully',
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
}

//post login
export const loginController = async(req, res) => {
    try {
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(401).send({
                success:false,
                message:'Invalid Email or Password',
            })
        }

        // check the user
        const user = await userModel.findOne({email});
        // validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registered',
            })
        }
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid Password',
            })
        }

        // create a token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn: "10d",
        });
        return res.status(200).send({
            success:true,
            message:'Login Successful!!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error
        })
    }
};

// forgotPasswordController
export const forgotPasswordController = async(req, res) => {
    try {
        const {email, answer, newPassword} = req.body
        if(!email){
            res.status(400).send({message: 'Email is required'})
        }
        if(!answer){
            res.status(400).send({message: 'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message: 'New Password is required'})
        }
        //check
        const user = await userModel.findOne({email, answer});

        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Wrong Email or Answer',
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, {password: hashed})
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:'Something went wrong',
            error
        })
    }
}

// test controller
export const testController = (req, res) => {
    try {
        res.send("Protected route");
    } catch (error) {
        console.log(error);
        res.send({error});
    }
}

//update profile
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Password is required and it should be 6 characters long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error While Updating the profile",
        error,
      });
    }
  };

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};