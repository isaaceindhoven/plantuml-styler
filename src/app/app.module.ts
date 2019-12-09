import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TrustHtmlPipe } from './trusthtmlpipe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DiagramComponent } from './components/diagram/diagram.component';
import { EditorComponent } from './components/editor/editor.component';
const DEFAULT_ACE_CONFIG: AceConfigInterface = {
};
@NgModule({
  declarations: [
    AppComponent,
    TrustHtmlPipe,
    TextAreaComponent,
    NavbarComponent,
    DiagramComponent,
    EditorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ColorPickerModule,
    NgxFileDropModule,
    AceModule
  ],
  entryComponents: [
    TextAreaComponent,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: false }
    },
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }],
  bootstrap: [AppComponent],
  exports: [AceModule],
})
export class AppModule { }
