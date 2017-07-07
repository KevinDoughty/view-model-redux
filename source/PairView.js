import React, { Component } from "react";
import Divider from "./Divider.js";
import { connect } from "react-redux";
import * as actions from "./actions.js";

var PairView = (class extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const width = this.props.frame.size.width;
		const height = this.props.frame.size.height;
		const x = 0;//this.props.frame.origin.x;
		const y = 0;//this.props.frame.origin.y;
		const vertical = this.props.vertical;
		let dividerLoc = this.props.dividerRatio * width;
		if (typeof this.props.dividerRatio === "undefined") dividerLoc = (vertical ? height:width) / 2.0 + (vertical ? y:x);
		const dividerWidth = this.props.dividerWidth || 0;
		const halfDividerWidth = dividerWidth / 2;
		const leftWidth = dividerLoc - halfDividerWidth;
		const rightWidth = (vertical ? height:width) - dividerLoc - halfDividerWidth;
		const rightLoc = dividerLoc + halfDividerWidth;
		const middleLoc = dividerLoc - halfDividerWidth;
		
		const leftFrame = (vertical ? {
			origin: {x:x, y:y},
			size: {width:width, height:leftWidth}
		} : {
			origin: {x:x, y:y},
			size: {width:leftWidth, height:height}
		});
		const rightFrame = {
			origin: {x:(vertical ? x:rightLoc), y:(vertical ? rightLoc:y)},
			size: {width:(vertical ? width:rightWidth), height:(vertical ? rightWidth:height)}
		};
		const middleFrame = {
			origin: {x:(vertical ? x:middleLoc), y:(vertical ? middleLoc:y)},
			size: {width:(vertical ? width:dividerWidth), height:(vertical ? dividerWidth:height)}
		};
		
		const resizeDivider = function(e) {
			const frame = this.props.frame;
			const dimension = this.props.vertical ? frame.size.height : frame.size.width;
			const loc = this.props.vertical ? frame.origin.y : frame.origin.x;
			const value = this.props.vertical ? e.clientY : e.clientX;
			const result = (value - loc) / dimension;
			this.props.resizeDivider(Math.max(0,Math.min(1,result)));
		}.bind(this);
		const frame = this.props.frame;
		const splitStyle = {
			left: frame.origin.x + "px",
			top: frame.origin.y + "px",
			width: frame.size.width + "px",
			height: frame.size.height + "px",
			position:"absolute"
		};
		
		const cursor = vertical ? "row-resize" : "col-resize";
		if (this.props.draggingDivider) splitStyle.cursor = cursor;

		const left = React.cloneElement(React.Children.toArray(this.props.children)[0], {
			frame: leftFrame,
			key:"leftPane"
			
		});
		const right = React.cloneElement(React.Children.toArray(this.props.children)[1], {
			frame: rightFrame,
			key:"rightPane"
		});
		
		const dividerProps = {
			resizeDivider:resizeDivider,
			setDraggingDivider:this.props.setDraggingDivider,
			frame: middleFrame,
			cursor: cursor,
			key:"divider",
			vertical:vertical,
			controlView:this
		};

		const divider = React.createElement(Divider, dividerProps);
		const children = (this.props.dividerWidth ? [left, divider, right] : [left, right]);

		let className = "split horizontal";
		if (vertical) className = "split vertical";

		const result = (
			React.DOM.div({
				key : "splitView",
				className : className,
				style : splitStyle
			}, children)
		);
		return result;
	}
});
//export default PairView;

function mapStateToProps(state, ownProps) {
	return { draggingDivider: state.draggingDivider };
}

const ConnectedPairView = connect(mapStateToProps, actions)(PairView)
export default ConnectedPairView;