import React, { useState } from "react";
import { NavItem, Navbar, NavbarBrand, Nav, Collapse, NavbarToggler} from "reactstrap"
import { NavLink } from "react-router-dom";
import "./Styles/NavBar.css";


const NavBar = ({ currUser = null, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div id="NavContainer">
            <Navbar color="dark" container="fluid" full="true" dark expand >
                <NavbarBrand href="/">MusicProc</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-auto" navbar>
                        {currUser === null ?
                            <>
                                <NavItem>
                                    <NavLink to="/login" >Login</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink to="/signup">Sign Up</NavLink>
                                </NavItem>
                            </> :
                            <>
                                <NavItem>
                                    <NavLink to="/songs">Songs</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink to="/samples">Samples</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink to="/profile">Profile</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink to="/" onClick={logout} >Log out {currUser.username}</NavLink>
                                </NavItem>
                            </>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default NavBar;