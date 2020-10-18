import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  bidAlert(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/add`,data,{headers: this.jsonHeaders});
  }

  grabReceiverId(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/product/retrievespecific`,data,{headers: this.jsonHeaders});
  }

  grabSenderName(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/firstname`,data,{headers:this.jsonHeaders});
  }

  sendMessage(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/add`,data,{headers:this.jsonHeaders});
  }

  sendAdminMessage(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/emailcompany`,data,{headers:this.jsonHeaders});
  }

  passwordReset(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/passwordreset`,data,{headers:this.jsonHeaders});
  }

  getNewMessageCount(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/count`,data,{headers:this.jsonHeaders});
  }

  loadMessages(data):Observable<Message[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/load`,data,{headers:this.jsonHeaders});
  }

  acceptBid(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/acceptbid`,data,{headers:this.jsonHeaders});
  }

  removeMessage(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/remove`,data,{headers:this.jsonHeaders});
  }

  messagesRead(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/messagesread`,data,{headers:this.jsonHeaders});
  }

  declineBid(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/declinebid`,data,{headers:this.jsonHeaders});
  }

  cancelBid(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/messages/cancelBid`,data,{headers:this.jsonHeaders});
  }

  changeProductAvailability(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/changeavailability`,data,{headers:this.jsonHeaders});
  }
}
