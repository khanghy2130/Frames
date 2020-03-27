//  landing page. doesn't use Layout component

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import HeadElement from '../components/HeadElement.js';

import '../sass/variables.scss';
import '../sass/pages/landing.scss';

import logo from '../images/frames_logo.png';
import fullLogo from '../images/frames_full_logo.png';
import searchGif from '../images/landing/search.webp';
import shareGif from '../images/landing/share.gif';
import friendsGif from '../images/landing/friends.webp';
import avatarsGif from '../images/landing/avatars.gif';

const cover = `url(${require("../images/landing/cover.jpg")})`;

const landing = () => {
	const featureItems = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null)
	];

	useEffect(() => {
		// runs on client only
		if (typeof window !== 'undefined') {
			let animateCheckers = [];
			// add all feature items
			featureItems.forEach(ref => {
				console.log(ref);
				animateCheckers.push(animateChecker(ref.current, "feature-item-animated"));
			});

			// run all animate checkers when scroll
			window.onscroll = function(){
				// filter out the ones which return false as they are animated
				animateCheckers = animateCheckers.filter(checker => checker() === true);
			};
			function animateChecker(ele, className){
				return () => {
					if (isNotBelowViewport(ele)){
						ele.classList.add(className);
						console.log(ele);
						return false;
					}
					return true;
				};
			}
			function isNotBelowViewport(ele) {
			    return ele.getBoundingClientRect().bottom <= (window.innerHeight || document.documentElement.clientHeight);
			}
		}
	}, featureItems);

	return (
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
								Let's Go!
								<div className="frame-button"></div>
								<div className="frame-button"></div>
							</a>
						</Link>
					</div>
				</div>

				<div id="what-is-gif-div">
					<h1>What is a GIF?</h1>
					<p>
						The Graphics Interchange Format, or GIF, is an image format that displays the looping of multiple images.
						A GIF usually has low framerate, it can be used as a slideshow or an animated image.
						This hybrid of image and video creates its own identity, why it's so special is up to you to find out.
					</p>
				</div>

				<div id="features-container">
					<div className="feature-item" ref={ featureItems[0] }>
						<img src={searchGif} alt="search"/>
						<div>
							<h2>Discover the GIFs</h2>
							<p>Explore tons of PG rated GIFs from GIPHY database.</p>
						</div>
					</div>

					<div className="feature-item" ref={ featureItems[1] }>
						<img src={shareGif} alt="share"/>
						<div>
							<h2>Collect and share</h2>
							<p>Create custom collections with the GIFs you find.</p>
						</div>
					</div>

					<div className="feature-item" ref={ featureItems[2] }>
						<img src={friendsGif} alt="friends"/>
						<div>
							<h2>Make friends</h2>
							<p>Discover other users and make friends to see more of their collections.</p>
						</div>
					</div>

					<div className="feature-item" ref={ featureItems[3] }>
						<img src={avatarsGif} alt="avatars"/>
						<div>
							<h2>Find your avatar</h2>
							<p>With millions of combinations, DiceBear's Avataaars library would have something just for you.</p>
						</div>
					</div>
				</div>

				<div id="top-button-div">
					<a href="#top">
						Tippy Top
					</a>
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
	)
};

export default landing;