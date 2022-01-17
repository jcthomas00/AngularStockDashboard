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

  constructor(
    public dataService:DataService,
    private stockService:StockService,
    private userService:UserService,
    private authService:AuthService
    ) {
      this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value);
      this.stockService.requestStockList();
      this.stockService.getStockList().subscribe(list => {this.symbols = list.symbols;});
    }

  query:string = ''
  symbols:string[] = ['AAPL'];
  timeframe:number = -1
  startDate:string = '2021-10-01'
  leftBar = [1,];
  rightBar = [2,3];
  favorites:string[] = [];  
  stocks:Stocks[] = [];
  stockToDisplay = <Stocks>{};
  dynamicStocks$ :Observable<any> = of(null);


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
  }
  ngOnInit(): void {
    //GET LOGIN INFO
    this.authService.getUser().subscribe(user => {
      if(user){
        this.userService.getUserData(user.uid).subscribe(userInfo=>{
          this.leftBar = userInfo.leftBar; 
          this.rightBar = userInfo.rightBar;
          this.favorites =  userInfo.favorites
        })
      }
    });
    this.dataService.symbolChange.subscribe((newSym)=>{
      this.stockService.requestHistoricalData([newSym], this.dataService.timeframe.value, this.dataService.date.value);
      this.stockService.requestLiveData(this.dataService.symbol.value);
    });
    this.retrieveStockData();
  }

  retrieveStockData = () =>{
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocks = this.stocks.filter(stock => stock.symbol !== this.dataService.symbol.value);

      response.data[0].data.sort((a:any,b:any) => {
        if(new Date(a.timestamp) > new Date(b.timestamp)){return 1}
        else if(new Date(a.timestamp) < new Date(b.timestamp)){return -1}
        else return 0;
      });

      console.log(response.data[0].symbol)

      if(this.dataService.symbol.value === response.data[0].symbol){
        this.stockToDisplay = {
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
        }
      }

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
  })

    //update candlestick chart data
    let historical:Stocks;
    this.dynamicStocks$ =  this.stockService.getStockLiveData().pipe(
      tap((response)=>{
        const newVals = response["new-value"].data[0],
              liveSymbol = response["new-value"].symbol;
        let candleStock, lastIndex:number;

            historical = this.stocks.filter(stock => stock.symbol === liveSymbol)[0];
            lastIndex = historical.x.length;
            this.setStockValue(historical,lastIndex,newVals);

            if(liveSymbol === this.dataService.symbol.value){
              this.setStockValue(this.stockToDisplay, this.stockToDisplay.x.length-1, newVals)
            }
      })
    )

    //push new data to candlestick chart
    this.dynamicStocks$.subscribe(res=>{
      this.stockToDisplay = this.stockToDisplay;
      console.log(this.stockToDisplay)
    })
  }//end of retrieveStockData()

  setStockValue = (stock:Stocks, index:number, newVals:any) => {
    console.log("setting");
    stock.x[index]=newVals["timestamp"];
    stock.close[index]=newVals["close"];
    stock.high[index]=newVals["high"];
    stock.low[index]=newVals["low"];
    stock.open[index]=newVals["open"];
    stock.x = [...stock.x];
    stock.close = [...stock.close];
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
