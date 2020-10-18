import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  fileHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(private httpClient:HttpClient) { }

  loadChats(data):Observable<Message[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/chats/getall`,data,{headers:this.jsonHeaders});
  }

  loadMessages(data):Observable<Message[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/chats/loadmessages`,data,{headers:this.jsonHeaders});
  }

  sendText(data):Observable<number>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/chats/sendtext`,data,{headers:this.jsonHeaders});
  }

  sendImage(data):Observable<any>{
    const productImagesObj = new FormData();
    productImagesObj.append('image',data.image);
    productImagesObj.append('imageType', new Blob([data.imageType.split('/')[1]],{type: 'text/plain'}));
    productImagesObj.append('senderId', new Blob([data.senderId],{type: 'text/plain'}));
    productImagesObj.append('senderName', new Blob([data.senderName],{type: 'text/plain'}));
    productImagesObj.append('receiverId', new Blob([data.receiverId],{type: 'text/plain'}));
    productImagesObj.append('type', new Blob([data.type],{type: 'text/plain'}));

    return this.httpClient.post(`${environment.API_URL}/api/v1/chats/sendimage`,productImagesObj);
  }
}
