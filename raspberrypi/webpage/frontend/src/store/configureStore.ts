import rootReducer from "../reducers/index";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware)
  );
}