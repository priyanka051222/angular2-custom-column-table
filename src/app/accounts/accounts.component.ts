import { Component, OnInit } from '@angular/core';
import { Account } from './account';
import { AccountsService } from './accounts.service';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountList: Account[];
  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    this.accountsService.getAccounts().then((resp: Account[]) => {
      this.accountList = resp;
    });
  }

}
