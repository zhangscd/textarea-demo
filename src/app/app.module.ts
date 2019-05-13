import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppTextareaComponent } from './share/app-textarea/app-textarea.component';

import { AppStore, appStoreProviders} from './share/app.store';

@NgModule({
    declarations: [
        AppComponent,
        AppTextareaComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
    ],
    providers: [appStoreProviders],
    bootstrap: [AppComponent]
})
export class AppModule { }
