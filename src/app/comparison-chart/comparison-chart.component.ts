import { Component, Input, OnInit } from '@angular/core';
import { LineChart, Stocks } from 'src/Interfaces';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-comparison-chart',
  templateUrl: './comparison-chart.component.html',
  styleUrls: ['./comparison-chart.component.scss']
})
export class ComparisonChartComponent implements OnInit {

  constructor(
    public dataService:DataService,
    private stockService:StockService
  ) { }

  @Input() initialStock = <Stocks>{};
  @Input() comparisonStocks:Stocks[] = []
  @Input () stocks:Stocks[] = [];

  query:string = ''
  symbols:string[] = [];
  timeframe:number = -1
  startDate:string = '2021-01-01'
  stocksToCompare:Stocks[] = [];
  symbolsToCompare:string[] = [];
  chartData:LineChart[] = [];
  color:string[] = []

  ngOnInit(): void {
    //this.comparisonStocks.push(this.initialStock)
    console.log('check here', this.comparisonStocks);
    this.stockService.getStockList().subscribe(list => {
      this.symbols = list.symbols;
      console.log('stock list', this.symbols)
    });
    //console.log('stock list', this.symbols)
    this.dataService.getcomparisonSymbols().subscribe(symbols => {
        this.stocksToCompare = []; 
        symbols.forEach(sym => {
          this.retrieveStockData(sym)
          const stockToPush = this.stocks.filter((stock) => stock.symbol===sym)[0];
          console.log(this.stocks)
          console.log(stockToPush)
          stockToPush.close.forEach((closingVal, index) => {
            stockToPush.close[index] = closingVal //(closingVal-stockToPush.close[stockToPush.close.length-10])/stockToPush.close[stockToPush.close.length-10]
          })
          this.stocksToCompare.push(stockToPush)
        })
      
      this.chartData = [];
      this.stocksToCompare.forEach((element,index) => {
        this.chartData.push({
          x:  element.x,
          y:  element.close,
          name: element.symbol,
          decreasing: {line: {color: '#7F7F7F'}}, 
          increasing: {line: {color: '#17BECF'}}, 
          line: {line_shape: 'spline'}, 
          type: 'scatter', 
          xaxis: 'x', 
          yaxis: 'y' ,
          mode: 'lines+markers',
          connectgaps: true
        });
      })
    })
  }

  onSelectStock = (newSymbol:string) => {
    this.dataService.setcomparisonSymbol(newSymbol)
    this.query = ''
    if (this.dataService.symbol.value !== newSymbol) {
     // this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      this.retrieveStockData(newSymbol)
    }
  }

  retrieveStockData = (newSymbol:string) =>{
    this.stockService.requestHistoricalData([newSymbol], this.dataService.timeframe.value, this.dataService.date.value)
  }

  deleteStock(index:number): void {
    this.stocksToCompare.splice(index, 1)
  }
}
