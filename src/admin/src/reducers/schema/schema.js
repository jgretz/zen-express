import {
  LOAD_SCHEMA_SUCCESS,
  SAVE_SCHEMA_SUCCESS,
  DELETE_SCHEMA_SUCCESS,
} from 'actions' ;
import { updateItemInArray, removeItemFromArray } from 'support';

const INITIAL_VALUE = [];

export default (state = INITIAL_VALUE, action) => {
  switch (action.type) {
    case LOAD_SCHEMA_SUCCESS:
      return action.payload.data;

    case SAVE_SCHEMA_SUCCESS:
      return updateItemInArray(state, action.payload.data);

    case DELETE_SCHEMA_SUCCESS:
      return removeItemFromArray(state, action.payload.data);

    default:
      return state;
  }
};
