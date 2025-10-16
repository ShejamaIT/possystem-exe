import React, { useState } from 'react';
import '../style/AuthSection.css';
import { Link , useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import Swal from "sweetalert2";

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const toggleClass = isSignUp ? 'container active' : 'container';

    const handleForgetPassword = async (contact) => {
        const result = await Swal.fire({
            title: 'Request Change Password',
            text: 'Do you want to send a password reset request?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#0a1d37',
            cancelButtonColor: '#D3D3D3',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-popup',
            },
        });

        if (result.isConfirmed) {
            try {
                const response1 = await fetch('http://localhost:5001/api/admin/main/get-eid-by-contact', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ contact }),  // wrap contact in an object
                });

                const data1 = await response1.json();

                if (!data1.success || !data1.E_Id) {
                    return await Swal.fire({
                        icon: 'error',
                        title: 'Not Found',
                        text: 'No user found with this contact number.',
                    });
                }

                const requestchange = {
                    E_Id: data1.E_Id,
                    reason: "Change Password",
                    status: "Pending",
                };

                const response = await fetch('http://localhost:5001/api/admin/main/request', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestchange),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Request Sent',
                        text: 'Your password change request has been submitted.',
                    });
                    navigate('/SignIn');
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Failed to submit request.',
                    });
                }
            } catch (error) {
                console.error('Error during request submission:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Could not connect to the server.',
                });
            }
        }
    };


    const submitLogin = async (e) => {
        e.preventDefault();
        const contact = document.getElementById("signIn-contact").value;
        const password = document.getElementById("signIn-password").value;

        const loginData = {
            contact,
            password
        };

        try {
            const response = await fetch("http://localhost:5001/api/auth/emp/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to Login user.");
                return;
            }
            toast.success("User Login successfully!");
            // Save token to local storage
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("contact", data.data.contact);
            localStorage.setItem("type", data.data.role);
            localStorage.setItem("EID", data.data.E_Id);
            const  userType = data.data.role;
            if (data.data.token) {
                // Redirect based on the user type
                if (userType === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else if (userType === 'CHASHIER') {
                    navigate('/chashier-dashboard');
                } else if (userType === 'USER') {
                    navigate('/user-dashboard');
                } else if (userType === 'DRIVER') {
                    navigate('/driver-dashboard');
                } else if (userType === 'OTHER') {
                    navigate('/it-dashboard');
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("An error occurred while signing up.");
        }
    };
    const submitSignUp = async (e) => {
        e.preventDefault();

        const password = document.getElementById("signUp-password").value;
        const role = document.getElementById("signUp-role").value;
        const contactNumber = document.getElementById("signUp-number").value;

        const signUpData = {
            password,
            role,
            contactNumber
        };


        try {
            const response = await fetch("http://localhost:5001/api/auth/emp/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signUpData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to register user.");
                return;
            }
            toast.success("User registered successfully!");
        } catch (error) {
            console.error("Signup error:", error);
            toast.error("An error occurred while signing up.");
        }
    };

    return (
        <Helmet title="Sign-in-up">
            <section id="process" className="login-process">
                <div className={toggleClass} id="container">
                    <div className="form-container sign-up-form">
                        <form id="signUpForm">
                            <h1 className="heading">Create Account</h1>
                            <span>or use your contact for registration</span>
                            <input id="signUp-number" type="text" placeholder="Contact Number" required/>
                            <input id="signUp-password" type="password" placeholder="Password" required/>
                            <select id="signUp-role" required>
                                <option value="" disabled>Select Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="CHASHIER">Chashier</option>
                            </select>

                            <div className="btn-panel">
                                <button id="signUpBtn" onClick={submitSignUp} type="submit">Sign Up</button>
                            </div>
                        </form>
                    </div>

                    <div className="form-container sign-in-form">
                        <form id="signInForm">
                            <h1 className="heading">Sign In</h1>
                            <span>or use your contact password</span>
                            <input id="signIn-contact" type="text" placeholder="Contact Number" required/>
                            <input id="signIn-password" type="password" placeholder="Password" required/>

                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const contact = document.getElementById("signIn-contact").value;
                                    if (!contact) {
                                        alert("Please enter your contact number first.");
                                    } else {
                                        handleForgetPassword(contact);
                                    }
                                }}
                            >
                                Forget Your Password?
                            </a>

                            <button id="signInBtn" onClick={submitLogin} type="submit">Sign In</button>
                        </form>
                    </div>


                    <div className="toggle-container">
                        <div className="toggle">
                            <div className="toggle-panel toggle-left-panel">
                                <h1>Welcome Back!</h1>
                                <p>Register now for a personalized experience with HelloShoes Poss Management
                                    System!</p>
                                <button className="" id="signInToggle" onClick={() => setIsSignUp(false)}>Sign In
                                </button>
                            </div>
                            <div className="toggle-panel toggle-right-panel">
                                <h1 className='text-red-300'>Hello, Officer!</h1>
                                <p className='text-white'>If you want to register to the shejama system please contact
                                    the admin!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Helmet>

    );
};

export default LoginPage;
