import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CategoriesModule } from './categories/categories.module';

import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './categories/inMemoryApi';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    CategoriesModule
  ],
  providers: [InMemoryDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
