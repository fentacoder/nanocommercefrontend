import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import {Observable} from 'rxjs'
import { Address } from '../models/Address';
import { Activity } from '../models/Activity';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  fileHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(private httpClient:HttpClient) { }

  registerUser(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/auth/register`,data,{headers: this.jsonHeaders});
  }

  loginUser(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/auth/login`,data,{headers: this.jsonHeaders});
  }

  getUser(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/get`,data,{headers:this.jsonHeaders});
  }

  updateUserWithoutImage(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/update/withoutimage`,data,{headers:this.jsonHeaders});
  }

  updateUserWithImage(data):Observable<any>{
    const userImageObj = new FormData();
    userImageObj.append('id', new Blob([data.id],{type: 'text/plain'}));
    userImageObj.append('email', new Blob([data.email],{type: 'text/plain'}));
    userImageObj.append('twitter', new Blob([data.twitter],{type: 'text/plain'}));
    userImageObj.append('city', new Blob([data.city],{type: 'text/plain'}));
    userImageObj.append('state', new Blob([data.state],{type: 'text/plain'}));
    userImageObj.append('bio', new Blob([data.bio],{type: 'text/plain'}));
    userImageObj.append('image',data.image);
    userImageObj.append('imageType', new Blob([data.imageType],{type: 'text/plain'}));


    return this.httpClient.post(`${environment.API_URL}/api/v1/user/update/withimage`,userImageObj);
  }

  validateResetToken(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/validateresettoken`,data,{headers:this.jsonHeaders});
  }

  resetPassword(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/resetpassword`,data,{headers:this.jsonHeaders});
  }

  grabUserBids(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/bids`,data,{headers:this.jsonHeaders});
  }

  grabUserProducts(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/products`,data,{headers:this.jsonHeaders});
  }

  grabUserActivities(data):Observable<Activity[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/activities`,data,{headers:this.jsonHeaders});
  }

  grabAddress(data):Observable<Address>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/address`,data,{headers:this.jsonHeaders});
  }

  submitAddress(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/address/add`,data,{headers:this.jsonHeaders});
  }
}
