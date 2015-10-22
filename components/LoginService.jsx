var Alert = require('./misc/Alert.jsx');
var serviceId = window.location.pathname.split('/')[2];

var LoginService = React.createClass({
	
	getInitialState: function() {
		return {
			error: false,
			message: ""
		};
	},
	
	componentWillMount: function() {
		ajax({
			url: '../api/service/' + serviceId,
			dataType: 'json',
			success: function(data) {
				if (data.error && data.message.indexOf("already linked") > -1) {
					this.createSession();
				}
				else {
					// User hasn't linked service yet
					window.location.href = '../register/' + window.location.pathname.split('/')[2];
				}
			}.bind(this)
		});
	},
	
	createSession: function() {
		ajax({
			url: '../api/service/session/' + serviceId,
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				this.setState({error: false, message: "Logged in successfully."});
				
				// Send parent data object {auth,xid}
				parent.postMessage(data, data.address);
			}.bind(this)
		});
	},
	
	render: function() {
		if (this.state.message)
			return <Alert type="success" title="Success!">{this.state.message}</Alert>;
		else return <div></div>;
	}
	
});

ReactDOM.render(<LoginService />, $("#content"));