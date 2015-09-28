var Profile = require('./Profile.jsx');
var Button = require('../forms/Button.jsx');
var Alert = require('../misc/Alert.jsx');

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			creatingProfile: false,
			profiles: [],
			message: "",
			count: 0,
			error: false
		};
	},
	
	updateProfiles: function() {
		ajax({
			url: 'api/dashboard/profiles',
			dataType: 'json',
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	componentWillMount: function() {
		this.updateProfiles();
	},
	
	createProfile: function() {
		if (this.state.creatingProfile) {
			var data = {
				name: React.findDOMNode(this.refs.name).value,
				email: React.findDOMNode(this.refs.email).value,
				fname: React.findDOMNode(this.refs.fname).value,
				lname: React.findDOMNode(this.refs.lname).value,
				gender: React.findDOMNode(this.refs.gender).value,
				phone: React.findDOMNode(this.refs.phone).value,
				birthdate: React.findDOMNode(this.refs.birthdate).value,
				address: React.findDOMNode(this.refs.address).value,
				zip: React.findDOMNode(this.refs.zip).value,
				region: React.findDOMNode(this.refs.region).value,
				country: React.findDOMNode(this.refs.country).value
			};
			
			ajax({
				url: 'api/dashboard/profiles/',
				method: 'POST',
				dataType: 'json',
				data: data,
				success: function(result) {
					this.setState(result);
					this.setState({creatingProfile: false});
					this.updateProfiles();
				}.bind(this)
			});
		}
		else {
			this.setState({creatingProfile: true});
		}
	},
	
	render: function() {
		var userAlert;
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
			
	
		var profiles = [];
		this.state.profiles.forEach(function(profile) {
			profiles.push(<Profile picture={profile.picture} name={profile.name} id={profile.profile_id} update={this.updateProfiles} />);
		}.bind(this));
		
		var createProfile;
		if (this.state.creatingProfile) {
			createProfile = 
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
				</div>;
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
			
				<div className="profile-list">
					{profiles}
				</div>
				
				{createProfile}
				<Button onClick={this.createProfile}>Create Profile</Button>
			</div>
		);
	}
	
});