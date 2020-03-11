// 404 and error page

import Link from 'next/link';
import Layout from '../components/Layout.js';

const Error = ({ statusCode }) => {
  return (
  	<Layout pageTitle={`Page Not Found`} userContext={undefined}>

		<div id="error-page-div">
			<p>
		      {statusCode
		        ? `An error ${statusCode} occurred on server`
		        : 'An error occurred on client'}
		    </p>
		    <Link href="/">
		    	<a>Return Home</a>
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