# view-model-redux
This shows a basic view model using Redux.

Divider location, selection and disclosure triangle toggled state are preserved through undo and redo. 
View state differs depending on direction travelled via undo or redo, 
presenting how the app appeared either before or after a change was made.

A flaw is redundancy in requiring a specific code structure for the reducers 
while also requiring actions to have the flags `undoable`, `preserve`, or `coalesce`.

Pressing the shift key allows for selecting and editing multiple rows in the list view, 
but this breaks undo coalescing which is a bug.

Deleting nodes is not supported despite the button. Also missing is preservation of text field focus rings.

Resizing the grid view to be narrower than a grid node is another bug of mine, 
an issue with React-Virtualized that needs to be addressed.

My focus is now on Mobx so this might not be updated much further.