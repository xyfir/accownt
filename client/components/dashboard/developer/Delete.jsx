import React from "react";

// Components
import Button from "components/forms/Button";
import Alert from "components/misc/Alert";

// Modules
import request from "lib/request";

export default class Delete extends React.Component {
	
	constructor(props) {
		super(props);

        this.state = { error: false, message: "", confirm: false };

        this.onConfirm = this.onConfirm.bind(this);
    }

    onConfirm() {
        request({
            url: "../api/service/dashboard/" + this.props.id,
            method: "DELETE", success: (res) => {
                res.confirm = true;
                this.setState(res);
            }
        });
    }

    render() {
        if (this.state.confirm) {
            return(
                <div className="delete-service">
                    <Alert
                        type={this.state.error ? "error" : "success"}
                        title={this.state.error ? "Error!" : "Success!"}
                    >
                        {this.state.message}
                    </Alert>
                </div>
            );
        }
        else {
            return(
                <div className="delete-service">
                    <Alert alert="error" title="Warning!">
                        Are you sure you want to delete this service? All users will be unlinked from your service. This action cannot be undone.
                    </Alert>
                    <Button onClick={this.onConfirm} type="danger">Delete Service</Button>
                </div>
            );
        }
    }

}