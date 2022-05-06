import { combineReducers } from "@reduxjs/toolkit";
import {user} from "./security";
import { formBuilderReducer } from '../utils/form-builder';
import {values} from "./values";

const rootReducer = combineReducers({
    user,
    formBuilder: formBuilderReducer,
    values,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;