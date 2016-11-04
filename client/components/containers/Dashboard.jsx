import React from "react";

// Components
import AffiliateDashboard from "components/dashboard/affiliate/AffiliateDashboard";
import DeveloperDashboard from "components/dashboard/developer/DeveloperDashboard";
import UserDashboard from "components/dashboard/user/UserDashboard";

export default class Dashboard extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		const hash = location.hash.split('/');

		switch(this.props.hash[2]) {
			case "user":
				return <UserDashboard hash={hash} />;
			case "developer":
				return <DeveloperDashboard hash={hash} />;
			case "affiliate":
				return <AffiliateDashboard hash={hash} />;
		}
	}
	
}