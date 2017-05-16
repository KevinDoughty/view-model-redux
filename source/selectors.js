import { createSelector } from "reselect";

export const titleSelector = (state) => state.history.present.title;
export const treeDictSelector = (state) => state.history.present.nodeDict;
export const collapsedIdsSelector = (state) => state.now.collapsedIds;
export const filterStringSelector = (state) => state.now.filterString;
export const selectedIdsSelector = (state) => state.now.selectedIds;

// The following selectors inefficiently calculate each value separately, walking the same set over and over, and would benefit from restructuring the state tree to calculate once, one selector which returns one sub-state-tree containing each individual value. The code is easier this way, however.

export const flattenedIdsSelector = createSelector(
	[treeDictSelector],
	(treeDict) => {
		const result = [];
		populateFlattened(result, treeDict, 0);
		return result;
	}
);

export const exposedIdsSelector = createSelector(
	[flattenedIdsSelector, treeDictSelector, collapsedIdsSelector],
	(flattenedIds, treeDict, collapsedIds) => {
		const result = [];
		populateExposed(result,treeDict,0,flattenedIds,collapsedIds,0);
		return result;
	}
);

export const filteredIdsSelector = createSelector(
	[exposedIdsSelector, filterStringSelector, treeDictSelector],
	(exposedIds, filterString, treeDict) => {
		if (!filterString || !filterString.length) return exposedIds;
		return exposedIds.filter( id => (treeDict[id].text.indexOf(filterString) > -1) );
	}
);

export const flattenedDepthSelector = createSelector(
	[treeDictSelector, flattenedIdsSelector],
	(treeDict, flattenedIds) => {
		const result = {};
		const nodeId = 0;
		const depth = 0;
		populateFlattenedDepth(result, treeDict, nodeId, depth);
		return result;
	}
);

function populateFlattenedDepth(result, treeDict, nodeId, depth) {
	result[nodeId] = depth;
	var node = treeDict[nodeId];
	var childIds = node.childIds || [];
	var childrenLength = childIds.length;
	for (var childIndex=0; childIndex<childrenLength; childIndex++) {
		var childId = childIds[childIndex];
		var childNode = treeDict[childId];
		if (childNode) populateFlattenedDepth(result, treeDict, childId, depth+1);
	}
}

function populateFlattened(flattenedIds, dict, nodeId) {
	const node = dict[nodeId];
	const childIds = node.childIds || [];
	const childrenLength = childIds.length;
	for (let childIndex=0; childIndex<childrenLength; childIndex++) {
		const childId = childIds[childIndex];
		const childNode = dict[childId];
		if (childNode) {
			flattenedIds.push(childId);
			populateFlattened(flattenedIds, dict, childId);
		}
	}
}

function populateExposed(destination, dict, nodeId, flattenedIds, sortedCollapsedIds, collapsedIndex, ancestorCollapsed) {
	const node = dict[nodeId];
	const childIds = node.childIds || [];
	const childrenLength = childIds.length;
	const collapsedLength = sortedCollapsedIds.length; //
	for (let childIndex=0; childIndex<childrenLength; childIndex++) {
		const childId = childIds[childIndex];
		const childNode = dict[childId];
		if (childNode) {
			let childCollapsed = false;
			while (collapsedIndex < collapsedLength) {
				const collapsedId = sortedCollapsedIds[collapsedIndex];
				const sortFunction = function(a,b) {
					var A = flattenedIds.indexOf(a);
					var B = flattenedIds.indexOf(b);
					return A - B;
				};
				const order = sortFunction(childId, collapsedId);
				if (order === 0) {
					childCollapsed = true;
					break;
				} else if (order < 0) break;
				collapsedIndex++;
			}
			if (!ancestorCollapsed) destination.push(childId);
			populateExposed(destination, dict, childId, flattenedIds, sortedCollapsedIds, collapsedIndex, ancestorCollapsed || childCollapsed);
		}
	}
}