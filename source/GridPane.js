import React, { Component } from "react";
import GridHeader from "./GridHeader.js";
import GridView from "./GridView.js";


const GridPane = (class extends Component {
	render() {
		const headerHeight = 38;
		const gridWidth = this.props.frame.size.width;
		const paneHeight = this.props.frame.size.height;
		const contentHeight = paneHeight - headerHeight;

		const gridClipStyle = {
			width: gridWidth + "px",
			height: paneHeight + "px",
			position:"absolute",
			left:this.props.frame.origin.x + "px",
			top:this.props.frame.origin.y + "px"
		};

		var gridContentStyle = {
			position:"relative",
			zIndex:1,
			width:"100%",
			height:contentHeight + "px",
			top:headerHeight + "px"
		};

		return (
			React.DOM.div({
				key: "GridClip",
				className : "clip",
				style : gridClipStyle
			},
				React.createElement(GridHeader, {
					key: "GridHeader",
					frame: {origin:{x:0,y:0},size:{width:gridWidth,height:headerHeight}}
				}),
				React.createElement(GridView, {
					itemDimension: 150,
					key: "GridContent",
					style: gridContentStyle,
					width: gridWidth,
					height: contentHeight
				})
			)
		);
	}
});
export default GridPane;