import React from "react";

export default class Nav extends React.Component {
	
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		location.hash = "/dashboard/" + this.props.children.toLowerCase();
	}

	render() {
		const active = this.props.children.toLowerCase() == this.props.active
			? " dashboard-nav-active" : "";
	
		return (
			<div className={"col-sm-12" + active} onClick={this.onClick}>
				{this.props.children}
			</div>
		);
	}
	
}