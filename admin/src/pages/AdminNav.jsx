import React from "react";
import { Container, Row } from "reactstrap";
import { motion } from "framer-motion";
import userIcon from '../assets/images/user-icon.png';
import logo from '../assets/images/logo.PNG';
import '../style/adminNav.css';
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const AdminNav = () => {

    return (
        <>
            <header className='admin__header'>
                <div className='admin_nav_top'>
                    <Container>
                        <div className='admin-nav-wrapper-top'>
                            <div className="logo">
                                <img src={logo} alt="logo" />
                                <div>
                                    <h2>Shejama Group</h2>
                                </div>
                            </div>
                            <div className="admin__nav-top-right">
                                <span><i className='ri-settings-2-line'></i></span>
                            </div>
                        </div>
                    </Container>
                </div>
            </header>

        </>
    );
};

export default AdminNav;
