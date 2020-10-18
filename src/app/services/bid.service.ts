import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BidService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  addBid(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/bids/add`,data,{headers: this.jsonHeaders});
  }

  retrieveHostName(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/name`,data,{headers:this.jsonHeaders});
  }
}
