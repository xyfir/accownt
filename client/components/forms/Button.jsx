import React from "react";

export default class Button extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() { 
		return (
			<button
				className={"btn-" + (this.props.type || "primary")}
				onClick={this.props.onClick}
			>
				{this.props.children}
			</button>
		);
	}

}