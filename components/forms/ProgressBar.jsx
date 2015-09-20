module.exports = React.createClass({
	render: function() {
		return (
			<div className="progress-bar">
				<div className="progress-bar-completed" style={{"width": this.props.completed + "%"}} />
			</div>
		);
	}
});