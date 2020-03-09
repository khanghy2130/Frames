// special landing page

import Link from 'next/link';
import HeadElement from '../components/HeadElement.js';

import '../sass/layout.scss';
import '../sass/landing.scss';

const index = () => (
	<div id='root'>
		<HeadElement pageTitle={'Frames | Collect GIFs'} />

		<main id="landing-page-main">
			<Link href="/explore"><a>Let's Go</a></Link>
		</main>
		
	</div>
);

export default index;