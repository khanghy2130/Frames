import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo.js';

const QUERY = gql`
	query UsersQuery {
		users {
			id
			name
			email
			website
		}
	}
`;
 
const Searches = () => {
	const { error, loading, data } = useQuery(QUERY);

	if (loading || !data) {
		return <h1>loading...</h1>;
	}
	if (error){
		return <h1>Error occurred while fetching data.</h1>;
	}
	
	return (
		<div>
			{data.users.map( (user) => (
				<div key={user.id}>
					<h3>{user.name}</h3>
					<h6>{user.email}</h6>
					<p>{user.website}</p>
				</div>
			) )}
		</div>
	);
};
 
export default withApollo(Searches);