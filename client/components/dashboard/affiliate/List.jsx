import React from "react";

// Modules
import request from "lib/request";

export default class ListAffiliateCampaigns extends React.Component {

    constructor(props) {
        super(props);

        this.state = { campaigns: [] };
    }

    componentWillMount() {
		request({
			url: "../api/dashboard/affiliate",
			success: (result) => this.setState(result)
		});
	}

    onDelete(code) {
        swal({
            title: "Are you sure?",
            text: "This action cannot be undone. All unpaid earnings will be lost.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Delete"
        }, () => {
			request({
				url: "../api/dashboard/affiliate/" + code,
				method: "DELETE",
				success: (result) => {
					if (result.error) {
						setTimeout(
							() => swal("Error", "Could not delete", "error"), 1000
						);
					}
					else {
						location.reload();
					}
				}
			});
        });
    }

    render() {
        return (
            <div className="campaigns-list">
                <section className="notes">
                    <p>
                        Statistics are only for current payment cycle.
                        <br />
                        Once the next payments are sent out these values will be reset.
                    </p>
                </section>

                <section className="campaigns">{
                    this.state.campaigns.map(c => {
                        return (
                            <div className="campaign" key={c.code}>
                                <span className="code">{c.code}</span>
                                <span className="promo-name">{
                                    c.promo.name
                                }</span>
                                
                                <span className="promo-description">{
                                    c.promo.description
                                }</span>

                                <span className="signups">
                                    {c.signups} Signups
                                </span>
                                <span className="purchases">
                                    {c.purchases} Purchases
                                </span>
                                <span className="earnings">
                                    ${c.earnings} Earnings
                                </span>

                                <a
                                    title="Delete Campaign"
                                    className="icon-delete"
                                    onClick={() => this.onDelete(c.code)}
                                >Delete Campaign</a>
                            </div>
                        )
                    })
                }</section>
            </div>
        );
    }

}