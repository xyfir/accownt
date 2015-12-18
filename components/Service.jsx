/* Route Components */
var Create = require("./service/Create");
var Manage = require("./service/Manage");
var List = require("./service/List");

var Service = React.createClass({

    getInitialState: function() {
        return { view: "list" };
    },

    componentWillMount: function () {
        // Set view based on current URL
        this.routeUpdated();
    },

    /*
        Update URL and call routeUpdate()
    */
    updateRoute: function(route) {
        route = XACC + "service/dashboard/" + route;
        history.pushState({}, '', route);
        this.routeUpdated();
    },

    /*
        Set state.view based on current URL
    */
    routeUpdated: function() {
        // Parse url
        var a = document.createElement('a');
        a.href = location.href;

        // Set state.view based on route
        switch (a.pathname) {
            case "/service/dashboard":
                this.setState({ view: "list" }); break;
            case "/service/dashboard/list":
                this.setState({ view: "list" }); break;
			case "/service/dashboard/create":
				this.setState({ view: "create" }); break;
            default:
                if (a.pathname.match(/^\/service\/dashboard\/\d+\/?(\w+)?$/))
                    this.setState({ view: "manage" });
        }
    },

    render: function () {
        var view;
        switch (this.state.view) {
			case "list":
				view = <List updateRoute={this.updateRoute} />; break;
			case "manage":
				view = <Manage updateRoute={this.updateRoute} />; break;
			case "create":
				view = <Create />;
		}

        return (
            <div>
                <div className="nav">
                    <a onClick={this.updateRoute.bind(this, "create")} className="link-lg">Create Service</a>
                    <a onClick={this.updateRoute.bind(this, "list")} className="link-lg">View Services</a>
                </div>

				{view}
			</div>
        );
    }

});

ReactDOM.render(<Service />, $("#content"));