import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import * as selectors from "./selectors.js";


var GridHeader = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handleTextChange: this.handleTextChange.bind(this)
		};
	}
	handleTextChange(e) {
		var text = e.target.value;
		this.props.changeFilterString(text);
	}

	render() {
		const filterString = this.props.filterString;
		const textFieldPadding = 20;
		const textFieldWidth = this.props.frame.size.width - textFieldPadding;
		

		var textFieldStyle = {
			border:"0px",
			fontSize:"14px",
			height:"20px",
			top:"0px",
			left:"0px",
			bottom:"0px",
			right:"0px",
			position:"absolute",
			width:textFieldWidth + "px",
			marginTop:"auto",
			marginBottom:"auto",
			padding:"0 0 0 "+textFieldPadding+"px"
		};

		let children = null;
		if (textFieldWidth > 0) children = React.DOM.input({
			type : "text",
			ref : "textField",
			style: textFieldStyle,
			placeholder: "filter",
			value: filterString,
			onChange : this.state.handleTextChange
		});

		const headerStyle = {
			width:this.props.frame.size.width+"px",
			height: this.props.frame.size.height+"px",
			position:"relative",
			zIndex:2
		};

		return (
			React.DOM.div({
				className : "control",
				style : headerStyle
			},
				children
			)
		);
	}
});

function mapStateToProps(state, ownProps) {
	return {
		filterString: selectors.filterStringSelector(state)
	};
}
const ConnectedGridHeader = connect(mapStateToProps, actions)(GridHeader);
export default ConnectedGridHeader;
