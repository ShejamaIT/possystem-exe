import React, {useRef, useEffect, useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './Header.css';
import logo from '../../assets/images/logo.PNG';
import { Container, Row } from "reactstrap";
import { useSelector } from "react-redux";
// import Swal from 'sweetalert2';

const nav__link = [
    { path: '/dashboard' , display: 'Dashboard'},
    { path: '/all-orders', display: 'Orders' },
    { path: '/all-products', display: 'Items' },
    { path: '/all-employee', display: 'Employees' },
    { path: '/all-suppliers', display: 'Suppliers' },
    { path: '/all-customers', display: 'Customers' },
];

const NavBar = () => {
    const headerRef = useRef(null);
    const menuRef = useRef(null);
    const [logoutError, setLogoutError] = useState(null);
    const navigate = useNavigate();
    const totalQuantity = useSelector(state => state.cart.totalQuantity);

    const stickyHeaderFunc = () => {
        if (headerRef.current) {
            if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
                headerRef.current.classList.add('sticky__header');
            } else {
                headerRef.current.classList.remove('sticky__header');
            }
        }
    };

    useEffect(() => {
        stickyHeaderFunc();
        window.addEventListener('scroll', stickyHeaderFunc);
        return () => {
            window.removeEventListener('scroll', stickyHeaderFunc);
        };
    }, []);

    const menuToggle = () => {
        if (menuRef.current) {
            menuRef.current.classList.toggle('active__menu');
        }
    };

    const navigateToLogin = () => {
        navigate('/profile');
    };

    return (
        <header className="header" ref={headerRef}>
            <Container className='header'>
                <Row>
                    <div className="nav__wrapper">
                        <div className="logo">
                            <img src={logo} alt="logo" />
                            <div>
                                <h1>Shejama Group</h1>
                            </div>
                        </div>
                        <div className="navigation" ref={menuRef} onClick={menuToggle}>
                            <ul className="menu">
                                {nav__link.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        <NavLink
                                            to={item.path}
                                            className={navClass => navClass.isActive ? 'nav__active' : ''}
                                        >
                                            {item.display}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="nav__icons">
                            <span className="user_icon" onClick={navigateToLogin}>
                                <i className="ri-user-3-line"></i>
                            </span>
                            <span className="user_icon">
                                <i className='ri-settings-2-line'></i>
                            </span>
                            <div className="mobile__menu">
                                <span onClick={menuToggle}>
                                    <i className="ri-menu-line"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default NavBar;
