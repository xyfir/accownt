import React from "react";

// Components
import Create from "./Create";
import List from "./List";

export default class Profiles extends React.Component {
	
	constructor(props) {
		super(props);
	}
	
	render() {
		if (location.hash == "#/dashboard/user/profiles")
            return <List />;
        else
            return <Create />;
	}
	
}