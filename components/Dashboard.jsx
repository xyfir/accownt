var Ads = require('./dashboard/Ads.jsx');
var Nav = require('./dashboard/Nav.jsx');
var Account = require('./dashboard/Account.jsx');
var Profiles = require('./dashboard/Profiles.jsx');
var Security = require('./dashboard/Security.jsx');
var Services = require('./dashboard/Services.jsx');

var currentView = 'account';

var Dashboard = React.createClass({
	
	getInitialState: function() {
		return {view: 'account'};
	},
	
	componentWillMount: function () {
        // Set view based on current URL
        this.routeUpdated();
    },

	// Set state.view based on current URL
    routeUpdated: function() {
        // Parse url
        var a = document.createElement('a');
        a.href = location.href;

        // Set state.view based on route
        switch (a.pathname) {
            case "/dashboard/security":
                this.setState({ view: "security" }); break;
			case "/dashboard/profiles":
                this.setState({ view: "profiles" }); break;
			case "/dashboard/services":
                this.setState({ view: "services" }); break;
			case "/dashboard/ads":
                this.setState({ view: "ads" }); break;
			default:
                this.setState({ view: "account" });
        }
    },
	
	changeView: function(route) {
		route = XACC + "dashboard/" + route;
        history.pushState({}, '', route);
        this.routeUpdated();
	},
	
	render: function() {
		var view;

		switch(this.state.view) {
			case 'account':
				view = <Account />;  break;
			case 'security':
				view = <Security />; break;
			case 'profiles':
				view = <Profiles />; break;
			case 'services':
				view = <Services />; break;
			case 'ads':
				view = <Ads />;
		}
		
		return (
			<div className="dashboard">
				<div className="dashboard-nav col-sm-12 col-md-3">
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

ReactDOM.render(<Dashboard />, $("#content"));