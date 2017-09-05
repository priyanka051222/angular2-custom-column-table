import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsService } from './accounts.service';
import { AccountsComponent } from './accounts.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [AccountsComponent],
  declarations: [AccountsComponent],
  providers: [AccountsService]
})
export class AccountsModule { }
