import { Action } from 'redux';
import { createSelector } from 'reselect';

import { Content } from './content.model';
import * as ContentActions from './content.action';

export interface ContentsEntities {
    [id: number]: Content;
}

export interface ContentsState {
    ids: number[];
    entities: ContentsEntities;
    currentContentId?: number;
};

const initialState: ContentsState = {
    ids: [],
    entities: {}
};

export const ContentsReducer =
    function (state: ContentsState = initialState, action: Action): ContentsState {
        switch (action.type) {

            // Add content
            case ContentActions.ADD_CONTENT: {
                const content = (<ContentActions.AddContentAction>action).content;

                if (state.ids.includes(content.id)) {
                    return state;
                }

                return {
                    ids: [...state.ids, content.id],
                    currentContentId: state.currentContentId,
                    entities: Object.assign({}, state.entities, {
                        [content.id]: content
                    })
                };
            }

            // Select content
            case ContentActions.SELECT_CONTENT: {
                const content = (<ContentActions.SelectContentAction>action).content;
                const newContent = state.entities[content.id];

                return {
                    ids: state.ids,
                    currentContentId: content.id,
                    entities: Object.assign({}, state.entities, {
                        [content.id]: newContent
                    })
                };
            }

            default:
                return state;
        }
    };

export const getContentsState = (state): ContentsState => state.contents;

export const getContentsEntities = createSelector(
    getContentsState,
    (state: ContentsState) => state.entities);

export const getAllContents = createSelector(
    getContentsEntities,
    (entities: ContentsEntities) => Object.keys(entities)
        .map((contentId) => entities[contentId]));

// Emits current content
export const getCurrentContent = createSelector(
    getContentsEntities,
    getContentsState,
    (entities: ContentsEntities, state: ContentsState) =>
        entities[state.currentContentId]);
