import { Account } from './account';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class AccountsService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private categoriesUrl = 'api/accounts';  // URL to web api

  constructor(private http: Http) { }

  getAccounts(): Promise<Account[]> {
    return this.http.get(this.categoriesUrl)
      .toPromise()
      .then(response => response.json().data as Account[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
