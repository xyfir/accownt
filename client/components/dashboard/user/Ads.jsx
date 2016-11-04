import React from "react";

// Components
import Button from "components/forms/Button";

// Modules
import request from "lib/request";

// Constants
import { XADS } from "constants/config";

export default class Ads extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			categories: [], searchResults: [], setCategories: [], info: ""
		};

		this.onSearchCategories = this.onSearchCategories.bind(this);
		this.onResetCategories = this.onResetCategories.bind(this);
		this.onAddCategory = this.onAddCategory.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onReset = this.onReset.bind(this);
	}
	
	componentWillMount() {
		request({
			url: "../api/dashboard/user/ads",
			success: result => {
				// Set value of setCategories if user has categories set
				if (result.info != "") {
					let temp = JSON.parse(result.info);
					if (temp.categories)
						this.setState({setCategories: temp.categories});
				}
	
				// info
				this.setState(result);
				
				request({
					url: XADS + "api/pub/categories",
					success: result => {
						// categories
						this.setState(result);
					}
				});
			}
		});
	}
	
	onSearchCategories() {
		let results = [];
		
		this.state.categories.forEach(category => {
			let found = 0;
			
			if (category.indexOf(this.refs.category.value) != -1 && found < 5) {
				found++;
				results.push(category);
			}
		});
		
		this.setState({ searchResults: results });
	}
	
	onAddCategory() {
		if (
			this.state.setCategories.indexOf(this.refs.category.value) == -1
			&& this.state.setCategories.length < 6
		) {
			this.setState({
				setCategories: this.state.setCategories.concat(
					this.refs.category.value
				)
			});
		}
	}
	
	onResetCategories() {
		this.setState({ setCategories: [] });
	}
	
	onUpdate() {
		const data = {
			categories: this.state.setCategories.join(","),
			keywords: this.refs.keywords.value,
			gender: this.refs.gender.value,
			age: this.refs.age.value
		};

		if (data.categories.length > 500)
			this._alert(true, "Too many categories provided");
		else if (data.keywords.length > 250)
			this._alert(true, "Too many keywords provided");
		else {
			request({
				url: "../api/dashboard/user/ads",
				data: data,
				method: "PUT",
				success: result => this._alert(result.error, result.message)
			});
		}
	}
	
	onReset() {
		const data = {
			categories: "", keywords: "", gender: "", age: ""
		};
	
		request({
			url: "../api/dashboard/user/ads",
			data: data,
			method: "PUT",
			success: result => this._alert(result.error, result.message)
		});
	}

	_alert(error, message) {
		if (error)
			swal("Error", message, "error");
		else
			swal("Success", message, "success");
	}
	
	render() {
		const i = this.state.info == "" ? "" : JSON.parse(this.state.info);
	
		const info = {
			age: i.age || "",
			gender: i.gender || "",
			keywords: i.keywords || ""
		};
		
		return (
			<div className="dashboard-body dashboard-ads">
				<p>
					Your ad profile is utilized across the Xyfir Network to help serve you more personalized ads that you may be interested in.
					<br />
					If this is a feature you do not want to utilize, simply leave your ad profile blank.
				</p>
				
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
				<input type="text" ref="category" onChange={this.onSearchCategories} />
				
				<div className="search-results">{
					this.state.searchResults.map(category => {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button type="secondary btn-sm" onClick={this.onAddCategory}>
					Add
				</Button>
				<Button type="danger btn-sm" onClick={this.onResetCategories}>
					Reset
				</Button>
				
				<div className="categories">{
					this.state.setCategories.map(category => {
						return <span>{category}</span>;
					})
				}</div>
				
				<Button onClick={this.onUpdate}>Update Profile</Button>
				<Button type="danger" onClick={this.onReset}>Reset Profile</Button>
			</div>
		);
	}
	
}