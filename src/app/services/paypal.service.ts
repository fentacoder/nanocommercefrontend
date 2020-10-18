import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';
import { Address } from '../models/Address';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  // startPaymentProcess(data:any):Observable<any>{
  //   return this.httpClient.post<any>('/api/v1/payment/paypal/initialize',data,{headers:this.jsonHeaders});
  // }

  getToken(id:string,secret:string,code:string = null):Observable<any>{
    let credentials = btoa(`${id}:${secret}`);
    let paypalHeaders: HttpHeaders = new HttpHeaders({
      'Authorization': 'BASIC ' + credentials,
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = 'grant_type=client_credentials';

    if(code !== null){
      body = 'grant_type=authorization_code&code=' + code;
    }

    return this.httpClient.post<any>('https://api.paypal.com/v1/oauth2/token',body,{headers:paypalHeaders});
  }

  makePayout(data,token):Observable<any>{
    let paypalHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.post<any>('https://api.paypal.com/v1/payments/payouts',data,{headers:paypalHeaders});
  }

  handleTransaction(data,token):Observable<any>{
    let paypalHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.post<any>('https://api.paypal.com/v2/checkout/orders',data,{headers:paypalHeaders});
  }

  captureTransaction(orderId,token):Observable<any>{
    let paypalHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.httpClient.post<any>(`https://api.paypal.com/v2/checkout/orders/${orderId}/capture`,{headers:paypalHeaders});
  }

  saveTransaction(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/save`,data,{headers:this.jsonHeaders});
  }

  getBidInfo(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/bidinfo`,data,{headers:this.jsonHeaders});
  }

  getSellerEmail(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/selleremail`,data,{headers:this.jsonHeaders});
  }

  getPreferredPay(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/preferredpay`,data,{headers:this.jsonHeaders});
  }

  grabOrderId(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/getid`,data,{headers:this.jsonHeaders});
  }

  confirmTransaction(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/confirm`,data,{headers:this.jsonHeaders});
  }

  deleteBidProcess(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/orders/paypal/deletebidprocess`,data,{headers:this.jsonHeaders});
  }

  getPayerAddress(data):Observable<Address>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/address`,data,{headers:this.jsonHeaders});
  }

  checkAvailability(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/checkavailability`,data,{headers:this.jsonHeaders});
  }

  createPayment(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/payment/paypal/pay`,data,{headers:this.jsonHeaders});
  }

  executePayment(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/payment/paypal/executepayment`,data,{headers:this.jsonHeaders});
  }
}
