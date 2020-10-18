import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient:HttpClient) { }

  // retrieveAll():Observable<any>{
  //   return this.httpClient.get('/api/v1/activities/all');
  // }

  grabActivites(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/getactivities`,data,{headers:this.jsonHeaders});
  }

  retrieveSpecific(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/specific`,data,{headers:this.jsonHeaders});
  }

  retrieveSpecificImages(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/images`,data,{headers:this.jsonHeaders});
  }

  retrieveHostName(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/user/name`,data,{headers:this.jsonHeaders});
  }

  grabMemberNum(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/membernum`,data,{headers:this.jsonHeaders});
  }

  grabImage(data):Observable<any>{
    //limit to one image on the backend query statement
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/grabimage`,data,{headers:this.jsonHeaders});
  }

  addActivity(data,hostId):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/activities/add/${hostId}`,data,{headers:this.jsonHeaders});
  }

  addActivityImages(data,activityId):Observable<any>{
    const activityImagesObj = new FormData();
    activityImagesObj.append('activityId', new Blob([activityId],{type: 'text/plain'}));
    activityImagesObj.append('image',data.image1);
    activityImagesObj.append('imageType', new Blob([data.image1Type],{type: 'text/plain'}));

    return this.httpClient.post(`${environment.API_URL}/api/v1/activities/addimage`,activityImagesObj);
  }

  addMember(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}api/v1/activities/addmember`,data,{headers:this.jsonHeaders});
  }
}
