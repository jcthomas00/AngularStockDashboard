import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NewsService {
  apiKey:string
  
  private url = 'https://api.polygon.io/v2/reference/news'

  constructor(private httpClient: HttpClient) {
    this.apiKey = environment.apiKeyPolygon
  }

  public getGeneralNews():Observable<any> {
    return new Observable<any[]>((observer:any) => {
      this.httpClient.get<Object>(`${this.url}?apiKey=${this.apiKey}`)
      .subscribe((response:any) => observer.next(response.results))
    })
  }

  public getStockNews(symbol:string):Observable<any> {
    return new Observable<any[]>((observer:any) => {
      this.httpClient.get<Object>(`${this.url}?ticker=${symbol}&apiKey=${this.apiKey}`)
      .subscribe((response:any) => observer.next(response.results))
    })
  }
}


