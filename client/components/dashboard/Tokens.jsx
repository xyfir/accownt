import React from "react";

// Modules
import request from "lib/request";

export default class AccessTokens extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { tokens: [], services: [], loading: true };
	}
	
	componentWillMount() {
        request({
			url: "../api/dashboard/services",
			success: (result) => {
                this.setState(result);
                this._getTokens();
            }
		});
	}

    onDelete(index) {
        const token = this.state.tokens[index];

        console.log("onDelete", token);

        request({
            url: "../api/dashboard/tokens",
            method: "DELETE", data: {
                service: token.service_id, token: token.token
            }, success: (res) => {
                console.log("res", res);
                if (!res.error) this._getTokens();
            }
        });
    }

	_getTokens() {
		request({
			url: "../api/dashboard/tokens",
			success: (result) => {
                this.setState(result);

                if (this.state.loading) {
                    this.setState({ loading: false });
                }
            }
		});
	}
	
	render() {
        if (this.state.loading) return <div />;

		return (
			<div className="dashboard-body dashboard-tokens">{
                this.state.tokens.map((token, i) => {
                    return (
                        <div className="token">
                            <dl>
                                <dt>Token</dt>
                                <dd className="token-short">{token.token.substr(1, 10)}...</dd>

                                <dt>Service Name</dt>
                                <dd>{
                                    this.state.services.find(
                                        s => s.id == token.service_id
                                    ).name
                                }</dd>
                            
                                <dt>Created</dt>
                                <dd>{(new Date(token.created)).toLocaleString()}</dd>

                                <dt>Last Used</dt>
                                <dd>{(new Date(token.last_use)).toLocaleString()}</dd>

                                <dt>Expires</dt>
                                <dd>{(new Date(token.expires)).toLocaleString()}</dd>
                            </dl>

                            <button
                                className="btn-danger"
                                onClick={() => this.onDelete(i)}
                            >
                                <span className="icon-delete" />Delete Token
                            </button>
                        </div>
                    );
                })
            }</div>
		);
	}
	
}