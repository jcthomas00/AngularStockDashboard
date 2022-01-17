import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  symbol = new BehaviorSubject('AAPL');
  symbols:string[] = [];
  symbolChange = this.symbol.asObservable();
  symbolComparison:string[] = []
  date = new BehaviorSubject('2021-10-01');
  dateChange = this.date.asObservable();
  timeframe = new BehaviorSubject(-1)
  timeframeChange = this.timeframe.asObservable();

  constructor() { }

  changeSymbol (symbol:string) {
    this.symbol.next(symbol)
    if(this.symbols.filter(sym => sym === symbol).length < 1){ this.symbols.push(symbol) };
  }

  getSymbols = () => {
    return from(this.symbols);
  } 

  changeDate (date: string) {
    this.date.next(date)
  }

  changeTimeframe (timeframe: number) {
    this.timeframe.next(timeframe)
  }
}