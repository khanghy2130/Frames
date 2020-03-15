// layout takes in pageTitle and isAuthenticated. renders navbar and footer
// wrapping page contents in <main> with given css id

import PropTypes from "prop-types";
import Link from 'next/link';
import { useRef, useEffect } from 'react';

// components
import HeadElement from './HeadElement.js';

// styles & images
import '../sass/layout.scss';
import fullLogo from '../images/frames_full_logo.png';
import logo from '../images/frames_logo.png';

const LOGO_BREAKPOINT = 580;

const navLinks = (isAuthenticated) => {
    // logged in?
    if (isAuthenticated) return (
        <nav>
            <Link href='/'>
                <a>
                    <i className="fas fa-search"/>&nbsp;Explore
                </a>
            </Link>
            <Link href='/allProfiles'>
                <a>
                    <i className="fas fa-users"/>&nbsp;All Profiles
                </a>
            </Link>
            <Link href='/myCollections'>
                <a>
                    <i className="fas fa-th-large"/>&nbsp;My Collections
                </a>
            </Link>
            <Link href='/myProfile'>
                <a>
                    <i className="fas fa-user"/>&nbsp;My Profile
                </a>
            </Link>
        </nav>
    );
    else return (
        <nav>
            <Link href='/'>
                <a>
                    <i className="fas fa-search"/>&nbsp;Explore
                </a>
            </Link>
            <Link href='/allProfiles'>
                <a>
                    <i className="fas fa-users"/>&nbsp;All Profiles
                </a>
            </Link>
            <Link href='/login'>
                <a>
                    <i className="fas fa-sign-in-alt"/>&nbsp;Log In
                </a>
            </Link>
        </nav>
    );
};


// each page provides its contents, page title, and user object if logged in
const Layout = ({ children, pageTitle, isAuthenticated, mainCssId }) => {
    const navElement = useRef(null);
    const buttonIcons = [useRef(null), useRef(null)];
    let showingNav = false;

    const toggleNav = function(e){
        showingNav = !showingNav;

        // better than toggle()
        if (showingNav){
            navElement.current.classList.remove("hidden-nav");
        } else {
            navElement.current.classList.add("hidden-nav");
        }
        
        buttonIcons[0].current.hidden = showingNav; // down icon
        buttonIcons[1].current.hidden = !showingNav; // up icon
    };
    
    // when mounted
    useEffect(() => {
        // reset nav 
        showingNav = true; 
        toggleNav();
    });

    return (
        <div id='root'>
            <HeadElement pageTitle={pageTitle} />

            <header>
                <div id="header-bar">
                    <div id="logo-container">
                        <Link href='/landing'>
                            <picture>
                                <source media={`(max-width: ${LOGO_BREAKPOINT}px)`} 
                                srcSet={logo}/>
                                <img src={fullLogo} alt="Logo"/>
                            </picture>
                        </Link>
                    </div>

                    <button id="nav-toggler" onClick={toggleNav}>
                        <span ref={buttonIcons[0]}>
                            <i className="fas fa-angle-down"/>
                        </span>
                        <span ref={buttonIcons[1]} hidden>
                            <i className="fas fa-angle-up"/>
                        </span>
                    </button>
                </div>

                <div id="nav-div" onClick={toggleNav} className="hidden-nav" ref={navElement}>
                    {navLinks(isAuthenticated)}
                </div>
            </header>


            <main id={mainCssId}>{children}</main>


            <footer>
                <p id="copyright-text">
                    Copyright © {new Date().getFullYear()} <a target="_blank" href="http://www.hynguyen.info">Hy Nguyen</a>
                    <br />
                    Powered by <a target="_blank" href="https://developers.giphy.com/">GIPHY</a>
                </p>
            </footer>
        </div>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  pageTitle: PropTypes.string.isRequired
}

export default Layout