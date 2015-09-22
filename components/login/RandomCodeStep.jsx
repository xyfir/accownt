module.exports = React.createClass({
	render: function() {
		return <input type="text"  id="code" placeholder={"Security Code #" + this.props.codeNum} />;
	}
});