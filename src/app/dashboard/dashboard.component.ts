import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  symbols:string[] = [];
  timeframe:number = -1
  startDate:string = '2021-10-01'
  leftBar = [4,1];
  rightBar = [2,3];
  favorites:string[] = ['BAC', 'TSLA'];  
  stocks:Stocks[] = [];  //symbol + data of all searches
  comparisonStocks:Stocks[] = []  // array for comparison

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

    this.stockService.requestHistoricalData(this.favorites, this.dataService.timeframe.value, this.dataService.date.value);
    this.favorites.map(fav => {
      this.stockService.requestLiveData(fav);
    })
  }

  getFavStocks = () => {
    const favs = this.stocks.filter(stock => this.favorites.includes(stock.symbol));
    //console.log("favs", this.favorites, this.stocks)
    // favs.forEach((fav) => {
    //   fav.x = fav.x.slice(fav.x.length-11, 10);
    //   fav.close = fav.close.slice(fav.close.length-11, 10);
    // })
    return favs;
  }

  retrieveStockData = () =>{
    this.stockService.getStockHistoricalData().subscribe((response)=>{

      response.data.forEach((company:any) => {
        //sort each dataset
        company.data.sort((a:any,b:any) => {
          if(new Date(a.timestamp) > new Date(b.timestamp)){return 1}
          else if(new Date(a.timestamp) < new Date(b.timestamp)){return -1}
          else return 0;
        });

        const newlyReceivedStock = {
          symbol: company.symbol,
          x:      this.unpackArray(company.data, "timestamp"),
          close:  this.unpackArray(company.data, "close"),
          high:   this.unpackArray(company.data, "high"),
          low:    this.unpackArray(company.data, "low"),
          open:   this.unpackArray(company.data, "open"),
          decreasing: {line: {color: '#aaa'}}, 
          increasing: {line: {color: 'orange'}}, 
          line: {color: 'rgba(31,119,180,1)'}, 
          type: 'candlestick', 
          xaxis: 'x', 
          yaxis: 'y' 
        }

        this.comparisonStocks.push(newlyReceivedStock)
        //set in stockToShow if this is selected stock
        if(this.dataService.symbol.value === company.symbol){
          this.stockToDisplay = newlyReceivedStock
        }
        //push the data into out stocks array
        this.stocks.push(newlyReceivedStock)
      });
      
  })

    //update candlestick chart data
    let historical:Stocks;
    this.dynamicStocks$ =  this.stockService.getStockLiveData().pipe(
      tap((response)=>{
        const newVals = response["new-value"].data[0],
              liveSymbol = response["new-value"].symbol;
        let lastIndex:number;

        historical = this.stocks.filter(stock => stock.symbol === liveSymbol)[0];
        if(historical){
          lastIndex = historical.x.length;
          this.setStockValue(historical,lastIndex,newVals);
        }

        if(liveSymbol === this.dataService.symbol.value){
          this.dataService.setCurrentStats(newVals);
          this.setStockValue(this.stockToDisplay, this.stockToDisplay.x.length-1, newVals)
        }
      })
    )

    //push new data to candlestick chart
    this.dynamicStocks$.subscribe(res=>{
      this.stockToDisplay = this.stockToDisplay;
    })
  }//end of retrieveStockData()

  setStockValue = (stock:Stocks, index:number, newVals:any) => {
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

  convertUnpackedArray = (array:any[], key:string) => {
    let initial = array[0][key]
    return array.map(array => (array[key]-initial)/initial);
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