import React from "react";

// Components
import Profile from "./Profile";
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class ProfileList extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { profiles: [] };
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/user/profiles",
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		return (
			<div className="dashboard-body dashboard-profiles">
				<section className="info">
					<p>
						Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information.
						<br />
						When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access.
					</p>
				</section>
			
				<section className="profiles">
					<div className="profile-list">{
						this.state.profiles.map(profile => {
							return (
								<Profile
									name={profile.name}
									id={profile.profile_id}
									update={this._updateProfiles}
								/>
							);
						})
					}</div>
				</section>

				<section className="create-profile">
					<button
						className="btn-primary"
						onClick={() => location.hash += "/create"}
					>Create Profile</button>
				</section>
			</div>
		);
	}
	
}