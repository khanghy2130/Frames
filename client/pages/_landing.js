//  landing page. doesn't use Layout component

import Link from 'next/link';
import HeadElement from '../components/HeadElement.js';

import '../sass/variables.scss';
import '../sass/pages/landing.scss';

import logo from '../images/frames_logo.png';
import fullLogo from '../images/frames_full_logo.png';

const cover = `url(${require("../images/landing/cover.jpg")})`;

const landing = () => (
	<div id='root'>
		<HeadElement pageTitle={'Frames | Collect GIFs'} />

		<main id="landing-main">
			<div id="landing-cover"
			style={{ backgroundImage: cover }}>
				<div id="logo-img-div">
					<img src={logo} alt="Logo"/>
					<img src={fullLogo} alt="Text Logo"/>
				</div>
				
				<h1>Welcome, web users!</h1>
				<p>
					Frames is a space for GIFs collectors. Let's join the community!
				</p>

				<div id="button-div">
					<Link href='/'>
						<a>
							Let's Go
							<div className="frame-button"></div>
							<div className="frame-button"></div>
						</a>
					</Link>
				</div>
			</div>


		</main>

		<footer>
            <p id="copyright-text">
                Copyright © {new Date().getFullYear()} <a target="_blank" href="http://www.hynguyen.info">Hy Nguyen</a>
                <br />
                Powered by <a target="_blank" href="https://developers.giphy.com/">GIPHY</a>
            </p>
        </footer>
	</div>
);

export default landing;