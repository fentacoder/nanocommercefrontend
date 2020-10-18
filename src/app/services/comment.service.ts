import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  retrieveCommentNum(data:any):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/comments/number`,data,{headers:this.jsonHeaders});
  }

  loadComments(data:any):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/comments/retrieve`,data,{headers:this.jsonHeaders});
  }

  grabAuthorName(data:any):Observable<any>{
    return this.httpClient.post(`${environment.API_URL}/api/v1/comments/author`,data,{headers:this.jsonHeaders});
  }

  addComment(data:any):Observable<Comment>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/comments/add`,data,{headers:this.jsonHeaders});
  }
}
