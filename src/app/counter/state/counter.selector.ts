import { createFeatureSelector, createSelector } from "@ngrx/store";
import { counterState } from "./counter.state";

export const COUNTER_STATE_NAME = 'state';

const getCounterState = createFeatureSelector<counterState>(COUNTER_STATE_NAME);

export const getCounter = createSelector(getCounterState, state => {
  return state.counter;
});

export const getName = createSelector(getCounterState, state => {
  return state.name;
});
