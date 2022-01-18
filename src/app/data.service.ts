import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  symbol = new BehaviorSubject('AAPL');
  symbols:string[] = [];
  symbolChange = this.symbol.asObservable();
  symbolComparison = new BehaviorSubject<string[]>(['AAPL']);
  symbolFavorites = new BehaviorSubject<string[]>(['AAPL']);
  date = new BehaviorSubject('2021-01-01');
  dateChange = this.date.asObservable();
  timeframe = new BehaviorSubject(-1)
  timeframeChange = this.timeframe.asObservable();
  stockIndex:string = 'nasdaq'
  currentStats = new BehaviorSubject({});

  constructor() { }

  changeSymbol (symbol:string) {
    this.symbol.next(symbol)
    if(this.symbols.filter(sym => sym === symbol).length < 1){ this.symbols.push(symbol) };
    
  }

  getSymbols = () => {
    return from(this.symbols);
  } 

  getCurrentStats = () => {
    return from(this.currentStats)
  }

  setcomparisonSymbol (symbol: string) {
    if(this.symbolComparison.value.indexOf(symbol) < 0){
      this.symbolComparison.next([symbol].concat(this.symbolComparison.value))
    }
  }

  deletecomparisonSymbol (delSymbol: string) {
      this.symbolComparison.next(this.symbolComparison.value.filter((symbol:string) => symbol !== delSymbol))
  }

  getcomparisonSymbols = () => {
    return from(this.symbolComparison)
  }

  setFavoritesSymbol (symbols: string[]) {
      this.symbolFavorites.next(symbols)
  }
  getFavoritesSymbols = () => {
    console.log('Favorites symbol', this.symbolFavorites)
    return from(this.symbolFavorites)
  }
  setCurrentStats (currentStats: any) {
    this.currentStats.next(currentStats)
  }

  changeDate (date: string) {
    this.date.next(date)
  }

  changeTimeframe (timeframe: number) {
    this.timeframe.next(timeframe)
  }
}