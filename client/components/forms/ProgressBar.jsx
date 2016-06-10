import React from "react";

export default class ProgressBar extends React.Component {
	
	render() {
		return (
			<div className="progress-bar">
				<div
					className="progress-bar-completed"
					style={{"width": this.props.completed + "%"}}
				/>
			</div>
		);
	}

}