
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultiSelectSearchFilter } from './search-filter.pipe';
import { MultiselectDropdownComponent } from './dropdown.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [MultiselectDropdownComponent],
  declarations: [MultiselectDropdownComponent , MultiSelectSearchFilter],
})
export class DropDownModule { }
