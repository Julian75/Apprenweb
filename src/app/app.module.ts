import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './templates/login/login.component';
import { VistaComponent } from './templates/vista/vista.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './templates/material/material/material.module';
import { ImageViewerModule } from "ngx-image-viewer";

@NgModule({
  declarations: [
    AppComponent,
    VistaComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ImageViewerModule
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    ImageViewerModule
  ],
  providers: [HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
