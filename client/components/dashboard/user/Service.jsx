import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

export default class Service extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			view: "list", profiles: [], service: {}, updateTab: "profile"
		};

		this._update = this._update.bind(this);
	}
	
	componentWillMount() {
		this._update();
	}

	onChangeUpdateTab(view) {
		this.setState({ updateTab: view });
	}
	
	onToggleView() {
		if (this.state.view == "list")
			this.setState({view: "full"});
		else
			this.setState({view: "list"});
	}
	
	onUnlink() {
		swal({
            title: "Are you sure?",
            text: `
				You will no longer be able to access your account with this service.
			`,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Unlink"
        }, () => {
            request({
				url: "../api/dashboard/user/services/" + this.props.id,
				method: "DELETE",
				success: (result) => {
					if (!result.error) this.props.update();
				}
			});
        });
	}
	
	onUpdateService() {
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
			url: "../api/dashboard/user/services/" + this.props.id,
			method: "PUT", data,
			success: (result) => {
				if (result.error)
					swal("Error", result.message, "error");
				else
					swal("Success", result.message, "success");
			}
		});
	}

	_update() {
		request({
			url: "../api/dashboard/user/services/" + this.props.id,
			success: (result) => {
				this.setState({service: result.service});
			}
		});
		
		request({
			url: "../api/dashboard/user/profiles",
			success: (result) => {
				this.setState({profiles: result.profiles});
			}
		});
	}
	
	render() {
		if (this.state.view == "list") {
			return (
				<div className="service-list-view">
					<h2>{this.state.service.name}</h2>

					<Button type="secondary" onClick={() => this.onToggleView()}>
						<span className="icon-edit" />Edit
					</Button>
					<Button type="danger" onClick={() => this.onUnlink()}>
						<span className="icon-delete" />Unlink
					</Button>
					<Button type="primary" onClick={
						() => window.open(this.state.service.address)
					}>
						<span className="icon-link" />Site
					</Button>
				</div>
			);
		}
		else {
			const s = this.state.service;
			
			// Create blank form object
			let form = {
				email: "", fname: "", lname: "", phone: "", birthdate: "",
				address: "", zip: "", region: "", country: "", gender: 0
			};
			
			const loadFromProfile = !!s.info.provided.profile;
			
			// If user gave service custom data
			// merge provided data while leaving unprovided fields blank
			if (!loadFromProfile)
				Object.assign(form, s.info.provided);
		
			return (
				<div className="service-form-view">
					<a
						className="icon-close"
						onClick={() => this.onToggleView()}
						title="Close Form"
					/>

					<h2 className="service-name">
						<a target="_blank" href={s.address}>{
							s.name
						}</a>
					</h2>
					
					<p className="service-description">{s.description}</p>
				
					<section className="service-info">
						<div className="required">
							<span className="title">Required Information</span>
							{Object.keys(s.info.requested.required).map(key => {
								return (
									<dl>
										<dt>{key}</dt>
										<dd>{s.info.requested.required[key]}</dd>
									</dl>
								);
							})}
						</div>
						
						<div className="optional">
							<span className="title">Optional Information</span>
							{Object.keys(s.info.requested.optional).length ? (
								Object.keys(s.info.requested.optional).map(k => {
									return (
										<dl>
											<dt>{k}</dt>
											<dd>{s.info.requested.optional[k]}</dd>
										</dl>
									);
								})
							) : (
								<dl>None</dl>
							)}
						</div>
					</section>

					<section className="update-service">
						<nav className="nav-bar">
							<a onClick={() => this.onChangeUpdateTab("profile")}>
								Load Data From Profile
							</a>
							<a onClick={() => this.onChangeUpdateTab("custom")}>
								Set Custom Data
							</a>
						</nav>

						{this.state.updateTab == "profile" ? (
							<div className="profile">
								<p>
									Choose a profile and {s.name} will automatically access information you allow from the profile.
								</p>
								
								<select
									ref="profile"
									className="profile-selector"
									defaultValue={s.info.provided.profile || 0}
								>
									<option value="0">-</option>
									{this.state.profiles.map(p => {
										return (
											<option value={p.profile_id}>{
												p.name
											}</option>
										);
									})}
								</select>

								<input
									type="checkbox"
									ref="profile_allow_required"
									defaultChecked={loadFromProfile}
								/>Allow Access to Required Data
								<input
									type="checkbox"
									ref="profile_allow_optional"
									defaultChecked={
										loadFromProfile
										&& s.info.provided.optional == "true"
										? true : false
									}
								/>Allow Access to Optional Data
							</div>
						) : this.state.updateTab == "custom" ? (
							<div className="custom">
								<p>
									Set data that only this service will be able to access.
								</p>
							
								<label>Email</label>
								<input
									type="email"
									ref="email"
									defaultValue={form.email}
								/> 
								
								<br />
								
								<label>First Name</label>
								<input
									type="text"
									ref="fname"
									defaultValue={form.fname}
								/>
								
								<label>Last Name</label>
								<input
									type="text"
									ref="lname"
									defaultValue={form.lname}
								/>
								
								<label>Gender</label>
								<select ref="gender" defaultValue={form.gender}>
									<option value="0">-</option>
									<option value="1">Male</option>
									<option value="2">Female</option>
									<option value="3">Other</option>
								</select>
								
								<label>Phone #</label>
								<input
									type="tel"
									ref="phone"
									defaultValue={form.phone}
								/>
								
								<label>Birthdate</label>
								<input
									type="text"
									ref="birthdate"
									defaultValue={form.birthdate}
								/>
								
								<br />
								
								<label>Address</label>
								<input
									type="text"
									ref="address"
									defaultValue={form.address}
								/>
								
								<label>Zip Code</label>
								<input
									type="number"
									ref="zip"
									defaultValue={form.zip}
								/>
								
								<label>State/Province/Region Code</label>
								<input
									type="text"
									ref="region"
									defaultValue={form.region}
								/>
								
								<label>Country Code</label>
								<input
									type="text"
									ref="country"
									defaultValue={form.country}
								/>
							</div>
						) : (
							<div />
						)}

						<Button onClick={() => this.onUpdateService()}>
							Update Service
						</Button>
					</section>
				</div>
			);
		}
	}
	
}