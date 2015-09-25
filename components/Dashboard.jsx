var Ads = require('./dashboard/Ads.jsx');
var Nav = require('./dashboard/Nav.jsx');
var Account = require('./dashboard/Account.jsx');
var Profiles = require('./dashboard/Profiles.jsx');
var Security = require('./dashboard/Security.jsx');
var Services = require('./dashboard/Services.jsx');

var Dashboard = React.createClass({
	
	getInitialState: function() {
		return {view: 'account'};
	},
	
	changeView: function(view) {
		this.setState({view: view});
	},
	
	render: function() {
		var view;
		
		switch(this.state.view) {
			case 'account':
				view = <Account />;
				break;
			case 'security':
				view = <Security />;
				break;
			case 'profiles':
				view = <Profiles />;
				break;
			case 'services':
				view = <Services />;
				break;
			case 'ads':
				view = <Ads />;
		}
		
		return (
			<div className="dashboard">
				<div className="dashboard-nav col-sm-12 col-md-4">
					<Nav onClick={this.changeView} active={this.state.view}>Account</Nav>
					<Nav onClick={this.changeView} active={this.state.view}>Security</Nav>
					<Nav onClick={this.changeView} active={this.state.view}>Profiles</Nav>
					<Nav onClick={this.changeView} active={this.state.view}>Services</Nav>
					<Nav onClick={this.changeView} active={this.state.view}>Ads</Nav>
				</div>
				{view}
			</div>
		);
	}
	
});

React.render(<Dashboard />, $("content"));