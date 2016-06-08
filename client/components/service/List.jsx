var Button = require("../forms/Button");

module.exports = React.createClass({
	
	getInitialState: function() {
		return { services: [] };
	},
	
	componentWillMount: function() {
		var url = (window.location.href.indexOf('list') > -1 ? "../" : "") + "../api/service/dashboard";
		ajax({
			url: url,
			dataType: "json",
			success: function(res) {
				this.setState(res);
			}.bind(this)
		});
	},
	
	render: function() {
		return (
			<div className="service-list">{
				this.state.services.map(function(service) {
					return (
						<div className="service-list-view">
							<h2><a onClick={this.props.updateRoute.bind(this, service.id)}>{service.name}</a></h2>
							<Button type="secondary" onClick={this.props.updateRoute.bind(this, service.id + "/edit")}>Edit</Button>
							<Button type="danger" onClick={this.props.updateRoute.bind(this, service.id + "/delete")}>Delete</Button>
						</div>
					);
				}.bind(this))
			}</div>
		);
	}
	
});