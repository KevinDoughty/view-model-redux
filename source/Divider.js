import React, { Component } from "react";
import ReactDOM from "react-dom";


var Divider = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mouseDown: this.mouseDown.bind(this),
			mouseMove: this.mouseMove.bind(this),
			mouseUp: this.mouseUp.bind(this)
		};
	}
	componentDidMount() {
		var element = ReactDOM.findDOMNode(this);
		element.addEventListener("mousedown",this.state.mouseDown,false);
	}
	componentWillUnmount() {
		var element = ReactDOM.findDOMNode(this);
		element.removeEventListener("mousedown",this.state.mouseDown);
	}
	mouseDown(e) {
		this.props.draggingDivider(true);
		document.addEventListener("mousemove",this.state.mouseMove,false);
		document.addEventListener("mouseup",this.state.mouseUp,false);
	}
	mouseMove(e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.resizeDivider(e);
	}
	mouseUp(e) {
		document.removeEventListener("mousemove",this.state.mouseMove);
		document.removeEventListener("mouseup",this.state.mouseUp);
		this.props.draggingDivider(false);
	}
	render() {

		const frame = this.props.frame;
		const style = {
			position:"absolute",
			left:frame.origin.x+"px",
			top:frame.origin.y+"px",
			width:frame.size.width+"px",
			height:frame.size.height+"px",
			cursor:this.props.cursor,
			zIndex:1
		};

// 		const drawLine = false;
// 		if (drawLine) {
// 			const half = (frame.size.width-1)/2;
// 			style.borderLeft = half+"px solid rgba(255, 255, 0, 0)";
// 			style.borderRight = half+"px solid rgba(255, 255, 0, 0)";
// 			style.backgroundColor = "lightgray";
// 			style.boxSizing = "border-box";
// 			style.backgroundClip = "padding-box";
// 			style.WebkitBoxSizing = "border-box";
// 			style.WebkitBackgroundClip = "padding";
// 		}

		return (
			React.DOM.div({
				key : "divider",
				className : "divider",
				style : style
			})
		);
	}
});
export default Divider;

