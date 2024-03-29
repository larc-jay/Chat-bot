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
  generateSummaryFromUrl(query: any) {
    return this.httpClient.post<any>(`${environment.apiBaseUrl}/given_url`, query);
  }
  askQuestion(query:any) {
    return this.httpClient.post<any>(`${environment.apiBaseUrl}/ask_question`,query);
  }
  getAllUrl() {
    return this.httpClient.get<any>(`${environment.apiBaseUrl}/get_all_url`,{});
  }
  getHistoryUrl() {
    return this.httpClient.get<any>(`${environment.apiBaseUrl}/get_search_history`,{});
  }
  setHistoryUrl(query: any) {
    return this.httpClient.post<any>(`${environment.apiBaseUrl}/set_search_history`,query);
  }
}
