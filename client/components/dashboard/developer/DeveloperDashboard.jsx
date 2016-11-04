import React from "react";

// Components
import Create from "./Create";
import Manage from "./Manage";
import List from "./List";

// Modules
import request from "lib/request";

export default class DeveloperDashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
		request({
			url: "../api/dashboard/user/account",
			success: (result) => {
				if (!result.loggedIn) location.hash = "/login";
			}
		});
	}

    render() {
        let view;

        if (!this.props.hash[3] || this.props.hash[3] == "list")
            view = <List />;
        else if (this.props.hash[3] == "create")
            view = <Create />;
        else
            view = <Manage hash={this.props.hash} />;

        return (
            <div className="dashboard-developer">
                <nav className="nav">
                    <a href="#/dashboard/developer/create" className="link-lg">
                        Create Service
                    </a>
                    <a href="#/dashboard/developer/list" className="link-lg">
                        View Services
                    </a>
                </nav>

				{view}
			</div>
        );
    }

}