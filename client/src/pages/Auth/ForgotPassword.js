import axios from "axios";
import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useNavigate} from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
        const [email, setEmail] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [answer, setAnswer] = useState("");
        const navigate = useNavigate();

        // form function
        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:5000/api/v1/auth/forgot-password', {
          email: email,
          newPassword,
            answer}); 
            
            if (res && res.data.success){
                toast.success(res.data.message)                                
                navigate("/login");
            }else{
                toast.error(res.data.message)
            }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
        }
    };
  return (
    <Layout title="Forgot Password - Printify">
        <div className='form-container'>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail" className="form-label">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail" placeholder="Enter your email" required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputAnswer" className="form-label">Enter your Favourite Sport</label>
                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} className="form-control" id="exampleInputAnswer" placeholder="Enter your answer" required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder="Enter your password" required/>
                </div>
                
                <button type="submit" className="btn btn-primary">Reset</button>
            </form>
    
        </div>
    </Layout>
  );
};

export default ForgotPassword