// Alert component: only renders if the message is defined
// Click Okay to close

export default ({ alertMessage, setAlertMessage }) => {

	if (!alertMessage) return (null);

	return (
		<div id="modal">
			<div>
				<h1>Alert</h1>
				<p>{alertMessage}</p>
				<button onClick={ ()=>{setAlertMessage(null)} }>
					Okay
				</button>
			</div>
		</div>
	);
};