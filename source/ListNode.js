import React from "react";
import { Component } from "react";
import DisclosureTriangle from "./DisclosureTriangle";


const ListNode = (class extends Component {

	constructor(props) {
		super(props);
		this.handleCheckClick = this.handleCheckClick.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
		this.handleFocusText = this.handleFocusText.bind(this);
		this.handleBlurText = this.handleBlurText.bind(this);
		this.handleKeyDownText = this.handleKeyDownText.bind(this);
		this.handleSelectListNode = this.handleSelectListNode.bind(this);
		this.eatMouseDown = this.eatMouseDown.bind(this);
		this.editOrDeselectTextInput = this.editOrDeselectTextInput.bind(this);
		this.state = { toggled:props.toggled };
	}

	eatMouseDown(e) {
		e.stopPropagation(); // prevent selecting text with shiftKeyPressed
		e.preventDefault(); // prevent selecting text with shiftKeyPressed
	}

	editOrDeselectTextInput(e) { // to allow de-selecting
		if (this.props.shiftKeyPressed) this.eatMouseDown(e); // prevent editing text input when clicked and shift key pressed, to allow de-selecting
	}

	handleSelectListNode(e) { // optimize me if absolute positioning
		this.props.selectNode(this.props.id);
		return false;
	}

	handleCheckClick(e) {
		this.props.disclosureToggle(this.props.id);
	}

	handleChangeText(e) {
		this.props.changeText(this.props.id, e.target.value,true);
	}

	handleFocusText(e) {
		this.props.editNode(this.props.id);
	}

	handleBlurText(e) {
		this.props.editNode(-1);
	}

	handleKeyDownText(e) {
		if (e.keyCode !== 13) return;
		e.stopPropagation();
		e.preventDefault();
		this.refs.textField.blur();
		return false;
	}

	nodeSort(a,b) {
		const nodes = this.props.flattenedIds;
		const A = nodes.indexOf(a);
		const B = nodes.indexOf(b);
		return A - B;
	}


	render() {
		const { id, collapsed, editing, childIds, shiftKeyPressed } = this.props;

		const inset = 7;
		const margin = 15;
		const depth = this.props.depth;
		const padding = inset + (depth - 1) * margin;

		const style = Object.assign({
			paddingLeft: padding + "px",
			width: "100%",
			opacity: this.props.opacity,
			zIndex: this.props.zIndex
		}, this.props.style);
		
		const selected = this.props.selected;
		if (selected) {
			style.backgroundColor = "orange";
		}

		const nodeId = id;

		var labelStyle = {
			marginLeft:"16px",
			fontSize:"14px",
			height:"20px"
		};
		var textFieldStyle = {
			marginLeft:"16px",
			border:"0px",
			fontSize:"14px",
			height:"20px",
			left:"-1px", // fudge
			top:"-2px", // fudge
			position:"relative",
			width:"100%",
			backgroundColor:"white"
		};
		var itemClassName = "";
		var labelClassName = "";
		var textFieldClassName = "";

		if (selected) {
			textFieldStyle.backgroundColor = "orange";
			style.overflow = "hidden";
			style.backgroundColor = "orange";
		}
		if (editing) {
			style.overflow = "visible";
			textFieldStyle.backgroundColor = "transparent";
		}
		var nodeText = this.props.text;

		var labelProps = {
			ref : "label",
			className : labelClassName,
			style: labelStyle
		};

		var label = React.DOM.span(labelProps, nodeText);

		const textFieldProps = {
			ref : "textField",
			type : "text",
			name : nodeId,
			style: textFieldStyle,
			className : textFieldClassName,
			value : nodeText
		};

		if (shiftKeyPressed && !editing) { // to allow de-selecting, but shiftKeyPressed breaks coalescing
			textFieldProps.readOnly = "readOnly";
			textFieldProps.onClick = this.handleSelectListNode;
		} else {
			textFieldProps.onMouseDown = this.editOrDeselectTextInput;
			textFieldProps.onChange = this.handleChangeText;
			textFieldProps.onFocus = this.handleFocusText;
			textFieldProps.onBlur = this.handleBlurText;
			textFieldProps.onKeyDown = this.handleKeyDownText;
		}

		const textField = React.DOM.input(textFieldProps);

		var rowElement = label;
		if (selected) rowElement = textField;

		const itemProps = {
			className: itemClassName,
			style: style
		};
		if (!selected) {
			itemProps.onClick = this.handleSelectListNode;
			itemProps.onMouseDown = this.eatMouseDown;
		}

		if (!childIds || !childIds.length) return React.DOM.div(itemProps,rowElement);

		return (
			React.DOM.div(itemProps,
				React.DOM.input({
					ref : "checkbox",
					type : "checkbox",
					id : nodeId,
					name : nodeId,
					checked : collapsed,
					onChange : this.handleCheckClick,
					onClick: this.eatMouseDown, // prevent selecting row on disclosure click
					style: {
						position:"absolute",
						zIndex: 1,
						cursor: "pointer",
						opacity:0,
						width:"16px",
						height:"20px"
					}
				}),
				React.createElement( DisclosureTriangle, {
					id: nodeId,
					toggled: collapsed,
					onMouseDown: function(e) {
						console.log("disclosure mouseDown");
					}
				}),
				rowElement
			)
		);
	}
});
export default ListNode;