var Alert = require("../misc/Alert");
var Form = require("./CreateOrEditForm");

module.exports = React.createClass({

	getInitialState: function() {
		return { error: false, message: "" };
	},

	// Form builds object that can be accepted by API
	updateService: function(data) {
		console.log(data);
		ajax({
			url: XACC + "api/service/dashboard/" + this.props.id,
			data: data,
			method: "PUT",
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
			
				<Form buttonText="Update" submit={this.updateService} loadDataFrom={this.props.id} />
			</div>
		);
	}

});