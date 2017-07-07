import React, { Component } from "react";
import ListHeader from "./ListHeader.js";
import ListView from "./ListView.js";


const ListPane = (class extends Component {
	render() {
		const headerHeight = 38;
		const listWidth = this.props.frame.size.width;
		const paneHeight = this.props.frame.size.height;
		const contentHeight = paneHeight - headerHeight;
		const headerFrame = {origin:{x:0,y:0},size:{width:listWidth,height:headerHeight}};
		const listClipStyle = {
			width: listWidth + "px",
			height:paneHeight + "px",
			position:"absolute"
		};

		var listContentStyle = {
			position:"relative",
			zIndex:1,
			width:"100%",
			height:contentHeight + "px",
			top:headerHeight + "px"
		};

		return (
			React.DOM.div({
				key: "ListClip",
				className : "clip",
				style : listClipStyle
			},
				React.createElement(ListHeader, {
					key: "ListHeader",
					frame: headerFrame
				}),
				React.createElement(ListView, {
					itemDimension: 20,
					key: "ListContent",
					style: listContentStyle,
					width: listWidth,
					height: contentHeight
				})
			)
		);
	}
});
export default ListPane;