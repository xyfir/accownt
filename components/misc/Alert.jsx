module.exports = React.createClass({
	getDefaultProps: function() {
		return {type: "info"};
	},
	
	render: function() {
		return (
			<div className={"alert alert-" + this.props.type}>
				<h3>{this.props.title}</h3>
				<p>{this.props.children}</p>
			</div>
		);
	}
});