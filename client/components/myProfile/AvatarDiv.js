import axios from "axios";
import PropTypes from "prop-types";
import { useState, Fragment } from 'react';

const AvatarDiv = ({ avatar_seed }) => {
	const [displaySeed, setDisplaySeed] = useState(avatar_seed); // for display
	const [avatarSeed, setAvatarSeed] = useState(avatar_seed); // actual applied value
	const [showSetting, setShowSetting] = useState(false);

	// buttons functions
	const openSetting = () => {setShowSetting(true)};
	const randomizeAvatar = () => {
		// get a new seed to display
		setDisplaySeed("" + Math.ceil(Math.random() * 100000));
	};
	const applyAndClose = () => {
		setAvatarSeed(displaySeed); // update applied seed
		setShowSetting(false); // close setting

		// make a request to save the new seed
		axios.post('/myProfile/change_seed', {
			new_avatar_seed: displaySeed
		})
		.catch(err => {console.log(err)});
	};
	const cancelAndClose = () => {
		setDisplaySeed(avatarSeed); // reset seed
		setShowSetting(false); // close setting
	};

	return (
		<div id="avatar-div">
			<img alt="avatar"
				src={`https://avatars.dicebear.com/v2/avataaars/${displaySeed}.svg`}
			/>

			<div id="avatar-setting-div">
				{(!showSetting) ? (
					<button onClick={openSetting} title="Change Avatar">
						<i className="fas fa-cog" />
					</button>
				) : (
					<Fragment>
						<div>
							<button onClick={randomizeAvatar} title="Randomize">
								<i className="fas fa-random" />
							</button>
						</div>
						<div>
							<button onClick={applyAndClose} title="Apply">
								<i className="fas fa-check" />
							</button>
							<button onClick={cancelAndClose} title="Cancel">
								<i className="fas fa-times" />
							</button>
						</div>
					</Fragment>
				)}
			</div>
		</div>
	);
};

// check prop type
AvatarDiv.propTypes = {
	avatar_seed: PropTypes.string.isRequired
};

export default AvatarDiv;