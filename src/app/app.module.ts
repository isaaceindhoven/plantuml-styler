import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { TrustHtmlPipe } from './trusthtmlpipe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'material-module';
import { FlexLayoutModule} from '@angular/flex-layout'
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TrustHtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
