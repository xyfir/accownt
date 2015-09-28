var Profile = require('./Profile.jsx');
var Button = require('../forms/Button.jsx');

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
			// ** Send data to server
			
			this.setState({creatingProfile: false});
		}
		else {
			this.setState({creatingProfile: true});
		}
	},
	
	render: function() {
		var userAlert;
		if (this.state.error)
			userAlert = //
		else if (this.state.message)
			userAlert = //
			
	
		var profiles = [];
		this.state.profiles.forEach(function(profile){
			profiles.push(<Profile picture={profile.picture} name={profile.name} id={profile.profile_id} update={this.updateProfiles} />);
		});
		
		var createProfile;
		if (this.state.creatingProfile) {
			createProfile = // form;
		}
	
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				{userAlert}
			
				<div className="profile-list">
					{profiles}
				</div>
				
				{createProfile}
				<Button onClick={this.createProfile}>Create Profile</Button>
			</div>
		);
	}
	
});