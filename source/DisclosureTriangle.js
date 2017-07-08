import React from "react";
import { Component } from "react";


const DisclosureTriangle = props => {
	var toggled = props.toggled;
	var color = "darkgray";
	var style = {
		position: "absolute",
		marginTop: "5px",
		marginBottom: "-10px",
		borderStyle: "solid",
		borderWidth: "10px 5px 0 5px",
		borderColor: color + " transparent transparent transparent",
		width: "0px",
		height: "0px"
	};
	if (toggled) {
		style.borderWidth = "5px 0 5px 10px";
		style.borderColor = "transparent transparent transparent " + color;
	}
	return (
		<div style={style} />
	);
}

export default DisclosureTriangle;