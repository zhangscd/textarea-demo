import { Component, OnInit, ViewChild, ElementRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BACKSPACE, DELETE, ENTER, V, X, TWO } from '@angular/cdk/keycodes';
import { Observable, fromEvent } from 'rxjs';
import {tap, map, startWith, distinctUntilChanged, filter, mergeMap, takeUntil} from 'rxjs/operators';

import { AppEditorService, Profile } from './app-editor.service';

const LINE_HEIGHT = 20; // suggest list Y offset

@Component({
    selector: 'app-textarea',
    templateUrl: './app-textarea.component.html',
    styleUrls: ['./app-textarea.component.css']
})
export class AppTextareaComponent implements OnInit, AfterViewInit, OnDestroy {
    // For Resize
    @ViewChild('resizeBottom', { static: true }) resizeBottomRef: ElementRef;
    @ViewChild('resizeRight', { static: true }) resizeRightRef: ElementRef;
    @ViewChild('resizeNwse', { static: true }) resizeNwseRef: ElementRef;
    resizeBottomMouseDownEvent$: Observable<any>;
    resizeBottomMouseUpEvent$: Observable<any>;
    resizeBottomMouseMoveEvent$: Observable<any>;
    resizeBottomEvent$: Observable<any>;
    resizeRightMouseDownEvent$: Observable<any>;
    resizeRightMouseUpEvent$: Observable<any>;
    resizeRightMouseMoveEvent$: Observable<any>;
    resizeRightEvent$: Observable<any>;
    resizeNwseMouseDownEvent$: Observable<any>;
    resizeNwseMouseUpEvent$: Observable<any>;
    resizeNwseMouseMoveEvent$: Observable<any>;
    resizeNwseEvent$: Observable<any>;
    private _pageX: number;
    private _pageY: number;
    private _editorRect: ClientRect;
    private _editorStyle: any;
    get editorStyle() {
        return this._editorStyle;
    }
    set editorStyle(rectSize: { width: number, height: number }) {
        this._editorStyle = { width: rectSize.width + 'px', height: rectSize.height + 'px' };
    }

    // For Edit
    content$: Observable<string>;
    selectionChangeEvent$: Observable<any>;
    keyEvent$: Observable<any>;
    keyEventAfterFilter$: Observable<any>;
    @ViewChild('appTextArea', { static: true }) textAreaRef: ElementRef;
    suggestList: Profile[] = [];

    private _currentRange: Range;
    private _suggestListStyle: any;
    get suggestListStyle() {
        return this._suggestListStyle;
    }
    set suggestListStyle(position: { top: number, left: number }) {
        this._suggestListStyle = { top: position.top + 'px', left: position.left + 'px' };
    }

    constructor(private _editorService: AppEditorService,
                @Inject(DOCUMENT) private _document: any) {
    }

    ngOnInit() {
        // Initial Resize event Observable
        this.resizeBottomMouseDownEvent$ = fromEvent<MouseEvent>(this.resizeBottomRef.nativeElement, 'mousedown').
            pipe(tap((event: MouseEvent) => { this._pageX = event.pageX; this._pageY = event.pageY; this._editorRect = this.textAreaRef.nativeElement.getBoundingClientRect(); }));
        this.resizeBottomMouseUpEvent$ = fromEvent<MouseEvent>(this._document, 'mouseup');
        this.resizeBottomMouseMoveEvent$ = fromEvent<MouseEvent>(this._document, 'mousemove');
        this.resizeBottomEvent$ = this.resizeBottomMouseDownEvent$.pipe(mergeMap(down => this.resizeBottomMouseMoveEvent$.pipe(takeUntil(this.resizeBottomMouseUpEvent$))));
        this.resizeRightMouseDownEvent$ = fromEvent<MouseEvent>(this.resizeRightRef.nativeElement, 'mousedown').
            pipe(tap((event: MouseEvent) => { this._pageX = event.pageX; this._pageY = event.pageY; this._editorRect = this.textAreaRef.nativeElement.getBoundingClientRect(); }));
        this.resizeRightMouseUpEvent$ = fromEvent<MouseEvent>(this._document, 'mouseup');
        this.resizeRightMouseMoveEvent$ = fromEvent<MouseEvent>(this._document, 'mousemove');
        this.resizeRightEvent$ = this.resizeRightMouseDownEvent$.pipe(mergeMap(down => this.resizeRightMouseMoveEvent$.pipe(takeUntil(this.resizeRightMouseUpEvent$))));
        this.resizeNwseMouseDownEvent$ = fromEvent<MouseEvent>(this.resizeNwseRef.nativeElement, 'mousedown').
            pipe(tap((event: MouseEvent) => { this._pageX = event.pageX; this._pageY = event.pageY; this._editorRect = this.textAreaRef.nativeElement.getBoundingClientRect(); console.log(event); }));
        this.resizeNwseMouseUpEvent$ = fromEvent<MouseEvent>(this._document, 'mouseup');
        this.resizeNwseMouseMoveEvent$ = fromEvent<MouseEvent>(this._document, 'mousemove');
        this.resizeNwseEvent$ = this.resizeNwseMouseDownEvent$.pipe(mergeMap(down => this.resizeNwseMouseMoveEvent$.pipe(takeUntil(this.resizeNwseMouseUpEvent$))));

        // Initial Edit content Observable
        this.content$ = fromEvent<any>(this.textAreaRef.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.innerText),
                startWith(''),
                distinctUntilChanged()
            );

