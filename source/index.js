import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import App from "./App.js";
import { main } from "./reducers.js";
import { createStore } from "redux";

// function addLoggingToDispatch(store) {
// 	const rawDispatch = store.dispatch;
// 	return (action) => {
// 		const result = rawDispatch(action);
// 		return result;
// 	};
// }

const initialState = undefined;
const store = createStore(main, initialState);

render(
	React.createElement(Provider, {
		store
	}, React.createElement(App,{})),
	document.getElementById("app")
);
