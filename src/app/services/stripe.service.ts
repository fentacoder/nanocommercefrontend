import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  startPayment():Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/payment/stripe/createpaymentintent`,{headers:this.jsonHeaders});
  }

  savePayment(paymentToken:string):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/payment/stripe/success`,paymentToken,{headers:this.jsonHeaders});
  }

  getBidInfo(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/payment/stripe/bidinfo`,data,{headers:this.jsonHeaders});
  }
}
