var Service = require('./Service.jsx');
var Button = require('../forms/Button.jsx');

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			services: []
		};
	},
	
	updateServices: function() {
		ajax({
			url: 'api/dashboard/services',
			dataType: 'json',
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	componentWillMount: function() {
		this.updateServices();
	},
	
	render: function() {
		var services = [];
		this.state.services.forEach(function(service) {
			services.push(<Service id={service.id} update={this.updateServices} />);
		}.bind(this));
	
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				<h2>Services</h2>
				<hr />
			
				<div className="service-list">
					{services}
				</div>
			</div>
		);
	}
	
});