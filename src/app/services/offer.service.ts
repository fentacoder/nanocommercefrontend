import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { Offer } from '../models/Offer';
import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  jsonHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  fileHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(private httpClient:HttpClient) { }

  submitProduct(data:any,ownerId):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/addproduct/${ownerId}`,data,{headers: this.jsonHeaders});
  }

  updateProduct(data:any,previousProductId):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/updateproduct/${previousProductId}`,data,{headers: this.jsonHeaders});
  }

  submitOneImage(data:any,productId:any):Observable<any>{
    const productImagesObj = new FormData();
    productImagesObj.append('productId', new Blob([productId],{type: 'text/plain'}));
    productImagesObj.append('image1',data.image1);
    productImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));

    return this.httpClient.post(`${environment.API_URL}/api/v1/products/addoneimage`,productImagesObj);
  }

  submitTwoProductImages(data:any,productId:any):Observable<any>{
    const productImagesObj = new FormData();
    productImagesObj.append('productId', new Blob([productId],{type: 'text/plain'}));
    productImagesObj.append('image1',data.image1);
    productImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));
    if(data.image2 !== null){
      productImagesObj.append('image2',data.image2);
      productImagesObj.append('image2Type', new Blob([data.image2Type],{type: 'text/plain'}));
    }

    return this.httpClient.post(`${environment.API_URL}/api/v1/products/addtwoimages`,productImagesObj);
  }

  submitThreeProductImages(data:any,productId:any):Observable<any>{
    const productImagesObj = new FormData();
    productImagesObj.append('productId', new Blob([productId],{type: 'text/plain'}));
    productImagesObj.append('image1',data.image1);
    productImagesObj.append('image1Type', new Blob([data.image1Type],{type: 'text/plain'}));
    if(data.image2 !== null){
      productImagesObj.append('image2',data.image2);
      productImagesObj.append('image2Type', new Blob([data.image2Type],{type: 'text/plain'}));
    }
    if(data.image3 !== null){
      productImagesObj.append('image3',data.image3);
      productImagesObj.append('image3Type', new Blob([data.image3Type],{type: 'text/plain'}));
    }

    return this.httpClient.post(`${environment.API_URL}/api/v1/products/addthreeimages`,productImagesObj);
  }

  submitProductHighlights(data:any,productId:any):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/addproducthighlights/${productId}`,data,{headers: this.jsonHeaders});
  }

  retrieveProduct(data):Observable<any>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/retrievespecific`,data,{headers:this.jsonHeaders});
  }

  retrieveProductImages(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/retrieveimages`,data,{headers:this.jsonHeaders});
  }

  grabHighlights(data):Observable<any[]>{
    return this.httpClient.post<any>(`${environment.API_URL}/api/v1/products/gethighlights`,data,{headers:this.jsonHeaders});
  }

  getRecentlySold():Observable<Offer[]>{
    return this.httpClient.get<any>(`${environment.API_URL}/api/v1/products/recentlysold`);
  }
}
