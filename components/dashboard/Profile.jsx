module.exports = React.createClass({
	
	getInitialState: function() {
		return {
			view: 'list',
			profile: {}
		};
	},
	
	componentWillMount: function() {
		ajax({
			url: 'api/dashboard/profiles/' + this.props.id,
			dataType: 'json',
			success: function(result) {
				this.setState(result);
			}.bind(this)
		});
	},
	
	toggleView: function() {
		if (this.state.view == 'list')
			this.setState({view: 'full'});
		else
			this.setState({view: 'list'});
	},
	
	deleteProfile: function() {
		ajax({
			url: 'api/dashboard/profiles/' + this.props.id,
			method: 'DELETE',
			dataType: 'json',
			success: function(result) {
				if (!result.error)
					this.props.update();
			}.bind(this)
		});
	},
	
	render: function() {
		var view;
		
		if (this.state.view == 'list') {
			view = // image, name, delete button
		}
		else {
			view = // form
		}
	
		return ({view});
	}
	
});