// Everything in Head element

import { dom, config } from "@fortawesome/fontawesome-svg-core";
import Head from 'next/head';
import logo from '../images/frames_logo.png';

config.autoAddCss = false;

export default ({ pageTitle }) => (
	<Head>
		<script src="https://kit.fontawesome.com/4f37f05942.js" 
	    crossOrigin="anonymous"></script>

	    <link href="https://fonts.googleapis.com/css?family=Offside|Ruluko&display=swap" 
	    rel="stylesheet"/>

	    <style type="text/css">{dom.css()}</style>
	    
	    <link rel="shortcut icon" href={logo} />
	    <title>{pageTitle}</title>
	</Head>
);