import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  symbol = new BehaviorSubject('AAPL');
  symbolChange = this.symbol.asObservable();
  date = new BehaviorSubject('2021-01-11');
  dateChange = this.date.asObservable();
  timeframe = new BehaviorSubject(5)
  timeframeChange = this.timeframe.asObservable();

  constructor() { }

  changeSymbol (symbol:string) {
    console.log(symbol)
    this.symbol.next(symbol)
    console.log('changeSymbol', this.symbol.value)
  }

  changeDate (date: string) {
    this.date.next(date)
  }

  changeTimeframe (timeframe: number) {
    this.timeframe.next(timeframe)
  }
}
