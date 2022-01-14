import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyinfoService {
  apiKey:string;
  address = new BehaviorSubject('');
  //private url = 'https://api.polygon.io/v3/reference/tickers/'
  private yurl = 'https://query2.finance.yahoo.com/v11/finance/quoteSummary/'
  private url = "https://corsrerout.herokuapp.com/cors"

  constructor(private httpClient: HttpClient) {
    this.apiKey = environment.apiKeyPolygon
   }

  public getCompanyInfo(symbol:string):Observable<any> {
    return new Observable<any[]>((observer:any) => {
      //this.httpClient.get<Object>(`${this.url}${symbol}?apiKey=${this.apiKey}`)
      this.httpClient.post<Object>(this.url,{link: `${this.yurl}${symbol}?modules=assetProfile`})
      .subscribe(
        (response:any) => {
          this.address.next(`${response.results.address.address1}, ${response.results.address.city}, ${response.results.address.postal_code}`);
          console.log("yoy: ", response)
          observer.next(response.results);
        })
    })
  }
}