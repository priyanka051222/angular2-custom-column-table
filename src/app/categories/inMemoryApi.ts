
/**
 * This is an example of a Category-oriented InMemoryDbService.
 *
 * Add the following line to `AppModule.imports`
 *   InMemoryWebApiModule.forRoot(InMemoryDataService) // or InMemoryDataOverrideService
 */
import { Injectable } from '@angular/core';
import { RequestMethod, Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Category } from './category';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import {
    InMemoryDbService,
    createErrorResponse, emitResponse, HttpMethodInterceptorArgs,
    ParsedUrl, RequestInfo, STATUS
} from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [{
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }, {
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }, {
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }, {
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }, {
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }, {
            name: 'Flipkart',
            description: 'Flipkart is an online shopping destination for electronics, books, music, and movies',
            location: 'Bengaluru',
            website: 'www.flipkart.com',
            market: ['e-commerce', 'fashion', 'data as a service'],
            employees: 1000,
            stage: 'Pre Series A',
            founders: ['Sachin Bansal', 'Binny Bansal']
        }];
        return { categories: categories };
    }
}

/**
 * This is an example of a Category-oriented InMemoryDbService with method overrides.
 */
@Injectable()
export class InMemoryDataOverrideService extends InMemoryDataService {
    // pa,rseUrl override
    parseUrl(url: string): ParsedUrl {
        try {
            const loc = this.getLocation(url);
            let drop = 0;
            let urlRoot = '';
            if (loc.host !== undefined) {
                // url for a server on a different host!
                // assume it's collection is actually here too.
                drop = 1; // the leading slash
                urlRoot = loc.protocol + '//' + loc.host + '/';
            }
            const path = loc.pathname.substring(drop);
            let [base, collectionName, id] = path.split('/');
            const resourceUrl = urlRoot + base + '/' + collectionName + '/';
            [collectionName] = collectionName.split('.'); // ignore anything after the '.', e.g., '.json'
            const query = loc.search && new URLSearchParams(loc.search.substr(1));

            const result = { base, collectionName, id, query, resourceUrl };
            console.log('override parseUrl:');
            console.log(result);
            return result;
        } catch (err) {
            const msg = `unable to parse url '${url}'; original error: ${err.message}`;
            throw new Error(msg);
        }
    }

    // intercept response from the default HTTP method handlers
    responseInterceptor(response: ResponseOptions, reqInfo: RequestInfo) {
        const method = RequestMethod[reqInfo.req.method].toUpperCase();
        const body = JSON.stringify(response.body);
        console.log(`responseInterceptor: ${method} ${reqInfo.req.url}: \n${body}`);
        return response;
    }

    /**HTTP GET interceptor
     *
     *
     * @protected
     * @param {HttpMethodInterceptorArgs} interceptorArgs
     * @returns
     * @memberof InMemoryDataOverrideService
     */
    protected get(interceptorArgs: HttpMethodInterceptorArgs) {
        // Returns a 'cold' observable that won't be executed until something subscribes.
        return new Observable<Response>((responseObserver: Observer<any>) => {
            console.log('HTTP GET override');
            let resOptions: ResponseOptions;
            const { id, query, collection, collectionName, headers, req } = interceptorArgs.requestInfo;
            let data = collection;

            if (id) {
                data = this.findById(collection, id);
            } else if (query) {
                data = this.applyQuery(collection, query);
            }

            if (data) {
                resOptions = new ResponseOptions({
                    body: { data: this.clone(data) },
                    headers: headers,
                    status: STATUS.OK
                });
            } else {
                resOptions = createErrorResponse(req, STATUS.NOT_FOUND,
                    `'${collectionName}' with id='${id}' not found`);
            }

            emitResponse(responseObserver, req, resOptions);
            return () => { }; // unsubscribe function
        });
    }

    /////////// private ///////////////
    private applyQuery(collection: any[], query: URLSearchParams) {
        // extract filtering conditions - {propertyName, RegExps) - from query/search parameters
        const conditions: { name: string, rx: RegExp }[] = [];
        const caseSensitive = 'i';
        query.paramsMap.forEach((value: string[], name: string) => {
            value.forEach(v => conditions.push({ name, rx: new RegExp(decodeURI(v), caseSensitive) }));
        });

        const len = conditions.length;
        if (!len) { return collection; }

        // AND the RegExp conditions
        return collection.filter(row => {
            let ok = true;
            let i = len;
            while (ok && i) {
                i -= 1;
                const cond = conditions[i];
                ok = cond.rx.test(row[cond.name]);
            }
            return ok;
        });
    }

    private clone(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    private findById(collection: any[], id: number | string) {
        return collection.find((item: any) => item.id === id);
    }
    private addCategory(user: Category) {

    }
    private getLocation(href: string) {
        const l = document.createElement('a');
        l.href = href;
        return l;
    }
}
