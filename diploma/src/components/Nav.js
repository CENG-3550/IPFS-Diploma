import React from "react";
import "./App";
import {Link} from "react-router-dom";

function Nav() {
    const navStyle = {
        color: "white"
    };
    return (
        <nav>
            <ul className="nav-links">
                <Link style={navStyle} to="/">
                    <li>Not Pars</li>
                </Link>
                <Link style={navStyle} to="/console">
                    <li>Console</li>
                </Link>
            </ul>
        </nav>
    );
}

export default Nav;
