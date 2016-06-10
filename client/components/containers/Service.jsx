import React from "react";

// Components
import Create from "../service/Create";
import Manage from "../service/Manage";
import List from "../service/List";

export default class Service extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let view;

        if (this.props.hash[3] == undefined || this.props.hash[3] == "list")
            view = <List />;
        else if (this.props.hash[3] == "create")
            view = <Create />;
        else
            view = <Manage />;

        return (
            <div>
                <nav className="nav">
                    <a href="#/service/dashboard/create" className="link-lg">
                        Create Service
                    </a>
                    <a href="#/service/dashboard/list" className="link-lg">
                        View Services
                    </a>
                </nav>

				{view}
			</div>
        );
    }

}