import React from "react";

// Modules
import request from "lib/request";

export default class CreateAffiliateCampaign extends React.Component {

    constructor(props) {
        super(props);

        this.state = { promotions: [], selectedPromotion: 0 };
    }

    componentWillMount() {
		request({
			url: "../api/dashboard/affiliate/promotions",
			success: (result) => this.setState(result)
		});
	}

    onSelectPromotion(id) {
        this.setState({ selectedPromotion: id });
    }

    onCreate(e) {
        e.preventDefault();

        const data = {
            code: this.refs.code.value,
            promo: this.state.selectedPromotion
        };

        request({
            url: "../api/dashboard/affiliate",
            method: "POST", data, success: (res) => {
                if (res.error) {
                    swal("Error", res.message, "error");
                }
                else {
                    location.hash = "/dashboard/affiliate/list";
                    swal("Success", res.message, "success");
                }
            }
        })
    }

    render() {
        return (
            <div className="create-campaign">
                <section className="promotions">
                    <span className="input-description">
                        Select a promotion for your campaign.
                    </span>
                
                    {this.state.promotions.map(p => {
                        return (
                            <div
                                className={"promo-campaign" + (
                                    this.state.selectedPromotion == p.id
                                    ? " selected" : ""
                                )}
                                key={p.id}
                            >
                                <a
                                    className="name"
                                    onClick={() => this.onSelectPromotion(p.id)}
                                >{p.name}</a>
                                <span className="description">{
                                    p.description
                                }</span>
                            </div>
                        )
                    })}
                </section>

                <section className="form">{
                    <form onSubmit={(e) => this.onCreate(e)}>
                        <label>Promo Code</label>
                        <span className="input-description">
                            A unique promotional code that will link this campaign to selected promotion.
                            <br />
                            Capital letters and numbers only, limited to 4-10 characters.
                        </span>
                        <input type="text" ref="code" placeholder="CODE10" />

                        <button className="btn-primary">
                            Create Campaign
                        </button>
                    </form>
                }</section>
            </div>
        );
    }

}