import React from "react";

export default class Alert extends React.Component {
	
	render() {
		return (
			<div className={"alert alert-" + (this.props.type || "info")}>
				<h3>{this.props.title}</h3>
				<p>{this.props.children}</p>
			</div>
		);
	}

}