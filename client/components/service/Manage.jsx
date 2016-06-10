import React from "react";

// Components
import Delete from "./Delete";
import Edit from "./Edit";
import View from "./View";

export default class Manage extends React.Component {

	constructor(props) {
		super(props);
	}

    render() {
		// #/service/dashboard/:id[/:action]
		const id = this.props.hash[3];

        switch (this.props.hash[4]) {
            case "edit":
                view = <Edit id={id} />; break;
            case "delete":
                view = <Delete id={id} />;
			default:
                view = <View id={id} />;
        }
		
		const hash = "#/service/dashboard/" + id;

		return (
			<div>
				<div className="nav-sub">
                    <a href={hash + "/view"} className="link-lg">View</a>
                    <a href={hash + "/edit"} className="link-lg">Edit</a>
					<a href={hash + "/delete"} className="link-lg">Delete</a>
                </div>
				
				{view}
			</div>
		);
    }

}