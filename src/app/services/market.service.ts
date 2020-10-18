import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer } from '../models/Offer';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  grabProducts(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/getall`,data,{headers:this.jsonHeaders});
  }

  grabBidNum(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/bidnum`,data,{headers:this.jsonHeaders});
  }

  grabImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/grabimage`,data,{headers:this.jsonHeaders});
  }

  grabSpecificProduct(data):Observable<Offer>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/retrievespecific`,data,{headers:this.jsonHeaders});
  }

  grabImages(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/retrieveimages`,data,{headers:this.jsonHeaders});
  }

  grabHighlights(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/gethighlights`,data,{headers:this.jsonHeaders});
  }
}
