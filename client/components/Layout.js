import PropTypes from "prop-types";
import Link from 'next/link';
import Head from 'next/head';

import '../sass/layout.scss';

import fullLogo from './images/frames_full_logo.png';
import logo from './images/frames_logo.png';

const MOBILE_BREAKPOINT = 580;

const Layout = ({ children }) => {
  return (
    <div id='root'>
        <Head>
            <script src="https://kit.fontawesome.com/4f37f05942.js" crossorigin="anonymous"></script>
        </Head>

        <header>
            <div id="header-bar">
                <div id="logo-container">
                    <Link href='/'>
                        <picture>
                          <source media={`(max-width: ${MOBILE_BREAKPOINT}px)`} 
                          srcSet={logo}/>
                          <img src={fullLogo} alt="Logo"/>
                        </picture>
                    </Link>
                </div>

                <button id="nav-toggler"><i className="fas fa-ellipsis-h"></i></button>
            </div>
            

            <nav>
                <Link href='/'>
                    <a>Explore</a>
                </Link>
                <Link href='/AllProfiles'>
                    <a>Profiles</a>
                </Link>
                <Link href='/Login?show=login'>
                    <a>Log In</a>
                </Link>
                <Link href='/Login?show=signup'>
                    <a>Sign Up</a>
                </Link>
            </nav>
        </header>


        <main>{children}</main>


        <footer>
            <p id="copyright-text">
                Copyright © {new Date().getFullYear()} <a href="http://www.hynguyen.info">Hy Nguyen</a>
            </p>
        </footer>
    </div>
    )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout