import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { AppStore } from './share/app.store';
import * as Redux from 'redux';
import { Content } from './share/app-textarea/content.model';
import * as ContentActions from './share/app-textarea/content.action';
import { AppState, getAllContents } from './share/app.reducer';
import { AppTextareaComponent } from './share/app-textarea/app-textarea.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
    @ViewChild(AppTextareaComponent, { static: true }) textareaComponent: AppTextareaComponent;
    contents: Content[];
    private _currentContent: string;

    constructor(@Inject(AppStore) private store: Redux.Store<AppState>) {
        store.subscribe(() => this.updateState());
        this.updateState();
    }

    ngAfterViewInit() {
        this.textareaComponent.content$.subscribe(text => this._currentContent = text);
    }

    updateState() {
        const state = this.store.getState();
        this.contents = getAllContents(state);
    }

    onSave() {
        if (this._currentContent) {
            this.store.dispatch(ContentActions.addContent({ id: this.contents.length++, text: this._currentContent }));
        }
    }
}
