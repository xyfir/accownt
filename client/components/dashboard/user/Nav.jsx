import React from "react";

export default class Nav extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<nav className="dashboard-nav">
				<a
					href="#/dashboard/user/account"
					className={this.props.active == "account" ? "active" : ""}
				>Account</a>
				<a
					href="#/dashboard/user/security"
					className={this.props.active == "security" ? "active" : ""}
				>Security</a>
				<a
					href="#/dashboard/user/profiles"
					className={this.props.active == "profiles" ? "active" : ""}
				>Profiles</a>
				<a
					href="#/dashboard/user/services"
					className={this.props.active == "services" ? "active" : ""}
				>Services</a>
				<a
					href="#/dashboard/user/tokens"
					className={this.props.active == "tokens" ? "active" : ""}
				>Tokens</a>
				<a
					href="#/dashboard/user/ads"
					className={this.props.active == "ads" ? "active" : ""}
				>Ads</a>
			</nav>
		);
	}
	
}