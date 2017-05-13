import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions.js";
import PairView from "./PairView.js";
import ControlView from "./ControlView.js";
import ListPane from "./ListPane.js";
import GridPane from "./GridPane.js";


var App = (class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keydown: this.keydown.bind(this),
			keyup: this.keyup.bind(this),
			resize: this.resize.bind(this)
		};
		//this.props.demoPopulate(1000);
	}
	keydown(e) {
		this.toggleKeys(e);
	}
	keyup(e) {
		this.toggleKeys(e);
	}
	toggleKeys(e) {
		const editingId = this.props.editingId;
		if ((editingId === null || typeof editingId === "undefined" || editingId === -1) && this.props.shiftKeyPressed !== e.shiftKey) {
			const shiftKeyPress = this.props.shiftKeyPress.bind(this);
			shiftKeyPress(!this.props.shiftKeyPressed);
		}
	}
	resize(e) {
		this.forceUpdate();
	}
	componentDidMount() {
		document.addEventListener("keydown",this.state.keydown);
		document.addEventListener("keyup",this.state.keyup);
		window.addEventListener("resize",this.state.resize);
	}
	componentWillUnmount() {
		window.removeEventListener("resize",this.state.resize);
		document.removeEventListener("keyup",this.state.keyup);
		document.removeEventListener("keydown",this.state.keydown);
	}
	render() {
		const dividerWidth = 9.0;
		const width = document.body.offsetWidth;
		const height = document.body.offsetHeight;
		const headerHeight = 38;
		const dividerRatio = this.props.now.dividerRatio;
		const controlHeight = 20;
		const paneHeight = height - controlHeight;
		const pairFrame = {origin:{x:dividerWidth,y:controlHeight + dividerWidth}, size:{width:width-dividerWidth*2, height:paneHeight - dividerWidth*2}};
		const controlFrame = {origin:{x:dividerWidth,y:dividerWidth},size:{width:width-dividerWidth*2, height:headerHeight + controlHeight - dividerWidth*2}}; // For drawing header, headerHeight  + controlHeight, not needed in List Pane and GridPane

		return (
			React.DOM.div({
			},
				React.createElement(ControlView, {
					key: "ControlView",
					frame:controlFrame
				}),

				React.createElement( PairView, {
					dividerWidth:dividerWidth,
					dividerRatio:dividerRatio,
					resizeDivider:this.props.resizeDivider,
					draggingDivider:this.props.draggingDivider,
					frame:pairFrame
				},

					React.createElement( ListPane, {
					}),
					React.createElement( GridPane, {
					})
				)
			)
		);
	}
});

function mapStateToProps(state, ownProps) {
	return Object.assign({}, state, ownProps);
}
const ConnectedApp = connect(mapStateToProps, actions)(App);
export default ConnectedApp;