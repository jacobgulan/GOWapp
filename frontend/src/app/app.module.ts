import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HexComponent } from './map/hex/hex.component';
import { HexMapComponent } from './map/hex-map/hex-map.component';

@NgModule({
  declarations: [
    AppComponent,
    HexComponent,
    HexMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
