import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import * as selectors from "./selectors.js";


var ControlViewClass = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handleAddClick: this.handleAddClick.bind(this),
			handleAddChildClick: this.handleAddChildClick.bind(this),
			handleRemoveClick: this.handleRemoveClick.bind(this),
			handleUndoClick: this.handleUndoClick.bind(this),
			handleRedoClick: this.handleRedoClick.bind(this),
			handleTextChange: this.handleTextChange.bind(this)
		};
	}
	handleAddClick(e) {
		this.props.createNode(0);
	}
	handleAddChildClick(e) {
		const { createNode, selectedIds} = this.props;
		createNode(selectedIds);
		//if (selectedIds.length === 1) createNode(selectedIds[0]);
	}
	handleRemoveClick(e) {
		//const { deleteNode } = this.props;
		//deleteNode(this.props.selectedIds);
	}
	handleUndoClick(e) {
		this.props.undo();
	}
	handleRedoClick(e) {
		this.props.redo();
	}
	handleTextChange(e) {
		var text = e.target.value;
		this.props.changeTitle(text);
	}

	render() {
		const frame = this.props.frame;
		const controlStyle = {
			left: frame.origin.x+"px",
			top: frame.origin.y+"px",
			width: frame.size.width+"px",
			height: frame.size.height + "px",
			position:"absolute"
		};

		const textFieldPadding = 20;

		const textFieldStyle = {
			display:"inline-block",
			margin:"auto",
			border:"0px",
			fontSize:"14px",
			height:"20px",
			padding:"0 0 0 "+textFieldPadding+"px"
		};

		return (
			React.DOM.div({
				style:controlStyle
			},
				React.DOM.button({
					ref: "undo",
					onClick: this.state.handleUndoClick,
					disabled: this.props.history.past.length === 0 || false
				}, "undo"),
				React.DOM.button({
					ref: "redo",
					onClick: this.state.handleRedoClick,
					disabled: this.props.history.future.length === 0 || false
				}, "redo"),

				React.DOM.button({
					ref : "add",
					onClick : this.state.handleAddClick
				}, "add"),

				React.DOM.button({
					ref : "addChild",
					onClick : this.state.handleAddChildClick,
					disabled: this.props.selectedIds.length === 0
				}, "add child"),

				React.DOM.button({
					ref : "remove",
					onClick : this.state.handleRemoveClick,
					disabled: this.props.selectedIds.length === 0
				}, "remove"),

				React.DOM.input({
					type : "text",
					ref : "textField",
					style: textFieldStyle,
					placeholder: "title",
					value: this.props.title,
					onChange : this.state.handleTextChange
				})
			)
		);
	}
});
function mapStateToProps(state, ownProps) {
	return {
		history: state.history,
		selectedIds: selectors.selectedIdsSelector(state),
		title: selectors.titleSelector(state)
	};
}
const ConnectedControlView = connect(mapStateToProps, actions)(ControlViewClass);
export default ConnectedControlView;