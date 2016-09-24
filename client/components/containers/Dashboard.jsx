import React from "react";

// Components
import Ads from "../dashboard/Ads";
import Nav from "../dashboard/Nav";
import Account from "../dashboard/Account";
import Profiles from "../dashboard/Profiles";
import Security from "../dashboard/Security";
import Services from "../dashboard/Services";

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