        // Initial Edit Events Observable
        this.selectionChangeEvent$ = fromEvent<KeyboardEvent>(this._document, 'selectionchange');
        this.keyEvent$ = fromEvent<KeyboardEvent>(this.textAreaRef.nativeElement, 'keydown');
        this.keyEventAfterFilter$ = this.keyEvent$.pipe(
            filter(event => event.keyCode === BACKSPACE ||
                event.keyCode === DELETE ||
                event.keyCode === ENTER ||
                (event.keyCode === V && event.ctrlKey && !event.shiftKey && !event.altKey) || // Ctrl + V
                (event.keyCode === X && event.ctrlKey && !event.shiftKey && !event.altKey) || // Ctrl + X
                event.keyCode === TWO && event.shiftKey // @
            )
        );
    }

    ngAfterViewInit() {
        // subscribe Events
        this.resizeBottomEvent$.subscribe(event => this._resizeEditor(event, 'bottom'));
        this.resizeRightEvent$.subscribe(event => this._resizeEditor(event, 'right'));
        this.resizeNwseEvent$.subscribe(event => this._resizeEditor(event, 'nwse'));

        this.selectionChangeEvent$.subscribe(event => this._updateCaretInfo(event));
        this.keyEventAfterFilter$.subscribe(event => this._onKeyDown(event));
    }

    ngOnDestroy() {
    }

    private _resizeEditor(event: MouseEvent, resizeDirection: 'bottom' | 'right' | 'nwse') {
        let offsetX: number;
        let offsetY: number;
        switch (resizeDirection) {
            case 'bottom':
                offsetY = event.pageY - this._pageY;
                this.editorStyle = { width: this._editorRect.width, height: this._editorRect.height + offsetY };
                break;
            case 'right':
                offsetX = event.pageX - this._pageX;
                this.editorStyle = { width: this._editorRect.width + offsetX, height: this._editorRect.height };
                break;
            case 'nwse':
                offsetX = event.pageX - this._pageX;
                offsetY = event.pageY - this._pageY;
                this.editorStyle = { width: this._editorRect.width + offsetX, height: this._editorRect.height + offsetY };
                break;
        }
    }

    selectProfile(profileName: string) {
        if (this._currentRange) {
            const content = (this._currentRange.startContainer as any).data;
            const offset = this._currentRange.endOffset;
            const currentNameResult = this._editorService.getCurrentProfileName(content, offset);

            if (currentNameResult.followAt) {
                // trim the substring already inputted
                const restLetters = profileName.substring(currentNameResult.name.length);
                // insert select name
                this._currentRange.insertNode(this._document.createTextNode(restLetters));
                // set caret position
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(this._currentRange);
            }
        }
        this._currentRange = null;
        this.suggestList = [];
    }

    private _updateCaretInfo(event: any) {
        const activeElement = this._document.activeElement;
        if (activeElement === this.textAreaRef.nativeElement) {
            const selection = window.getSelection();

            if (selection.focusNode === this.textAreaRef.nativeElement) {
                // when textarea first time get focused, can't create range yet
            } else {
                if (selection.rangeCount && selection.isCollapsed) {
                    const range = selection.getRangeAt(0);
                    this.suggestList = this._editorService.getProfileList(selection.focusNode.textContent, range.endOffset);
                    this._currentRange = range;
                    console.log(range);
                }
            }
        }
    }

    private _onKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case DELETE:
            case BACKSPACE:
                // these two function key won't trigger selectionchange event
                // apply setTimeout to make sure execute this._updateCaretInfo() Range update after
                // content has been deleted
                setTimeout(() => { this._updateCaretInfo(event); });
                break;
            case ENTER:
                break;
            case V: // TODO Ctrl + V
                break;
            case X: // TODO + X
                break;
            case TWO: // @: open suggest list
                this._openSuggestList();
                break;

        }
    }

    private _openSuggestList() {
        if (window && window.getSelection) {
            const selection = window.getSelection();
            const focusNode = selection.focusNode;
            let rect: ClientRect;
            if (focusNode === this.textAreaRef.nativeElement) {
                rect = (focusNode as HTMLElement).getBoundingClientRect();
                this.suggestListStyle = { left: rect.left, top: rect.top + LINE_HEIGHT };
            } else {
                if (selection.rangeCount) {
                    const range = selection.getRangeAt(0).cloneRange();

                    rect = range.getBoundingClientRect();
                    this.suggestListStyle = { left: rect.left, top: rect.bottom };
                }
            }
        }
    }
}
