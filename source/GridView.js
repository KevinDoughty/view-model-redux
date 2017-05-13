import React, { Component } from "react";
import { Grid } from "react-virtualized";
import { connect } from "react-redux";
import * as actions from "./actions.js";
import * as selectors from "./selectors.js";
import GridNode from "./GridNode.js";


class GridView extends Component {
	itemsPerRow() {
		return Math.floor(this.props.width / this.props.itemDimension);
	}
	columnOfItemAtIndex(index) {
		const itemsPerRow = this.itemsPerRow();
		return index % itemsPerRow;
	}
	rowOfItemAtIndex(index) {
		const itemsPerRow = this.itemsPerRow();
		return Math.floor(index / itemsPerRow);
	}
	cellRenderer({ columnIndex, key, rowIndex, style }) {
		const index = rowIndex * this.itemsPerRow() + columnIndex;
		if (index >= this.props.exposedIds.length) { // you have to handle cells with no data
			return null;
		}
		const id = this.props.exposedIds[index];
		const node = this.props.treeDict[id];
		const text = node.text;
		const selected = (this.props.selectedIds.indexOf(id) !== -1);
		return React.createElement( GridNode, {
			key,
			text,
			selected,
			style
		});
	}

	render() {
		const itemDimension = this.props.itemDimension;
		let rowCount = 0;
		const exposedLength = this.props.exposedIds.length;
		if (exposedLength) rowCount = Math.floor(exposedLength/this.itemsPerRow()) + 1;
		return (
			React.DOM.div({
				style:{
					backgroundColor:"white"
				}
			},
				React.createElement(Grid, {
					cellRenderer:this.cellRenderer.bind(this),
					columnCount:this.itemsPerRow.call(this),
					columnWidth:itemDimension,
					height:this.props.height,
					rowCount:rowCount,
					rowHeight:itemDimension,
					width:this.props.width
				})
			)
		);
	}
}

function mapStateToProps(state, ownProps) {
	return Object.assign({}, ownProps, {
		exposedIds: selectors.filteredIdsSelector(state),
		treeDict: selectors.treeDictSelector(state),
		selectedIds: selectors.selectedIdsSelector(state),
		collapsedIds: selectors.collapsedIdsSelector(state)
	});
}
const ConnectedGridView = connect(mapStateToProps, actions)(GridView);
export default ConnectedGridView;