import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient : HttpClient) {

  }
  generateSummary(query: any) {
    return this.httpClient.post<any>(`${environment.apiBaseUrl}/generate_summary`, query);
  }
  askQuestion(query:any) {
    return this.httpClient.post<any>(`${environment.apiBaseUrl}/ask_question`,query);
  }
  getAllUrl() {
    return this.httpClient.get<any>(`${environment.apiBaseUrl}/get_all_url`,{});
  }
}
