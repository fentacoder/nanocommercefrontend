import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  grabNews(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/news/getall`,data,{headers:this.jsonHeaders});
  }

  grabImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/news/grabimage`,data,{headers:this.jsonHeaders});
  }

  grabArticle(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/news/article/get`,data,{headers:this.jsonHeaders});
  }
}
