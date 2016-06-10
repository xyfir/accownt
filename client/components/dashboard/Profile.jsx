import React from "react";

// Components
import Button from "../forms/Button";
import Alert from "../misc/Alert";

// Modules
import request from "../../lib/request";

export default class Profile extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = { view: "list", profile: {} };

		this.onUpdateProfile = this.onUpdateProfile.bind(this);
		this.onDeleteProfile = this.onDeleteProfile.bind(this);
		this.onToggleView = this.onToggleView.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/profiles/" + this.props.id,
			dataType: "json",
			success: (result) => {
				this.setState({profile: result.profile});
			}
		});
	}
	
	onToggleView() {
		if (this.state.view == "list")
			this.setState({view: "full"});
		else
			this.setState({view: "list"});
	}
	
	onDeleteProfile() {
		request({
			url: "../api/dashboard/profiles/" + this.props.id,
			method: "DELETE",
			success: (result) => {
				if (!result.error)
					this.props.update();
			}
		});
	}
	
	onUpdateProfile() {
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
			url: "../api/dashboard/profiles/" + this.props.id,
			method: "PUT", data,
			success: (result) => {
				if (!result.error) this.props.update();
			}
		});
	}
	
	render() {
		if (this.state.view == "list") {
			return (
				<div className="profile-list-view">
					<h2>{this.state.profile.name}</h2>
					<Button type="secondary" onClick={this.onToggleView}>Edit</Button>
					<Button type="danger" onClick={this.onDeleteProfile}>Delete</Button>
				</div>
			);
		}
		else {
			const p = this.state.profile;
		
			return (
				<div className="profile-form-view">
					<h2>{p.name}</h2>
					<a className="link-lg" onClick={this.onToggleView}>Hide Form</a>
					<hr />
				
					<input type="text" placeholder="Profile Name" ref="name" defaultValue={p.name} />
					<input type="email" placeholder="Email" ref="email" defaultValue={p.email} />
					
					<br />
					
					<input type="text" placeholder="First Name" ref="fname" defaultValue={p.fname} />
					<input type="text" placeholder="Last Name" ref="lname" defaultValue={p.lname} />
					<select ref="gender" defaultValue={p.gender}>
						<option value="0">-</option>
						<option value="1">Male</option>
						<option value="2">Female</option>
						<option value="3">Other</option>
					</select>
					<input type="tel" placeholder="Phone Number" ref="phone" defaultValue={p.phone} />
					<input type="text" placeholder="Birthdate (2020-07-31)" ref="birthdate" defaultValue={p.birthdate} />
					
					<br />
					
					<input type="text" placeholder="Address" ref="address" defaultValue={p.address} />
					<input type="number" placeholder="Zip" ref="zip" defaultValue={p.zip} />
					<input type="text" placeholder="Region/State/Province" ref="region" defaultValue={p.region} />
					<input type="text" placeholder="Country (US/CA/UK/etc)" ref="country" defaultValue={p.country} />
					
					<Button onClick={this.onUpdateProfile}>Update Profile</Button>
				</div>
			);
		}
	}
	
}