import { DropDownModule } from './../dropdown/dropdown.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from './categories.service';
import { CategoriesComponent } from './categories.component';
@NgModule({
  imports: [
    CommonModule,
    DropDownModule
  ],
  exports: [CategoriesComponent],
  declarations: [CategoriesComponent],
  providers: [CategoriesService]
})
export class CategoriesModule { }
