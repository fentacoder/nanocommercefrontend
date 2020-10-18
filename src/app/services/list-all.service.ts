import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/Activity';
import { Article } from '../models/Article';
import { Offer } from '../models/Offer';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListAllService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  grabProducts(data):Observable<Offer[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/getall`,data,{headers:this.jsonHeaders});
  }

  grabActivities(data):Observable<Activity[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/getall`,data,{headers:this.jsonHeaders});
  }

  grabNews(data):Observable<Article[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/news/getall`,data,{headers:this.jsonHeaders});
  }

  grabBidNum(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/bidnum`,data,{headers:this.jsonHeaders});
  }

  grabMemberNum(data):Observable<any>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/activities/membernum`);
  }

  grabProductImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/grabimage`,data,{headers:this.jsonHeaders});
  }

  grabActivityImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/grabimage`,data,{headers:this.jsonHeaders});
  }

  grabNewsImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/news/grabimage`,data,{headers:this.jsonHeaders});
  }

  getProductCount():Observable<any>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/post/count`);
  }

  getActivityCount():Observable<any>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/activities/count`);
  }

  getArticleCount():Observable<any>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/news/count`);
  }
}
