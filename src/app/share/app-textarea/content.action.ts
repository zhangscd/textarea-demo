import { Action, ActionCreator} from 'redux';
import { Content } from './content.model';

export const ADD_CONTENT = '[CONTENT] Add';
export interface AddContentAction extends Action {
    content: Content;
}
export const addContent: ActionCreator<AddContentAction> =
    (content) => ({
        type: ADD_CONTENT,
        content: content
    });

export const SELECT_CONTENT = '[CONTENT] Select';
export interface SelectContentAction extends Action {
    content: Content;
}
export const selectContent: ActionCreator<SelectContentAction> =
    (content) => ({
        type: SELECT_CONTENT,
        content: content
    });
