import * as ActionTypes from './ActionTypes';

export const Feedback = (state = {
  errMess: null,
  feedback: []
}, action) => {
  switch(action.type) {
    case ActionTypes.FEEDBACK_FAILED:
      return{...state, errMess: action.payload}
    case ActionTypes.ADD_FEEDBACK:
      var input = action.payload;
      return state.feedback.concat(input);
    default:
      return state;
  }
}