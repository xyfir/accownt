import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class LinkService extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			linked: false, dataTab: "profile", id: this.props.hash[2]
		};

		this._createSession = this._createSession.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/service/" + this.state.id,
			success: (res) => {
				if (!res.profiles.length)
					res.dataTab = "custom";
				
				this.setState(res);
			}
		});
	}

	onChangeTab(tab) {
		this.setState({ dataTab: tab });
	}
	
	onLink(e) {
		e.preventDefault();

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
			url: "../api/service/link/" + this.state.id,
			method: "POST", data,
			success: (res) => {
				if (res.error) {
					swal("Error", res.message, "error");
				}
				else {
					this.setState({ linked: true });
					this._createSession();
				}
			}
		});
	}
	
	_createSession() {
		request({
			url: "../api/service/session/" + this.state.id,
			method: "POST", success: (data) => {
				// Redirect user to service's login
				location.href = `${data.address}?auth=${data.auth}&xid=${data.xid}`;
			}
		});
	}
	
	render() {
		if (this.state.linked || !this.state.service) {
			return <div />;
		}
		else {
			let s = this.state.service;
			console.log("state", this.state);
			return (
				<div className="link-service service-form-view">
					<h2 className="service-name">{s.name}</h2>
					<p className="service-description">{s.description}</p>

					<section className="service-info">
						<div className="required">
							<span className="title">Required Information</span>
							{Object.keys(s.requested.required).map(key => {
								return (
									<dl>
										<dt>{key}</dt>
										<dd>{s.requested.required[key]}</dd>
									</dl>
								);
							})}
						</div>
						
						<div className="optional">
							<span className="title">Optional Information</span>
							{Object.keys(s.requested.optional).length ? (
								Object.keys(s.requested.optional).map(key => {
									return (
										<dl>
											<dt>{key}</dt>
											<dd>{s.requested.optional[key]}</dd>
										</dl>
									);
								})
							) : (
								<dl>None</dl>
							)}
						</div>
					</section>

					<section className="link-service">
						<nav className="nav-bar">
							<a onClick={() => this.onChangeTab("profile")}>
								Load Data From Profile
							</a>
							<a onClick={() => this.onChangeTab("custom")}>
								Set Custom Data
							</a>
						</nav>

						{this.state.dataTab == "profile" ? (
							<form
								className="profile"
								onSubmit={(e) => this.onLink(e)}
							>
								<p>
									Choose a profile and {s.name} will automatically access information you allow from the profile.
									
									{!this.state.profiles.length ? (
										<strong>
											<br />
											You don't have any profiles to link!
										</strong>
									) : (
										<span />
									)}
								</p>
								
								<select
									ref="profile"
									className="profile-selector"
									defaultValue="0"
								>
									<option value="0">
										Select a profile
									</option>
									
									{this.state.profiles.map(profile => {
										return (
											<option value={profile.profile_id}>{
												profile.name
											}</option>
										);
									})}
								</select>
								<input
									type="checkbox"
									ref="profile_allow_required"
									defaultChecked={true}
								/>Allow Access to Required Data
								<input
									type="checkbox"
									ref="profile_allow_optional"
								/>Allow Access to Optional Data

								<Button>Link Service</Button>
							</form>
						) : this.state.dataTab == "custom" ? (
							<form
								className="custom"
								onSubmit={(e) => this.onLink(e)}
							>
								<p>
									Set data that only this service will be able to access.
								</p>
							
								<label>Email</label>
								<input type="email" ref="email" /> 
								
								<br />
								
								<label>First Name</label>
								<input type="text" ref="fname" />
								
								<label>Last Name</label>
								<input type="text" ref="lname" />
								
								<label>Gender</label>
								<select ref="gender">
									<option value="0">-</option>
									<option value="1">Male</option>
									<option value="2">Female</option>
									<option value="3">Other</option>
								</select>
								
								<label>Phone #</label>
								<input type="tel" ref="phone" />
								
								<label>Birthdate</label>
								<input type="text" ref="birthdate" />
								
								<br />
								
								<label>Address</label>
								<input type="text" ref="address" />
								
								<label>Zip Code</label>
								<input type="number" ref="zip" />
								
								<label>State/Province/Region Code</label>
								<input type="text" ref="region" />
								
								<label>Country Code</label>
								<input type="text" ref="country" />

								<Button>Link Service</Button>
							</form>
						) : (
							<div />
						)}
					</section>
				</div>
			);
		}
	}
	
}