import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  constructor(private httpClient: HttpClient) { }

  public getRecords(pageSize: any, pageNo: any){
    return this.httpClient.get(`http://localhost:3000/get-records?pageSize=${pageSize}&pageNo=${pageNo}`);
  }

  // public loadData(){
  //   return this.httpClient.post<any>(`http://localhost:3000/get-records`);
  // }

  loadData(data: any){
    return this.httpClient.post<any>(`http://localhost:3000/insert`, data);
  }
}
