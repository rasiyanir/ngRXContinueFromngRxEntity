import { createReducer, on } from "@ngrx/store";
import { setErrorMessage, setLoadingSpinner } from "./shared.actions";
import { initialState } from "./shared.state";

const _sharedReducer = createReducer(
  initialState,
  on(setLoadingSpinner, (state: any, action: any) => {
    return {
      ...state,
      showLoading: action.status,
    }
  }),
  on(setErrorMessage, (state: any, action: any) => {
    return {
      ...state,
      errorMessage: action.message,
    }
  })
)

export function SharedReducer(state: any, action: any){
  return _sharedReducer(state, action);
}
