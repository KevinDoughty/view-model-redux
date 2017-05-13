import React from "react";
import { Component } from "react";
import * as actions from "./actions.js";


const GridNode = (class extends Component {
	handleMouseDown(e) {
		e.stopPropagation(); // prevent selecting text with shiftKeyPressed
		e.preventDefault(); // prevent selecting text with shiftKeyPressed
		actions.selectNode(this.props.id);
		return false;
	}

	render() {
		const style = Object.assign({
		}, this.props.style);
		var nodeText = this.props.text;
		var label = React.DOM.p({
			ref : "label"
		}, nodeText);

		var selected = this.props.selected;
		if (selected) {
			style.backgroundColor = "orange";
		}
		return (
			React.DOM.div({
				style : style,
				onMouseDown: this.handleMouseDown.bind(this)
			},label)
		);
	}
});
export default GridNode;