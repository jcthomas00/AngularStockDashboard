import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  symbol = new BehaviorSubject('AAPL');
  symbols:string[] = [];
  symbolChange = this.symbol.asObservable();
  symbolComparison = new BehaviorSubject<string[]>([]);
  symbolFavorites = new BehaviorSubject<string[]>([]);
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
  getcomparisonSymbols = () => {
    console.log('comparison symbol', this.symbolComparison.value)
    return from(this.symbolComparison)
  }

  setFavoritesSymbol (symbol: string) {
    if(this.symbolFavorites.value.indexOf(symbol) < 0){
      this.symbolFavorites.next([symbol].concat(this.symbolFavorites.value))
    }
  }
  getFavoritesSymbols = () => {
    console.log('Favorites symbol', this.symbolFavorites.value)
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