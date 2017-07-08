import React, { Component } from "react";
import ListHeader from "./ListHeader.js";
import ListView from "./ListView.js";


const ListPane = props => {
	const headerHeight = 38;
	const listWidth = props.frame.size.width;
	const paneHeight = props.frame.size.height;
	const contentHeight = paneHeight - headerHeight;
	const headerFrame = {origin:{x:0,y:0},size:{width:listWidth,height:headerHeight}};
	const listClipStyle = {
		width: listWidth + "px",
		height:paneHeight + "px",
		position:"absolute"
	};
	const listContentStyle = {
		position:"relative",
		zIndex:1,
		width:"100%",
		height:contentHeight + "px",
		top:headerHeight + "px"
	};
	const clipProps = {
		key: "ListClip",
		className : "clip",
		style : listClipStyle
	};
	const headerProps = {
		key: "ListHeader",
		frame: headerFrame
	};
	const viewProps = {
		itemDimension: 20,
		key: "ListContent",
		style: listContentStyle,
		width: listWidth,
		height: contentHeight
	};
	return (
		<div {...clipProps}>
			<ListHeader {...headerProps} />
			<ListView {...viewProps} />
		</div>
	);
}
export default ListPane;