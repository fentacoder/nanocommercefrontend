import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecentActivityService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  grabRecentPosts(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/recentposts`,data,{headers:this.jsonHeaders});
  }

  grabRecentProducts(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/recentproducts`,data,{headers:this.jsonHeaders});
  }

  grabRecentActivities(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/recentactivities`,data,{headers:this.jsonHeaders});
  }
}
