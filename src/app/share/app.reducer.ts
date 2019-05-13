import { Reducer, combineReducers } from 'redux';
import { ContentsState, ContentsReducer } from './app-textarea/content.reducer';
export * from './app-textarea/content.reducer';

export interface AppState {
    contents: ContentsState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    contents: ContentsReducer
});

export default rootReducer;