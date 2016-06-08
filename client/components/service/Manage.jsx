var Delete = require("./Delete");
var Edit = require("./Edit");
var View = require("./View");

module.exports = React.createClass({

    render: function () {
		var a = document.createElement('a');
		a.href = location.href;

		// /panel/dashboard/:id[/:action]
		var routes = a.pathname.split('/');

		var id = routes[3], action = "view";

		if (routes[4] != undefined)
			action = routes[4];
		
		var view;

        switch (action) {
            case "view":
                view = (<View id={id} />); break;
            case "edit":
                view = (<Edit id={id} />); break;
            case "delete":
                view = (<Delete id={id} />);
        }
		
		return (
			<div>
				<div className="nav-sub">
                    <a onClick={this.props.updateRoute.bind(this, id + "/view")} className="link-lg">View</a>
                    <a onClick={this.props.updateRoute.bind(this, id + "/edit")} className="link-lg">Edit</a>
					<a onClick={this.props.updateRoute.bind(this, id + "/delete")} className="link-lg">Delete</a>
                </div>
				
				{view}
			</div>
		);
    }

});