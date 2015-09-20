module.exports = React.createClass({
	getDefaultProps: function() {
		return {type: "primary"};
	},

	render: function() { 
		return (
			<button className={"btn-" + this.props.type} onClick={this.props.onClick}>
				{this.props.children}
			</button>
		);
	}
});