import PropTypes from "prop-types";
import { useState } from 'react';

const AvatarDiv = ({ avatar_seed }) => {
	const [avatarSeed, setAvatarSeed] = useState(avatar_seed);

	return (
		<div id="avatar-div">
			<img alt="avatar"
				src={`https://avatars.dicebear.com/v2/avataaars/${avatarSeed}.svg`}
			/>

			<div id="avatar-setting-div">
				<button id="cog-button">
					<i className="fas fa-cog" />
				</button>
			</div>
		</div>
	);
};

// check prop type
AvatarDiv.propTypes = {
	avatar_seed: PropTypes.string.isRequired
};

export default AvatarDiv;