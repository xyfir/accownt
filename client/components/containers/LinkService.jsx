import React from "react";

// Components
import Button from "../../forms/Button";
import Alert from "../../misc/Alert";

// Modules
import request from "../../lib/request";

export default class LinkService extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			error: false, linked: false, message: "",
			service: this.props.hash[2]
		};

		this._createSession = this._createSession.bind(this);
		this.onLink = this.onLink.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/service/" + this.state.service,
			dataType: "json",
			success: data => {
				this.setState(data);
			}
		});
	}
	
	onLink() {
		let data = {};

		if (this.refs.profile.value != 0) {
			data = {
				profile: this.refs.profile.value,
				required: this.refs.profile_allow_required.checked,
				optional: this.refs.profile_allow_optional.checked
			};
		}
		else {
			data = {
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
		}
	
		request({
			url: "../api/service/link/" + this.state.service,
			method: "POST",
			dataType: "json",
			data: data,
			success: data => {
				if (data.error) {
					this.setState(data);
				}
				else {
					this.setState(data);
					this.setState({linked: true});
					this._createSession();
				}
			}
		});
	}
	
	_createSession() {
		request({
			url: "../api/service/session/" + this.state.service,
			method: "POST",
			dataType: "json",
			success: data => {
				// Redirect user to service's login
				location.href = data.address + "?auth=" + data.auth + "&xid=" + data.xid;
			}
		});
	}
	
	render() {
		let userAlert;

		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
			
		if (this.state.linked || !this.state.service) {
			return <div>{userAlert}</div>;
		}
		else {
			let s = this.state.service;
		
			// Build arrays for definition list containing
			// <required_field><field_description>
			let requiredInfo = [];
			Object.keys(s.requested.required).forEach(key => {
				requiredInfo.push(
					<dl><dt>{key}</dt><dd>{s.requested.required[key]}</dd></dl>
				);
			});
			
			let optionalInfo = [];
			Object.keys(s.requested.optional).forEach(key => {
				optionalInfo.push(
					<dl><dt>{key}</dt><dd>{s.requested.optional[key]}</dd></dl>
				);
			});
			
			// Build array of user"s profiles to select
			let profiles = [];
			this.state.profiles.forEach(profile => {
				profiles.push(
					<option value={profile.profile_id}>{profile.name}</option>
				);
			});
		
			return (
				<div className="service-form-view">
					<h2>{s.name}</h2>
					<p>{s.description}</p>
					
					{userAlert}
					<hr />
				
					<div className="service-info service-info-required">
						<h4>required information:</h4>
						{requiredInfo}
					</div>
					<div className="service-info service-info-optional">
						{optionalInfo.length > 0 ? <h4>optional information:</h4> : ""}
						{optionalInfo}
					</div>
					
					<Button onClick={this.onLink}>Link Service</Button>
					
					<hr />
					
					<h2>Load Data From Profile</h2>
					<p>Choose a profile and {s.name} will automatically access information you allow from the profile.</p>
					<select ref="profile" className="profile-selector">
						<option value="0">-</option>
						{profiles}
					</select>
					<input type="checkbox" ref="profile_allow_required" defaultChecked={true} />Allow Access to Required Data
					<input type="checkbox" ref="profile_allow_optional"/>Allow Access to Optional Data
					
					<h3>~~ or ~~</h3>
					
					<h2>Set Custom Data</h2>
					<p>Set data that only this service will be able to access.</p>
				
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
	}
	
}