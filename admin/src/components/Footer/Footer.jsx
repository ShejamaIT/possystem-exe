import React from "react";
import "./footer.css";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <Container>
                <Row className="footer__row">
                    {/* Logo Section */}
                    <Col lg="4" md="6">
                        <div className="logo">
                            <h1 className="footer-logo">Shejama Group</h1>
                        </div>
                    </Col>

                    {/* Contact Section - Placed in One Row */}
                    <ListGroup className="footer__contact">
                        <ListGroupItem className="contact-item">
                                  <span>
                                    <i className="ri-map-pin-line"></i>
                                  </span>
                            <p>
                                No75,<br />
                                Sri Premarathana Mw,<br />
                                Moratumulla, Moratuwa
                            </p>
                        </ListGroupItem>
                        <ListGroupItem className="contact-item">
                                    <span>
                                        <i className="ri-phone-line"></i>
                                    </span>
                            <p>
                                +94-77 3 608 108 <br />
                                +94-71 3 608 108 <br />
                                +94-71 81 422 52
                            </p>
                        </ListGroupItem>
                        <ListGroupItem className="contact-item">
                                  <span>
                                    <i className="ri-mail-line"></i>
                                  </span>
                            <p>manjulafonseka@yahoo.com</p>
                        </ListGroupItem>
                    </ListGroup>
                    {/*<Col >*/}
                    {/*    <div className="footer__contact-container">*/}
                    {/*        */}
                    {/*    </div>*/}
                    {/*</Col>*/}
                </Row>

                {/* Copyright Section */}
                <Row>
                    <Col lg="12">
                        <p className="footer__copyright">
                            Copyright {year} developed by Author. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
