import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private http: HttpClient
  ) { }

  getCategory(){
    return this.http.get(`${environment.baseUrl}/categories`);
  }

  getBooks(){
    return this.http.get(`${environment.baseUrl}/books`);
  }

  deleteBook(id: any){
    return this.http.delete(`${environment.baseUrl}/books/${id}`);
  }

  deleteCategory(id: any){
    return this.http.delete(`${environment.baseUrl}/categories/${id}`);
  }

  addCategory(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/categories`, payload);
  }

  addBook(payload: any){
    return this.http.post<any>(`${environment.baseUrl}/books`, payload);
  }

  getCategoryById(id: any){
    return this.http.get(`${environment.baseUrl}/categories/${id}`);
  }

  updateCategory(payload: any){
    return this.http.put(`${environment.baseUrl}/categories`, payload);
  }

  getBookById(id: any){
    return this.http.get(`${environment.baseUrl}/books/${id}`);
  }

  updateBook(payload: any){
    return this.http.put(`${environment.baseUrl}/books`, payload);
  }

}
