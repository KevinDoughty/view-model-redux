//import converter from "number-to-words";

export const UNDO = "UNDO";
export const REDO = "REDO";
export const CHANGE_TITLE = "CHANGE_TITLE";
export const CREATE_NODE = "CREATE_NODE";
export const ADD_CHILD = "ADD_CHILD";
export const DELETE_SELECTED = "DELETE_SELECTED";
export const CHANGE_FILTER_STRING = "CHANGE_FILTER_STRING";
export const DISCLOSURE_TOGGLE = "DISCLOSURE_TOGGLE";
export const DEMO_POPULATE = "DEMO_POPULATE";
export const RESIZE_DIVIDER = "RESIZE_DIVIDER";
export const DRAGGING_DIVIDER = "DRAGGING_DIVIDER";
export const SELECT_NODE = "SELECT_NODE";
export const EDIT_NODE = "EDIT_NODE";
export const CHANGE_TEXT = "CHANGE_TEXT";
export const SHIFT_KEY_PRESS = "SHIFT_KEY_PRESS";
export const CHANGE_UNDO_REGISTERED = "CHANGE_UNDO_REGISTERED";
export const CHANGE_ORIENTATION = "CHANGE_ORIENTATION";


let nodeIdCounter = 1; // tree is initially populated with item 0
const undoable = true;
const preserve = true;
const coalesce = true;

export function undo() {
	return{
		type: UNDO
	};
}

export function redo() {
	return{
		type: REDO
	};
}

export function demoPopulate(count) {
	return {
		type: DEMO_POPULATE,
		count,
		undoable
	};
}

export function createNode(parentId) {
	let nodeId = nodeIdCounter++;
	//const text = converter.toWords(childId).replace("-"," ").replace(",","");
	if (!parentId) parentId = 0;
	if (Array.isArray(parentId)) {
		nodeId = parentId.map( (item,index) => {
			return nodeId + index;
		});
		nodeIdCounter += parentId.length - 1;
	}
// 	const red = Math.random() * 127 + 127;
// 	const green = Math.random() * 127 + 127;
// 	const blue = Math.random() * 127 + 127;
	return {
		type: CREATE_NODE,
		nodeId,
		parentId,
		//text,
		undoable
	};
}

export function deleteSelected(nodeId) {
	return {
		type: DELETE_SELECTED,
		nodeId,
		undoable
	};
}

export function addChild(nodeId,childId) {
	return {
		type: ADD_CHILD,
		nodeId,
		childId,
		undoable
	};
}

export function changeFilterString(text) {
	return {
		type: CHANGE_FILTER_STRING,
		text,
		preserve
	};
}

export function disclosureToggle(nodeId) {
	return {
		type: DISCLOSURE_TOGGLE,
		nodeId,
		preserve
	};
}

export function resizeDivider(value) {
	return {
		type: RESIZE_DIVIDER,
		value,
		preserve
	};
}

export function selectNode(nodeId) {
	return {
		type: SELECT_NODE,
		nodeId,
		preserve
	};
}

export function editNode(nodeId) {
	return {
		type: EDIT_NODE,
		nodeId,
		preserve
	};
}

export function changeText(nodeId,text) {
	return {
		type: CHANGE_TEXT,
		nodeId,
		text,
		undoable,
		coalesce
	};
}

export function shiftKeyPress(value) {
	return {
		type: SHIFT_KEY_PRESS,
		value
	};
}

export function changeTitle(text) {
	return {
		type: CHANGE_TITLE,
		text,
		undoable,
		coalesce
	};
}

export function draggingDivider(draggingDivider) {
	return {
		type: DRAGGING_DIVIDER,
		draggingDivider
	};
}