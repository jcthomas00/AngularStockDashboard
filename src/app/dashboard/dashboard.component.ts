import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Stocks } from 'src/Interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  query:string = ''

//  symbols:string[] = ['AAPL', 'TSLA', 'NVDA', 'JPM', 'BAC','NBR', 'GOOG', 'AXP', 'COF', 'WFC', 'MSFT', 'FB', 'AMZN', 'GS', 'MS', 'V', 'GME', 'NFLX', 'KO', 'JNJ', 'CRM', 'PYPL', 'XOM', 'HD', 'DIS', 'INTC', 'COP', 'CVX', 'SBUX', 'OXY', 'WMT', 'MPC', 'SLB', 'PSX', 'VLO']
  symbols:string[] = [];
  timeframe:number = 5
  startDate:string = '2022-01-01'

  constructor(
    public dataService:DataService,
    private stockService:StockService,
    private userService:UserService,
    private authService:AuthService
    ) {
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value);
      this.stockService.requestStockList();
      this.stockService.getStockList().subscribe(list => {this.symbols = list.symbols; console.log(list)});
    }

  leftBar = [1,];
  rightBar = [2,3];
  favorites:string[] = [];  
  stocks:Stocks[] = [];
  dynamicStocks$ :Observable<any> = of(null);
  stockToDisplay = <Stocks>{};


  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
    this.userService.setUserData({leftBar: this.leftBar, rightBar: this.rightBar, favorites: ['AAPL']})
    console.log(this.leftBar)
    console.log(this.rightBar)

  }
  ngOnInit(): void {
    //GET LOGIN INFO
    this.authService.getUser().subscribe(user => {
      if(user){
        this.userService.getUserData(user.uid).subscribe(userInfo=>{
          this.leftBar = userInfo.leftBar; 
          this.rightBar = userInfo.rightBar;
          this.favorites =  userInfo.favorites
          console.log("lefty: ",this.leftBar)
        })
      }
    });
    this.retrieveStockData();
  }

  retrieveStockData = () =>{

    this.dataService.symbolChange.subscribe((newSym)=>{
      this.stockService.requestHistoricalData([newSym], this.dataService.timeframe.value, this.dataService.date.value);
    })
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocks = this.stocks.filter(stock => stock.symbol !== this.dataService.symbol.value);
      this.stocks.push({
        symbol: this.dataService.symbol.value,
        x:      this.unpackArray(response.data[0].data, "timestamp"),
        close:  this.unpackArray(response.data[0].data, "close"),
        high:   this.unpackArray(response.data[0].data, "high"),
        low:    this.unpackArray(response.data[0].data, "low"),
        open:   this.unpackArray(response.data[0].data, "open"),
        decreasing: {line: {color: '#7F7F7F'}}, 
        increasing: {line: {color: '#17BECF'}}, 
        line: {color: 'rgba(31,119,180,1)'}, 
        type: 'candlestick', 
        xaxis: 'x', 
        yaxis: 'y' 
    })
    console.log("this.stocks: ", this.stocks)
  })

    this.dynamicStocks$ =  this.stockService.getStockLiveData([this.dataService.symbol.value]).pipe(
      tap((response)=>{
        //console.log([this.dataService.symbol.value])
        const newVals = response["new-value"].data[0], 
              historical = this.stocks.filter(stock => stock.symbol === this.dataService.symbol.value)[0], 
              lastIndex = historical.x.length-1;

        historical.x[lastIndex]=newVals["timestamp"];
        historical.close[lastIndex]=newVals["close"];
        historical.high[lastIndex]=newVals["high"];
        historical.low[lastIndex]=newVals["low"];
        historical.open[lastIndex]=newVals["open"];
      }),
      map((response)=>{
        const historical = this.stocks.filter(stock => stock.symbol === this.dataService.symbol.value)[0];
              return {
                symbol: this.dataService.symbol.value,
                x:      historical.x.slice(),
                close:  historical.close.slice(),
                high:   historical.high.slice(),
                low:    historical.low.slice(),
                open:   historical.open.slice(),
                decreasing: {line: {color: 'orange'}}, 
                increasing: {line: {color: 'white'}}, 
                line: {color: 'rgba(31,119,180,1)'}, 
                type: 'candlestick', 
                xaxis: 'x', 
                yaxis: 'y', 
            }
      })
    )

    this.dynamicStocks$.subscribe(res=>{
      console.log("smell",res)
      this.stockToDisplay = res;
    // .subscribe((response) => {
    //   const vals = response["new-value"].data[0];
    //   const lastIndex = this.stocks.x.length-1;
    //   this.stocks.x[lastIndex] = vals["timestamp"];
    //   this.stocks.close[lastIndex] = vals["close"];
    //   this.stocks.high[lastIndex] = vals["high"];
    //   this.stocks.low[lastIndex] = vals["low"];
    //   this.stocks.open[lastIndex] = vals["open"];
    //   this.stocks.close = this.stocks.close;
    //   //this.dynamicStocks = of(this.stocks)
    // })

    // this.stockInfo$ = this.histStockInfo$.pipe(mergeMap(historical =>  {
    //   return this.stockService.getStockLiveData(["AAPL"]).pipe(map((response)=>{
    //       const newVals = response["new-value"].data[0];
    //       return{
    //         x:      historical.x.push(newVals["timestamp"]),
    //         close:  historical.close.push(newVals["close"]),
    //         high:   historical.high.push(newVals["high"]),
    //         low:    historical.low.push(newVals["low"]),
    //         open:   historical.open.push(newVals["open"]),
    //         decreasing: {line: {color: '#7F7F7F'}}, 
    //         increasing: {line: {color: '#17BECF'}}, 
    //         line: {color: 'rgba(31,119,180,1)'}, 
    //         type: 'candlestick', 
    //         xaxis: 'x', 
    //         yaxis: 'y' 
    //     }
    //     }))
    // })
    // );

// this.stockService.getStockHistoricalData().subscribe((res)=>{
//   console.log(res)
//   const vals = res.data[0].data;
//   this.stocks = {
//     x:      this.unpackArray(vals, "timestamp"),
//     close:  this.unpackArray(vals, "close"),
//     high:   this.unpackArray(vals, "high"),
//     low:    this.unpackArray(vals, "low"),
//     open:   this.unpackArray(vals, "open").slice(),
//     decreasing: {line: {color: '#7F7F7F'}}, 
//     increasing: {line: {color: '#17BECF'}}, 
//     line: {color: 'rgba(31,119,180,1)'}, 
//     type: 'candlestick', 
//     xaxis: 'x', 
//     yaxis: 'y'
//   };
  //this.stocks.x.slice()
// })

// this.stockService.getStockLiveData(["AAPL"]).subscribe((response) => {
//   const vals = response["new-value"].data[0];
//   const lastIndex = this.stocks.x.length-1;
//   this.stocks.x[lastIndex] = vals["timestamp"];
//   this.stocks.close[lastIndex] = vals["close"];
//   this.stocks.high[lastIndex] = vals["high"];
//   this.stocks.low[lastIndex] = vals["low"];
//   this.stocks.open[lastIndex] = vals["open"];
//   // this.stocks.decreasing = {line: {color: '#7F7F7F'}};
//   // this.stocks.increasing = {line: {color: '#17BECF'}}; 
//   // this.stocks.line= {color: 'rgba(31,119,180,1)'}; 
//   // this.stocks.type= 'candlestick'; 
//   // this.stocks.xaxis= 'x'; 
//   // this.stocks.yaxis= 'y';
//    this.stocks.close = this.stocks.close.slice();
//   console.log("last Index: ",lastIndex)
//   console.log(`time: ,${this.stocks.x[lastIndex]}
//   | close: ,${this.stocks.close[lastIndex]}
//   | high: ,${this.stocks.high[lastIndex]}
//   `);
// })
    // this.histStockInfo$ = this.stockService.getStockHistoricalData().pipe(
    //   tap(x=>console.log("yoyo")),
    //     map((response)=>{
    //       console.log("got historical data")
    //       return{
    //         x:      this.unpackArray(response.data[0].data, "timestamp"),
    //         close:  this.unpackArray(response.data[0].data, "close"),
    //         high:   this.unpackArray(response.data[0].data, "high"),
    //         low:    this.unpackArray(response.data[0].data, "low"),
    //         open:   this.unpackArray(response.data[0].data, "open").slice(),
    //         decreasing: {line: {color: '#7F7F7F'}}, 
    //         increasing: {line: {color: '#17BECF'}}, 
    //         line: {color: 'rgba(31,119,180,1)'}, 
    //         type: 'candlestick', 
    //         xaxis: 'x', 
    //         yaxis: 'y' 
    //     }
    //   })
    // );    })

      })
    

  }
  unpackArray = (array:any[], key:string) => {
    return array.map(array => array[key]);
  }
  onSelectStock = (newSymbol:string) => {
    this.query = ''
    console.log(newSymbol, this.timeframe, this.startDate)
    if (this.dataService.symbol.value !== newSymbol) {
      this.dataService.changeSymbol(newSymbol)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onSymbolChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  onDateChange = () => {
    console.log(this.startDate)
    if (this.dataService.date.value !== this.startDate) {
      this.dataService.changeDate(this.startDate)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onDateChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  onTimeframeChange = () => {
    console.log(this.timeframe)
    if (this.dataService.timeframe.value !== this.timeframe) {
      this.dataService.changeTimeframe(this.timeframe)
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
      console.log('onTimeframeChange', this.dataService.symbol.value, this.dataService.timeframe.value, this.dataService.date.value)
    }
  }

  login = () =>{
    this.authService.login();
  }
  logout = () =>{
    this.authService.logout();
  }
  getUser = ():Observable<any> =>{
    return this.authService.getUser();
  }
}
