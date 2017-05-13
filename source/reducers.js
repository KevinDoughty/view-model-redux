import * as actions from "./actions";
import converter from "number-to-words";
import * as selectors from "./selectors.js";
import deepFreeze from "deep-freeze";

// Pressing the shift key breaks undo coalescing.

export function main(state={}, initialAction) {
	const modifiedAction = Object.assign({ state }, initialAction);
	const result = {
		// required:
		action: initialAction,
		history: history(state.history, modifiedAction),
		// preservables:
		now: now(state.now, modifiedAction),
		// custom:
		draggingDivider: draggingDivider(state.draggingDivider, modifiedAction),
		undoRegistered: undoRegistered(state.undoRegistered, modifiedAction),
		shiftKeyPressed: shiftKeyPressed(state.shiftKeyPressed, modifiedAction),
		nextNodeId: nextNodeId(state.nextNodeId, modifiedAction)
	};
	deepFreeze(result);
	return result;
}
function undoables(present={}, action) {
	return {
		// preservables:
		before: before(present.before, action),
		after: after(present.after, action),
		// custom:
		nodeDict: nodeDict(present.nodeDict, action),
		title: title(present.title, action)
	};
}
function preservables(now={}, action) {
	return {
		// custom:
		collapsedIds: collapsedIds(now.collapsedIds, action),
		selectedIds: selectedIds(now.selectedIds, action),
		filterString: filterString(now.filterString, action),
		dividerRatio: dividerRatio(now.dividerRatio, action),
		editingId: editingId(now.editingId, action) // Editing state probably doesn"t belong anywhere in here.
	};
}

function before(state, action) {
	const previousState = action.state;
	if (action.undoable) return previousState.now;
	if (previousState && previousState.history) return previousState.history.present.before;
	return preservables(state, action);
}
function after(state, action) {
	const previousState = action.state;
	if (action.undoable) return preservables(previousState.now, action);
	if (previousState && previousState.history) return previousState.history.present.after;
	return preservables(state, action);
}
function now(state, action) {
	if (action.type === actions.UNDO) return action.state.history.present.before; // take you to where you were right before you made the change
	if (action.type === actions.REDO) return action.state.history.future[0].after; // take you to where you were right after you made the change
	return preservables(state, action);
}

function initialHistory() {
	return {
		past: [],
		present: undoables(undefined, {}),
		future: []
	};
}

function history(state = initialHistory(), action) {
	const { past, present, future } = state;
	const isPreserving = action.preserve;
	const previousState = action.state;
	const previousAction = previousState.action;
	const isCoalescing = (action.coalesce && previousAction && previousAction.type === action.type);

	if (action.type === actions.UNDO) return {
		past: past.slice(0, past.length - 1),
		present: past[past.length - 1],
		future: [ present, ...future ]
	};

	if (action.type === actions.REDO) return {
		past: [ ...past, present ],
		present: future[0],
		future: future.slice(1)
	};

	if (isCoalescing || isPreserving) return {
		past,
		present: undoables(present, action),
		future
	};

	if (action.undoable) return {
		past: [ ...past, present ],
		present: undoables(present, action),
		future: []
	};

	return state;
}


function undoRegistered(state,action) {
	if (action.type === actions.CHANGE_UNDO_REGISTERED) return action.value;
	return state;
}

function shiftKeyPressed(state = false,action) { // This breaks undo coalescing.
	if (action.type === actions.SHIFT_KEY_PRESS) return !state;
	return state;
}

// function isAnUndoable(action) {
// 	var isUndoable = (action.undoable || action.type === actions.UNDO || action.type === actions.REDO);
// 	return isUndoable;
// }


function zero() {
	return {
// 		red: 127,
// 		green: 127,
// 		blue: 127,
		text: "zero",
		childIds:[]
	};
}


function emptyTree() {
	return { 0: zero() };
}

function generateText(number) {
	return converter.toWords(number).replace("-"," ").replace(",","");
}

function generateTree(count) {
	const nodeDict = emptyTree();
	for (let i=1; i<count+1; i++) {
		let parentId = Math.floor(Math.pow(Math.random(), 2) * i);
		//parentId = i-1;
		nodeDict[i+""] = {
// 			red: Math.random() * 127 + 127,
// 			green: Math.random() * 127 + 127,
// 			blue: Math.random() * 127 + 127,
			text: generateText(i),
			childIds: []
		};
		nodeDict[parentId].childIds.push(i);
	}
	return nodeDict;
}

//const preservableActions = [actions.SELECT_NODE, actions.EDIT_NODE, actions.DISCLOSURE_TOGGLE, actions.CHANGE_FILTER_STRING, actions.RESIZE_DIVIDER]; // surely edit node should not be preservable
//const undoActions = [actions.UNDO, actions.REDO];


