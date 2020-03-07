import PropTypes from "prop-types";
import Link from 'next/link';
import Head from 'next/head';
import { useRef, useEffect } from 'react';

import '../sass/layout.scss';
import fullLogo from '../images/frames_full_logo.png';
import logo from '../images/frames_logo.png';

const LOGO_BREAKPOINT = 580;



const Layout = ({ children }) => {
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
        showingNav = true; toggleNav();

    });

    return (
        <div id='root'>
            <Head>
                <script src="https://kit.fontawesome.com/4f37f05942.js" 
                crossOrigin="anonymous"></script>
                <link href="https://fonts.googleapis.com/css?family=Offside|Ruluko&display=swap" 
                rel="stylesheet"/>
                <link rel="shortcut icon" href={logo} />
            </Head>

            <header>
                <div id="header-bar">
                    <div id="logo-container">
                        <Link href='/'>
                            <picture>
                                <source media={`(max-width: ${LOGO_BREAKPOINT}px)`} 
                                srcSet={logo}/>
                                <img src={fullLogo} alt="Logo"/>
                            </picture>
                        </Link>
                    </div>

                    <button id="nav-toggler" onClick={toggleNav}>
                        <span ref={buttonIcons[0]}>
                            <i className="fas fa-angle-down"></i>
                        </span>
                        <span ref={buttonIcons[1]} hidden>
                            <i className="fas fa-angle-up"></i>
                        </span>
                    </button>
                </div>

                <div id="nav-div" onClick={toggleNav} className="hidden-nav" ref={navElement}>
                    <nav>
                        <Link href='/'>
                            <a>Explore</a>
                        </Link>
                        <Link href='/AllProfiles'>
                            <a>All Profiles</a>
                        </Link>
                        <Link href='/Register?show=login'>
                            <a>Log In</a>
                        </Link>
                        <Link href='/Register?show=signup'>
                            <a>Sign Up</a>
                        </Link>

                        <Link href='/'>
                            <a>Upgrade</a>
                        </Link>
                        <Link href='/'>
                            <a>My Collections</a>
                        </Link>
                        <Link href='/'>
                            <a>My Profile</a>
                        </Link>
                    </nav>
                </div>
            </header>


            <main>{children}</main>


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
}

export default Layout