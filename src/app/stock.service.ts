import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  //private url = "https://nabors-stock-server.herokuapp.com/"
  //private url = "http://localhost:8080";
  private url = "https://stockserver-dash.herokuapp.com/"
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

  requestHistoricalData = async (syms:string[], tf:number, startDate:string) => {
    // return await this.asyncEmit('historical', {
    // 'request-type': "historical",
    // symbols: syms,
    // timeframe: tf,
    // start: startDate,
    // })
    this.socket.emit('historical', {
      'request-type': "historical",
      symbols: syms,
      timeframe: tf,
      start: startDate,
      })
  }

  //getStockHistoricalData 
  // public asyncEmit = (eventName: string, data?: any): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     if(data !== undefined) this.socket.emit(eventName, data)
  //     else this.socket.emit(eventName)
  //     this.socket.on(eventName, (result: any) => {
  //       console.log(eventName,": ",result)
  //       this.socket.off(eventName)
  //       resolve(result)
  //     })
  //     /* If no response after 1 second */
  //     setTimeout(() => { reject(new Error('Server responded too slow... it might be down or lagging behind')) }, 5000)
  //   })
  // }

  // public requestHistorical = async (tickers:string[]): Promise<HistoricalStockObject[]> => {
  //   const data = await this.asyncEmit('historical', tickers)
  //   return data.data
  // }


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
        //console.log(data)
        observer.next(data);
      })
    })
  }

}
