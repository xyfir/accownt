var Alert = require("../misc/Alert");
var Form = require("./CreateOrEditForm");

module.exports = React.createClass({

	getInitialState: function() {
		return { error: false, message: "" };
	},

	// Form builds object that can be accepted by API
	createService: function(data) {
		ajax({
			url: XACC + "api/service/dashboard",
			data: data,
			method: "POST",
			dataType: "json",
			success: function(res) {
				this.setState(res);
			}.bind(this)
		});
	},

	// Form handles input validation errors/notifications
	// Here we handle error/response from API
	render: function() {
		var alert;
		if (this.state.error)
			alert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message != "")
			alert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
	
		return (
			<div>
				{alert}
			
				<Form buttonText="Create Service" submit={this.createService} />
			</div>
		);
	}

});