import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler,
    HttpEvent, HttpXsrfTokenExtractor, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map, finalize} from 'rxjs/operators';
import {environment} from '../../../src/environments/environment';


@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

    constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headerName = 'XSRF-TOKEN';
        let requestToForward = req;
        let token = this.tokenExtractor.getToken() as string;
        if (token == null){
            token = localStorage.getItem('token');
        }
        if (token !== null) {
            requestToForward = req.clone({ setHeaders: { headerName: token } });
        }

        return next.handle(requestToForward);
    }
}