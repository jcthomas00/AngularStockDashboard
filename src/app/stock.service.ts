import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  //private url = "https://nabors-stock-server.herokuapp.com/"
  private url = "http://localhost:8080";
  private socket:any = io(this.url);

  constructor() { }

  requestStockList = () => {
    this.socket.emit('list');
  }

  getStockList = ():Observable<any> => {
    return new Observable((observer:any) => {
      this.socket.on('list', (data:any) => {
        observer.next(data);
      })
    })
  }

  requestHistoricalData = (syms:string[], tf:number, startDate:string) => {
    this.socket.emit("historical", {
      'request-type': "historical",
      symbols: syms,
      timeframe: tf,
      start: startDate,
    });
  }


  getStockHistoricalData = ():Observable<any> => {
    return new Observable((observer:any) => {
      this.socket.on('historical', (data:any) => {
        observer.next(data);
      })
    })
  }

  getStockLiveData = (symbols:string[]):Observable<any> => {
    this.socket.emit('live', {symbols:symbols});
    return new Observable((observer:any) => {
      this.socket.on('live', (data:any) => {
        console.log(data)
        observer.next(data);
      })
    })
  }

}
