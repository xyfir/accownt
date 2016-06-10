import React from "react";

// Components
import Profile from "./Profile";
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class Profiles extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			creatingProfile: false, profiles: [], message: "",
			count: 0, error: false
		};

		this._updateProfiles = this._updateProfiles.bind(this);
		this.onCreateProfile = this.onCreateProfile.bind(this);
	}
	
	componentWillMount() {
		this._updateProfiles();
	}
	
	onCreateProfile() {
		if (this.state.creatingProfile) {
			const data = {
				name: this.refs.name.value,
				email: this.refs.email.value,
				fname: this.refs.fname.value,
				lname: this.refs.lname.value,
				gender: this.refs.gender.value,
				phone: this.refs.phone.value,
				birthdate: this.refs.birthdate.value,
				address: this.refs.address.value,
				zip: this.refs.zip.value,
				region: this.refs.region.value,
				country: this.refs.country.value
			};
			
			request({
				url: "../api/dashboard/profiles/",
				method: "POST", data,
				success: (result) => {
					this.setState(result);
					this.setState({creatingProfile: false});
					this._updateProfiles();
				}
			});
		}
		else {
			this.setState({creatingProfile: true});
		}
	}

	_updateProfiles() {
		request({
			url: "../api/dashboard/profiles",
			success: (result) => this.setState(result)
		});
	}
	
	render() {
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		let createProfile;
		
		if (this.state.creatingProfile) {
			createProfile = (
				<div className="profile-create">
					<h2>Create a Profile</h2>
					<p>All fields other than profile name are optional.</p>
					<hr />

					<input type="text" placeholder="Profile Name" ref="name" />
					<input type="email" placeholder="Email" ref="email" />
					
					<br />

					<input type="text" placeholder="First Name" ref="fname" />
					<input type="text" placeholder="Last Name" ref="lname" />
					<select ref="gender">
						<option value="0">-</option>
						<option value="1">Male</option>
						<option value="2">Female</option>
						<option value="3">Other</option>
					</select>
					<input type="tel" placeholder="Phone Number" ref="phone" />
					<input type="text" placeholder="Birthdate (2020-07-31)" ref="birthdate" />
					
					<br />
					
					<input type="text" placeholder="Address" ref="address" />
					<input type="number" placeholder="Zip" ref="zip" />
					<input type="text" placeholder="Region/State/Province" ref="region" />
					<input type="text" placeholder="Country (US/CA/UK/etc)" ref="country" />
				</div>
			);
		}
	
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				{userAlert}
				
				<h2>Profiles</h2>
				<p>
					Profiles allow you to easily give services linked to your Xyfir Account access to required or optional information. 
					When linking a service to your Xyfir Account you will be able to choose a profile to for the service to access.
				</p>
				<hr />
			
				<div className="profile-list">{
					this.state.profiles.map(profile => {
						return (
							<Profile
								picture={profile.picture}
								name={profile.name}
								id={profile.profile_id}
								update={this._updateProfiles}
							/>
						);
					})
				}</div>
				
				{createProfile}
				<Button onClick={this.onCreateProfile}>Create Profile</Button>
			</div>
		);
	}
	
}