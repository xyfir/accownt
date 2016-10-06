import React from "react";

// Components
import Ads from "components/dashboard/Ads";
import Nav from "components/dashboard/Nav";
import Account from "components/dashboard/Account";
import Profiles from "components/dashboard/Profiles";
import Security from "components/dashboard/Security";
import Services from "components/dashboard/Services";
import AccessTokens from "components/dashboard/Tokens";

export default class Dashboard extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = { view: "account" };
	}
	
	render() {
		let view;

		switch(this.props.hash[2]) {
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
			<div className="dashboard">
				<Nav active={this.props.hash[2] || "account"} />
				
				{view}
			</div>
		);
	}
	
}