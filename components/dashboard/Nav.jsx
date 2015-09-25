module.exports = React.createClass({
	
	click: function() {
		this.props.onClick(this.props.children.toLowerCase());
	},

	render: function() {
		var active = this.props.children.toLowerCase() == this.props.active ? " dashboard-nav-active" : "";
	
		return (
			<div className={"col-sm-12" + active} onClick={this.click}>
				{this.props.children}
			</div>
		);
	}
	
});