var Button = require("../forms/Button");
var Alert = require("../misc/Alert");

module.exports = React.createClass({

    getInitialState: function() {
        return { error: false, message: "", confirm: false };
    },

    confirm: function() {
        ajax({
            url: XACC + "api/service/dashboard/" + this.props.id,
            method: "DELETE",
            dataType: "json",
            success: function(res) {
                res.confirm = true;
                this.setState(res);
            }.bind(this)
        });
    },

    render: function() {
        if (this.state.confirm) {
            return(
                <div className="delete-service">
                    <Alert type={this.state.error ? "error" : "success"} title={this.state.error ? "Error!" : "Success!"}>
                        {this.state.message}
                    </Alert>
                </div>
            );
        }
        else {
            return(
                <div className="delete-service">
                    <Alert alert="danger" title="Warning!">
                        Are you sure you want to delete this service? All users will be unlinked from your service. This action cannot be undone.
                    </Alert>
                    <Button onClick={this.confirm}>Delete Service</Button>
                </div>
            );
        }
    }

});