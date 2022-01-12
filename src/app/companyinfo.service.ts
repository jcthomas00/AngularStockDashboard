import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyinfoService {
  apiKey:string
  
  private url = 'https://api.polygon.io/v3/reference/tickers/'

  constructor(private httpClient: HttpClient) {
    this.apiKey = environment.apiKeyPolygon
   }

  public getCompanyInfo(symbol:string):Observable<any> {
    return new Observable<any[]>((observer:any) => {
      this.httpClient.get<Object>(`${this.url}${symbol}?apiKey=${this.apiKey}`)
      .subscribe((response:any) => observer.next(response.results))
    })
  }
}