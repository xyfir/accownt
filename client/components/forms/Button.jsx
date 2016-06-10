import React from "react";

export default class Button extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { type: "primary" };
	}

	render() { 
		return (
			<button className={"btn-" + this.props.type} onClick={this.props.onClick}>
				{this.props.children}
			</button>
		);
	}

}