function nodeDict(state = { 0:{childIds:[]} }, action) { // NOT full
	const { nodeId, parentId } = action;
	const source = state;
	if (action.type === actions.DEMO_POPULATE) {
		const count = action.count;
		return generateTree(count);
	}
	if (typeof nodeId === "undefined") return source;

	const nodeDict = {};
	Object.keys(source).forEach( function(key) {
		nodeDict[key] = source[key];
	});

	if (Array.isArray(nodeId)) {
		nodeId.forEach( function(id,index) {
			const subAction = Object.assign({}, action, {nodeId:id, multipleSelectionIndex:index});
			nodeDict[id] = treeNode(source[id], subAction);
			if (typeof parentId !== "undefined") nodeDict[parentId[index]] = parentNode(source[parentId[index]], subAction); // if nodeId is array parentId is guaranteed to also be an array
		});
	} else {
		nodeDict[nodeId] = treeNode(source[nodeId], action);
		if (typeof parentId !== "undefined") nodeDict[parentId] = parentNode(source[parentId], action);
	}
	return nodeDict;
}


function parentNode(parent={ childIds:[] }, action) {
	if (action.type === actions.CREATE_NODE) {
		return Object.assign({}, parent, { childIds: [ ...parent.childIds, action.nodeId ] });
	}
	return parent;
	
}


function treeNode(node = { childIds:[] }, action) {
	switch (action.type) {
		case actions.CREATE_NODE:
			return {
				text: generateText(action.nodeId),
				childIds: []
			};
		case actions.ADD_CHILD:
		//case actions.REMOVE_CHILD:
			return Object.assign({}, node, {
				childIds: childIds(node.childIds, action)
			});
		case actions.CHANGE_TEXT:
			return Object.assign({}, node, {
				text: action.text
			});
		default:
			return node;
	}
}

function editingId(state = -1,action) {
	if (action.type === actions.EDIT_NODE) return action.nodeId;
	return state;
}

function selectedIds(state = [], action) {
	if (action.type === actions.EDIT_NODE && action.nodeId > -1) return [action.nodeId]; // negative one used for editingId
	if (action.type === actions.CREATE_NODE) {
		const { nodeId } = action;
		if (Array.isArray(nodeId)) {
			return nodeId;
		}
		return [nodeId];
	}
	if (action.type === actions.SELECT_NODE) {
		var selectedIds = state.slice(0);
		var shiftKeyPressed = action.state.shiftKeyPressed;
		if (!shiftKeyPressed) return [action.nodeId];
		var index = selectedIds.indexOf(action.nodeId);
		if (index === -1) selectedIds.push(action.nodeId);
		else selectedIds.splice(index,1);
		if (selectedIds.length && selectedIds[0] === -1) throw new Error("no negative one");
		return selectedIds;
	}
	return state;
}

function draggingDivider(state,action) {
	if (action.type === actions.DRAGGING_DIVIDER) {
		return action.draggingDivider;
	}
	return state;
}
function dividerRatio(state = 0.5, action) {
	if (action.type === actions.RESIZE_DIVIDER) return action.value;
	return state;
}

function childIds(childIds = [], action) {
	switch (action.type) {
		case actions.ADD_CHILD:
			return [ ...childIds, action.childId ];
// 		case actions.REMOVE_CHILD:
// 			const index = childIds.indexOf(action.childId)
// 			return [
// 				...childIds.slice(0, index),
// 				...childIds.slice(index + 1)
// 			];
		default:
			return childIds;
	}
}

function collapsedIds(state = [], action) {
	if (action.type === actions.DISCLOSURE_TOGGLE) {
		const nodeId = action.nodeId;
		const collapsedIds = state.slice(0);
		const index = collapsedIds.indexOf(nodeId);
		if (index < 0) {
			collapsedIds.push(nodeId);
			const flattenedIds = selectors.flattenedIdsSelector(action.state);
			const sortFunction = function(a,b) {
				var A = flattenedIds.indexOf(a);
				var B = flattenedIds.indexOf(b);
				return A - B;
			};
			collapsedIds.sort(sortFunction);
		} else {
			collapsedIds.splice(index,1);
		}
		return collapsedIds;
	}
	return state;
}

function filterString(state = "", action) {
	if (action.type === actions.CHANGE_FILTER_STRING) return action.text;
	return state;
}

function title(state = "", action) {
	if (action.type === actions.CHANGE_TITLE) return action.text;
	return state;
}

function nextNodeId(state = 1, action) {
	if (action.type === actions.CREATE_NODE) {
		if (Array.isArray(action.nodeId)) return state + action.nodeId.length;
		return state + 1;
	}
	return state;
}

// function coalesingAction(state = null, action) {
// 	if (action.coalesce) return action.type;
// 	if (!action.undoable) return state.coalescingAction;
// 	return null;
// }