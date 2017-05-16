import React, { Component } from "react";
import { List } from "react-virtualized";
import { connect } from "react-redux";
import * as actions from "./actions.js";
import * as selectors from "./selectors.js";
import ListNode from "./ListNode.js";


class ListView extends Component {
	itemsPerRow() {
		return 1;
	}
	columnOfItemAtIndex(index) {
		const itemsPerRow = this.itemsPerRow();
		return index % itemsPerRow;
	}
	rowOfItemAtIndex(index) {
		const itemsPerRow = this.itemsPerRow();
		return Math.floor(index / itemsPerRow);
	}
	cellRenderer({
		key,				 // Unique key within array of rows
		index,			 // Index of row within collection
		isScrolling, // The List is currently being scrolled
		isVisible,	 // This row is visible within the List (eg it is not an overscanned row)
		style				// Style object to be applied to row (to position it)
	}) {
		const id = this.props.exposedIds[index];
		const node = this.props.normalizedTreeDict[id];
		const text = node.text;
		const collapsed = (this.props.collapsedIds.indexOf(id) !== -1);
		const selected = (this.props.selectedIds.indexOf(id) !== -1);
		const editing = (this.props.editingId === id);
		const depth = this.props.flattenedDepth[ id ];
		const childIds = node.childIds;
		const shiftKeyPressed = this.props.shiftKeyPressed;
		return React.createElement( ListNode, {
			key,
			id,
			style,
			text,
			collapsed,
			selected,
			editing,
			depth,
			childIds,
			shiftKeyPressed,
			selectNode: this.props.selectNode,
			editNode: this.props.editNode,
			changeText: this.props.changeText,
			disclosureToggle: this.props.disclosureToggle
		});
	}
	render() {
		const itemDimension = this.props.itemDimension;
		const rowCount = this.props.exposedIds.length;
		
		return (
			React.DOM.div({
				style:{
					backgroundColor:"white"
				}
			},
				React.createElement(List, {
					width:this.props.width,
					height:this.props.height,
					rowCount:rowCount,
					rowHeight:itemDimension,
					rowRenderer:this.cellRenderer.bind(this)
				})
			)
		);
	}
}

function mapStateToProps(state, ownProps) {
	return Object.assign({}, ownProps, {
		exposedIds: selectors.exposedIdsSelector(state),
		normalizedTreeDict: selectors.normalizedTreeDictSelector(state),
		flattenedIds: selectors.flattenedIdsSelector(state),
		flattenedDepth: selectors.flattenedDepthSelector(state),
		selectedIds: selectors.selectedIdsSelector(state),
		collapsedIds: selectors.collapsedIdsSelector(state),
		shiftKeyPressed: state.shiftKeyPressed,
		editingId: state.now.editingId
	});
}
const ConnectedListView = connect(mapStateToProps, actions)(ListView);
export default ConnectedListView;