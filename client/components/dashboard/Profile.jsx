import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

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
		swal({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Delete"
        }, () => {
			request({
				url: "../api/dashboard/profiles/" + this.props.id,
				method: "DELETE",
				success: (result) => {
					if (result.error) {
						setTimeout(
							() => swal("Error", result.message, "error"), 1000
						);
					}
					else {
						this.props.update();
					}
				}
			});
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
					<Button type="secondary" onClick={this.onToggleView}>
						<span className="icon-edit" />Edit
					</Button>
					<Button type="danger" onClick={this.onDeleteProfile}>
						<span className="icon-delete" />Delete
					</Button>
				</div>
			);
		}
		else {
			const p = this.state.profile;
		
			return (
				<div className="profile-form-view">
					<a
						className="icon-close"
						onClick={this.onToggleView}
						title="Close Form"
					/>

					<h2 className="profile-name">{p.name}</h2>
				
					<label>Profile Name</label>
					<input type="text" ref="name" defaultValue={p.name} />
					
					<label>Email</label>
					<input type="email" ref="email" defaultValue={p.email} />
					
					<br />
					
					<label>First Name</label>
					<input type="text" ref="fname" defaultValue={p.fname} />
					
					<label>Last Name</label>
					<input type="text" ref="lname" defaultValue={p.lname} />
					
					<label>Gender</label>
					<select ref="gender" defaultValue={p.gender}>
						<option value="0">-</option>
						<option value="1">Male</option>
						<option value="2">Female</option>
						<option value="3">Other</option>
					</select>
					
					<label>Phone #</label>
					<input type="tel" ref="phone" defaultValue={p.phone} />
					
					<label>Birthdate</label>
					<input type="text" ref="birthdate" defaultValue={p.birthdate} />
					
					<br />
					
					<label>Address</label>
					<input type="text" ref="address" defaultValue={p.address} />
					
					<label>Zip Code</label>
					<input type="number" ref="zip" defaultValue={p.zip} />
					
					<label>State/Province/Region Code</label>
					<input type="text" ref="region" defaultValue={p.region} />
					
					<label>Country Code</label>
					<input type="text" ref="country" defaultValue={p.country} />

					<br />
					
					<Button onClick={this.onUpdateProfile}>Update Profile</Button>
				</div>
			);
		}
	}
	
}