import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  //private url = "https://sheltered-bastion-43662.herokuapp.com/";
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

  requestHistoricalData = () => {
    this.socket.emit("historical", {
      'request-type': "historical",
      symbols: ['AAPL','DS'],
      timeframe: 5,
      start: '01-13-2020',
    });
  }


  getStockHistoricalData = ():Observable<any> => {
    return new Observable((observer:any) => {
      this.socket.on('historical', (data:any) => {
        console.log(data)
        observer.next(data);
      })
    })
  }

  getStockLiveData = (symbols:string[]):Observable<any> => {
    this.socket.emit('live', {symbols:symbols});
    return new Observable((observer:any) => {
      this.socket.on('live', (data:any) => {
        observer.next(data);
      })
    })
  }

}
