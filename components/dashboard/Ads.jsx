var Button = require("../forms/Button.jsx");
var Alert = require("../misc/Alert.jsx");

module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			categories: [], searchResults: [], setCategories: [],
			error: false, message: "", info: ""
		};
	},
	
	componentWillMount: function() {
		ajax({
			url: 'api/dashboard/ads',
			dataType: 'json',
			success: function(result) {
				// info
				this.setState(result);
				
				ajax({
					url: XADS + "api/pub/categories",
					dataType: "json",
					success: function(result) {
						// categories
						this.setState(result);
					}.bind(this)
				});
			}.bind(this)
		});
	},
	
	searchCategories: function() {
		results = [];
		
		this.state.categories.forEach(function(category) {
			var found = 0;
			
			if (category.indexOf(this.refs.category.value) != -1 && found < 5) {
				found++;
				results.push(category);
			}
		});
		
		this.setState({searchResults: results});
	},
	
	addCategory: function() {
		if (this.state.setCategories.indexOf(this.refs.category.value) == -1 && this.state.setCategories.length < 6) {
			this.setState({
				setCategories: this.state.setCategories.concat(this.refs.category.value)
			});
		}
	},
	
	resetCategories: function() {
		this.setState({setCategories: []});
	},
	
	update: function() {
		var data = {
			categories: this.state.setCategories,
			keywords: this.refs.keywords.value,
			gender: this.refs.gender.value,
			age: this.refs.age.value
		};
		
		if (data.categories.length > 500)
			this.setState({error: true, message: "Too many categories provided"});
		else if (data.keywords.length > 250)
			this.setState({error: true, message: "Too many keywords provided"});
		else {
			ajax({
				url: "api/dashboard/ads",
				data: data,
				method: "PUT",
				dataType: "json",
				success: function(result) {
					if (result.error) {
						this.setState({error: true, message: "Could not update profile"});
					}
				}.bind(this);
			});
		}
	},
	
	reset: function() {
		var data = {
			categories: "", keywords: "", gender: "", age: ""
		};
	
		ajax({
			url: "api/dashboard/ads",
			data: data,
			method: "PUT",
			dataType: "json",
			success: function(result) {
				if (result.error) {
					this.setState({error: true, message: "Could not reset profile"});
				}
			}.bind(this);
		});
	},
	
	render: function() {
		var userAlert;
		
		if (this.state.error)
			userAlert = <Alert type="error" title="Error!">{this.state.message}</Alert>;
		else if (this.state.message)
			userAlert = <Alert type="success" title="Success!">{this.state.message}</Alert>;
		
		return (
			<div className="dashboard-body col-sm-12 col-md-8">
				<h3>Ad Profile</h3>
				<p>
					Your ad profile is utilized across the Xyfir Network to help serve you more personalized ads that you may be interested in.
					<br />
					If this is a feature you do not want to utilize, simply leave your ad profile blank.
				</p>
			
				{userAlert}
				
				<label>Age Range</label>
				<select ref="age" defaultValue={info.age}>
					<option value="1">18-24</option>
					<option value="2">25-34</option>
					<option value="3">35-44</option>
					<option value="4">45-54</option>
					<option value="5">55-64</option>
					<option value="6">65+</option>
				</select>
				
				<label>Gender</label>
				<select ref="gender" defaultValue={info.gender}>
					<option value="1">Male</option>
					<option value="2">Female</option>
					<option value="3">Other</option>
				</select>
				
				<label>Keywords</label>
				<small>
					A comma delimited list of keywords and phrases of things you're interested in.
					<br />
					If you have to view ads, they might as well be of some interest to you.
				</small>
				<textarea ref="keywords" defaultValue={info.keywords}></textarea>
				
				<label>Categories</label>
				<small>Like keywords, select categories that interest you.</small>
				<input type="text" ref="category" onChange={this.searchCategories} />
				
				<div className="search-results">{
					this.state.searchResults.map(function(category) {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button type="primary btn-sm" onClick={this.addCategory}>Add</Button>
				<Button type="primary btn-sm" onClick={this.resetCategories}>Reset</Button>
				
				<div className="categories">{
					this.state.categories.map(function(category) {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button onClick={this.update}>Update Profile</Button>
				<Button onClick={this.reset}>Reset Profile</Button>
			</div>
		);
	}
	
});