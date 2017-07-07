import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import * as selectors from "./selectors.js";


const ListHeader = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handleFocusText: this.handleFocusText.bind(this),
			handleBlurText: this.handleBlurText.bind(this),
			handleChangeText: this.handleChangeText.bind(this)
		};
	}
	handleFocusText(e) {
	}

	handleBlurText(e) {
	}

	handleChangeText(e) {
		var text = e.target.value;
		var selectedIds = this.props.selectedIds;
		var changeText = this.props.changeText.bind(this);
		changeText(selectedIds,text);
	}

	render() {
		var normalizedTreeDict = this.props.normalizedTreeDict|| {};
		var selectedIds = this.props.selectedIds || [];
		var text;
		var multipleValues = false;
		var i = selectedIds.length;
		while (i--) {
			var selectedId = selectedIds[i];
			var node = normalizedTreeDict[selectedId];
			if (node) {
				if (typeof text === "undefined") {
					text = node.text;
				} else {
					if (text !== node.text) {
						multipleValues = true;
					}
				}
			}
		}
		if (typeof text === "undefined") text = ""; // needed for initial value

		var placeholder = "no selection";
		if (multipleValues) placeholder = "multiple values";
		if (multipleValues) text = "";
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
		if (textFieldWidth > 0) {
			children = React.DOM.input({
				type: "text",
				ref: "textField",
				style:textFieldStyle,
				placeholder: placeholder,
				value: text,
				onChange: this.state.handleChangeText,
				onFocus: this.state.handleFocusText,
				onBlur: this.state.handleBlurText
			});
		}

		var headerStyle = {
			width:this.props.frame.size.width+"px",
			height: this.props.frame.size.height+"px",
			position:"relative",
			zIndex:2
		};

		return (
			React.DOM.div({
				className: "control",
				style: headerStyle
			},
				children
			)
		);
	}
});
//var ListHeader = React.createFactory(ListHeaderClass); // extra step required because I"m not using JSX

function mapStateToProps(state, ownProps) {
	return {
		selectedIds: selectors.selectedIdsSelector(state),
		normalizedTreeDict: selectors.normalizedTreeDictSelector(state)
	};
}

const ConnectedListHeader = connect(mapStateToProps, actions)(ListHeader);
export default ConnectedListHeader;
