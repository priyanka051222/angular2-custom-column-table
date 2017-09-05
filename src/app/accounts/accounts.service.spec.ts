import { TestBed, async, inject } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AccountsService } from './accounts.service';

describe('AccountsService', () => {

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        { provide: AccountsService, useClass: AccountsService },
        { provide: XHRBackend, useClass: MockBackend },
      ]
    });
  });

  describe('getAccounts()', () => {

    it('should return an Observable<Array<Account>>',
        inject([AccountsService, XHRBackend], (accountService, mockBackend) => {

        const mockResponse = {
          data: [
            {
                id: '1',
                owner: 'Priyanka Kesharwani',
                type: 'Savings',
                balance: 100000,
                contact : '7987576902'
              }, {
                  id: '2',
                  owner: 'John David',
                  type: 'Current',
                  balance: 17802,
                  contact : '726389223'
                }, {
                  id: '3',
                  owner: 'Susan Mayer',
                  type: 'Savings',
                  balance: 22200,
                  contact : '939393322'
                }, {
                  id: '4',
                  owner: 'Carlos Solis',
                  type: 'Deposit',
                  balance: 33333,
                  contact : '7987576902'
                }
          ]
        };

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        accountService.getAccounts().subscribe((accounts) => {
          expect(accounts.length).toBe(4);
          expect(accounts[0].id).toEqual('1');
        });
    }));
  });
});

