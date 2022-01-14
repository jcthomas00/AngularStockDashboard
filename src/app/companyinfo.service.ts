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
      //this.httpClient.post(this.url,{link: `${this.yurl}${symbol}?modules=assetProfile`})
      this.httpClient.post(this.url,{link: `${this.yurl}${symbol}?modules=assetProfile,quoteType`})
      .subscribe(
        (response:any) => {
          const address = `${response.quoteSummary.result[0].assetProfile.address1} ${response.quoteSummary.result[0].assetProfile.city} ${response.quoteSummary.result[0].assetProfile.zip}`;
          this.address.next(address);
          observer.next(response);
        })
    })
  }
}