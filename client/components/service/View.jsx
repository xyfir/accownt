module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			id: 0, name: "", description: "", info: "",
			owner: 0, address: ""
		};
	},
	
	componentWillMount: function() {
		var url = (window.location.href.indexOf("/view") ? "../" : "")
			+ "../../api/service/dashboard/" + this.props.id;
		ajax({
			url: url,
			dataType: "json",
			success: function(res) {
				if (res.info != "") res.info = JSON.parse(res.info);
			
				this.setState(res);
			}.bind(this)
		});
	},
	
	render: function() {
		// Build array that contains dt/dd elements for fieldname(type)/usedfor
		var requestedData = [], s = this.state;
		if (typeof this.state.info == "object") {
			[0, 1].forEach(function(i) {
				var type = i == 0 ? "required" : "optional";
				
				for (var p in s.info[type]) {
					if (s.info[type].hasOwnProperty(p)) {
						requestedData.push(
							<tr>
								<td>{p}</td>
								<td>{s.info[type][p]}</td>
								<td>{type == "required" ? "Yes" : "No"}</td>
							</tr>
						);
					}
				}
			});
		}
	
		return (
			<div>
				<h2>{this.state.name}</h2>
				<p>{this.state.description}</p>
				<a href={this.state.address}>{this.state.address}</a>
				
				<hr />
				
				<table className="requested-data">
					<tr>
						<th>Field</th><th>Used For</th><th>Required</th>
					</tr>
				
					{requestedData}
				</table>
			</div>
		);
	}
	
});