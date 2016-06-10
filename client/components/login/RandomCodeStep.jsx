import React from "react";

export default class RandomCodeStep extends React.Component {
	
	render() {
		return (
			<input
				type="text"
				id="code"
				placeholder={"Security Code #" + this.props.codeNum}
			/>
		);
	}

}