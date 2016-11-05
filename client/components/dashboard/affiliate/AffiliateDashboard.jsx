import React from "react";

// Components

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
                
			</div>
        );
    }

}