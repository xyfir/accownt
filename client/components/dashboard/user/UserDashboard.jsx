import React from "react";

// Components
import Ads from "./Ads";
import Account from "./Account";
import Profiles from "./Profiles";
import Security from "./Security";
import Services from "./Services";
import AccessTokens from "./Tokens";

export default class UserDashboard extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		let view;

		switch(this.props.hash[3]) {
			case "security":
				view = <Security />; break;
			case "profiles":
				view = <Profiles />; break;
			case "services":
				view = <Services />; break;
			case "tokens":
				view = <AccessTokens />; break;
			case "ads":
				view = <Ads />; break;
			default:
				view = <Account />;
		}
		
		return (
			<div className="dashboard-user">
				<nav className="nav">
					<a
						href="#/dashboard/user/account"
						className="link-lg"
					>Account</a>
					<a
						href="#/dashboard/user/security"
						className="link-lg"
					>Security</a>
					<a
						href="#/dashboard/user/profiles"
						className="link-lg"
					>Profiles</a>
					<a
						href="#/dashboard/user/services"
						className="link-lg"
					>Services</a>
					<a
						href="#/dashboard/user/tokens"
						className="link-lg"
					>Tokens</a>
					<a
						href="#/dashboard/user/ads"
						className="link-lg"
					>Ads</a>
				</nav>
				
				{view}
			</div>
		);
	}
	
}