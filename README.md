# view-model-redux
This shows a basic view model using Redux. 
The code is loosely based on the [Redux tree-view example](https://github.com/reactjs/redux/tree/master/examples/tree-view).

Divider location, selection and disclosure triangle toggled state are preserved through undo and redo. 
View state differs depending on direction travelled via undo or redo, 
presenting how the app appeared either before or after a change was made.

A flaw is requiring a specific code structure for the reducers 
with redundancy in the actions having the flags `undoable`, `preserve`, or `coalesce`.

Pressing the shift key allows for selecting and editing multiple rows in the list view, 
but this breaks undo coalescing which is a bug.

Missing is preservation of text field focus rings and scroll position.

Resizing the grid view to be narrower than a grid node is another bug of mine, 
an issue with React-Virtualized that needs to be addressed.

My focus is now on Mobx so this might not be updated much further.