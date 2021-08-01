import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WebRequestService {

  readonly BACKEND_URL: string;

  constructor(private http: HttpClient) {
    this.BACKEND_URL = 'http://localhost:3000';
  }

  get(uri: string) {
    return this.http.get(`${this.BACKEND_URL}/${uri}`);
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.BACKEND_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.BACKEND_URL}/${uri}`);
  }

  getOneImage(imgID: string) {
    return this.http.get(`${this.BACKEND_URL}/${imgID}/image`);
  }

  getImageObject(id: string) {
    return this.http.get(`${this.BACKEND_URL}/${id}/image-json`);
  }

  postImageForm(id: string, payload) {
    return this.http.post(`${this.BACKEND_URL}/${id}/`, payload);
  }

  deleteImage(uri: string) {
    console.log(uri);
    return this.http.delete(`${this.BACKEND_URL}/${uri}`);
  }
}
