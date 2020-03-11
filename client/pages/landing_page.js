//  landing page

import Link from 'next/link';
import HeadElement from '../components/HeadElement.js';

import '../sass/layout.scss';
import '../sass/landing.scss';

const landing = () => (
	<div id='root'>
		<HeadElement pageTitle={'Frames | Collect GIFs'} />

		<main id="landing-page-main">
			<Link href="/"><a>Let's Go</a></Link>
		</main>
		
	</div>
);

export default landing;