import React from "react";

// Components
import Create from "./Create";
import List from "./List";

// Modules
import request from "lib/request";

export default class AffiliateDashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
		request({
			url: "../api/dashboard/user/account",
			success: (result) => {
				if (!result.loggedIn)
                    location.hash = "/login";
                else if (!result.affiliate)
                    location.hash = "/dashboard/user";
			}
		});
	}

    render() {
        return (
            <div className="dashboard-affiliate">
                <nav className="nav">
                    <a href="#/dashboard/affiliate/create" className="link-lg">
                        Create Campaign
                    </a>
                    <a href="#/dashboard/affiliate/list" className="link-lg">
                        View Campaigns
                    </a>
                </nav>
                
                {this.props.hash[3] == "create" ? (
                    <Create />
                ) : (
                    <List />
                )}
            </div>
        );
    }

}