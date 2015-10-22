var Button = require('./forms/Button.jsx');
var Alert = require('./misc/Alert.jsx');

var serviceId = 0;

var LinkService = React.createClass({
	
	getInitialState: function() {
		return {
			error: false,
			linked: false,
			message: ""
		};
	},
	
	componentWillMount: function() {
		serviceId = window.location.pathname.split('/')[2];
	
		ajax({
			url: '../api/service/' + serviceId,
			dataType: 'json',
			success: function(data) {
				this.setState(data, function() {
					console.log(JSON.stringify(this.state));
				});
			}.bind(this)
		});
	},
	
	link: function() {
		if (React.findDOMNode(this.refs.profile).value != 0) {
			var data = {
				profile: React.findDOMNode(this.refs.profile).value,
				required: React.findDOMNode(this.refs.profile_allow_required).checked,
				optional: React.findDOMNode(this.refs.profile_allow_optional).checked
			};
		}
		else {
			var data = {
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
		}
	
		ajax({
			url: '../api/service/link/' + serviceId,
			method: 'POST',
			dataType: 'json',
			data: data,
			success: function(data) {
				if (data.error) {
					this.setState(data);
				}
				else {
					this.setState(data);
					this.setState({linked: true});
					this.createSession();
				}
			}.bind(this)
		});
	},
	
	createSession: function() {
		ajax({
			url: '../api/service/session/' + serviceId,
			method: 'POST',
			dataType: 'json',
			success: function(data) {
				// Send parent data object {auth,xid}
				parent.postMessage(data, data.address);
			}.bind(this)
		});
	},
	
	render: function() {
		var userAlert;
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
			
		if (this.state.linked || !this.state.service) {
			return <div>{userAlert}</div>;
		}
		else {
			var s = this.state.service;
		
			// Build arrays for definition list containing
			// <required_field><field_description>
			var requiredInfo = [];
			for (var key in s.requested.required) {
				if (!s.requested.required.hasOwnProperty(key))
					continue;
				
				requiredInfo.push(<dl><dt>{key}</dt><dd>{s.requested.required[key]}</dd></dl>);
			}
			var optionalInfo = [];
			for (var key in s.requested.optional) {
				if (!s.requested.optional.hasOwnProperty(key))
					continue;
				
				optionalInfo.push(<dl><dt>{key}</dt><dd>{s.requested.optional[key]}</dd></dl>);
			}
			
			// Build array of user's profiles to select
			var profiles = [];
			this.state.profiles.forEach(function(profile) {
				profiles.push(<option value={profile.profile_id}>{profile.name}</option>);
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
					
					<Button onClick={this.link}>Link Service</Button>
					
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
	
});

ReactDOM.render(<LinkService />, $("#content"));