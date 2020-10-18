import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  fileHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(private httpClient:HttpClient) { }

  submitPost(data:any,authorId):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/post/add/${authorId}`,data,{headers: this.jsonHeaders});
  }

  submitOneImage(data:any,postId:any):Observable<any>{
    const postImagesObj = new FormData();
    postImagesObj.append('postId', new Blob([postId],{type: 'text/plain'}));
    postImagesObj.append('image1',data.image1);
    postImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));

    return this.httpClient.post(`${environment.API_URL}/api/v1/post/addoneimage`,postImagesObj);
  }

  submitTwoPostImages(data:any,postId:any):Observable<any>{
    const postImagesObj = new FormData();
    postImagesObj.append('postId', new Blob([postId],{type: 'text/plain'}));
    postImagesObj.append('image1',data.image1);
    postImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));
    if(data.image2 !== null){
      postImagesObj.append('image2',data.image2);
      postImagesObj.append('image2Type', new Blob([data.image2Type],{type: 'text/plain'}));
    }

    return this.httpClient.post(`${environment.API_URL}/api/v1/post/addtwoimages`,postImagesObj);
  }

  submitThreePostImages(data:any,postId:any):Observable<any>{
    const postImagesObj = new FormData();
    postImagesObj.append('postId', new Blob([postId],{type: 'text/plain'}));
    postImagesObj.append('image1',data.image1);
    postImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));
    if(data.image2 !== null){
      postImagesObj.append('image2',data.image2);
      postImagesObj.append('image2Type', new Blob([data.image2Type],{type: 'text/plain'}));
    }
    if(data.image3 !== null){
      postImagesObj.append('image3',data.image3);
      postImagesObj.append('image3Type', new Blob([data.image3Type],{type: 'text/plain'}));
    }

    return this.httpClient.post(`${environment.API_URL}/api/v1/post/addthreeimages`,postImagesObj);
  }

  //load all posts within a certain date previous to the current day using the timestamps
  loadAllPosts(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/post/retrieveall`,data,{headers:this.jsonHeaders});
  }

  retrieveAuthorImage(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/post/retrieveauthorimage`,data,{headers:this.jsonHeaders});
  }

  retrievePostImages(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/post/retrievepostimages`,data,{headers:this.jsonHeaders});
  }

  grabAuthorName(data:any):Observable<any>{
    return this.httpClient.post(`${environment.API_URL}/api/v1/post/author`,data,{headers:this.jsonHeaders});
  }

  getCount():Observable<any>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/post/count`);
  }

  addLike(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/post/addlike`,data,{headers:this.jsonHeaders});
  }
}
