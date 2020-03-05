// 404 and error page

import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout.js';

const errorMessageStyle = {
	fontSize: '2em',
	paddingTop: '10em',
	textAlign: 'center',
	width: '100%'
};

const Error = ({ statusCode }) => {
  return (
  	<Layout>
		<Head>
			<title>Error!</title>
		</Head>

		<div style={errorMessageStyle}>
			<p>
		      {statusCode
		        ? `An error ${statusCode} occurred on server`
		        : 'An error occurred on client'}
		    </p>
		    <Link href="/">
		    	<a style={{
		    		textDecoration: "underline"
		    	}}>Return Home</a>
		    </Link>
		</div>
	</Layout>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error