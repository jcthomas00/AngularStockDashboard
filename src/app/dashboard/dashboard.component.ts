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
      this.stockService.getStockList().subscribe(list => {
        this.symbols = list.symbols;
      });
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear - 1, 0, 0);
      this.maxDate = new Date(currentYear + 0, 0, 0);
    }

    minDate: Date;                  // limit start date on datepicker
    maxDate: Date;                  // limit end date on datepicker
    query:string = ''               // used for symbol search
    symbols:string[] = [];          // holds list of symbols from server
    timeframe:number = -1;          // request param for tick frequency
    startDate:string = '2021-01-02' // default start date
    leftBar = [4,1];                // default left bar widget sequence
    rightBar = [2,3];               // default right bar widget sequence
    favorites:string[] = [];        // holds fav stocks
    stocks:Stocks[] = [];           // symbol + data of all fetched historical data
    comparisonStocks:Stocks[] = []  // array for comparison
    stockToDisplay = <Stocks>{};    // holds stock info for candlestick chart
    dynamicStocks$ :Observable<any> = of(null); //used to send live data to Plotly

    ngOnInit(): void {

      // get login info and overwrite defaults
      this.authService.getUser().subscribe(user => {
        if(user){
          this.userService.getUserData(user.uid).subscribe(userInfo=>{
            this.leftBar = userInfo.leftBar; 
            this.rightBar = userInfo.rightBar;
            this.dataService.setFavoritesSymbol(userInfo.favorites);
          })
        }else{
          this.favorites = [];
          this.dataService.setFavoritesSymbol(this.favorites);
        }
      });

      // handle changes in the favorite stocks section
      this.dataService.getFavoritesSymbols().subscribe((symbols:string[]) => {
        if(symbols.length === this.favorites.length && symbols.every((value:string, index:number) => value === this.favorites[index])){}else{
          this.favorites = symbols;
          this.dataService.setFavoritesSymbol(this.favorites);
          this.userService.setUserData({leftBar: this.leftBar, rightBar: this.rightBar, favorites: this.favorites})
        }
      })

      // handle changes when new stock is selected
      this.dataService.symbolChange.subscribe((newSym)=>{
        this.stockService.requestHistoricalData([newSym], this.dataService.timeframe.value, this.dataService.date.value);
        this.stockService.requestLiveData(this.dataService.symbol.value);
      });

      // listen for stock info being emitted and handle them
      this.retrieveStockData();

      // request historical data in favorites
      this.stockService.requestHistoricalData(this.favorites, this.dataService.timeframe.value, this.dataService.date.value);
      this.favorites.map(fav => {
        this.stockService.requestLiveData(fav);
      })
    }

      //drag and drop functionality
      drop(event: CdkDragDrop<any[]>): void {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
        }
        this.userService.setUserData({leftBar: this.leftBar, rightBar: this.rightBar, favorites: this.favorites})
      }

      // return array of fav stocks
      getFavStocks = () => {
        const favs = this.stocks.filter(stock => this.favorites.includes(stock.symbol));
        return favs;
      }

      // handle when new stock info comes in
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
              increasing: {line: {color: '#f96332'}}, 
              line: {color: 'rgba(31,119,180,1)'}, 
              type: 'candlestick', 
              xaxis: 'x', 
              yaxis: 'y' 
            }
            //set in stockToShow if this is selected stock
            if(this.dataService.symbol.value === company.symbol){
              this.stockToDisplay = newlyReceivedStock
            }
            //push the data into out stocks array
            let doesStockExist = this.stocks.filter((stock:Stocks) => newlyReceivedStock.symbol === stock.symbol)
            if (doesStockExist.length === 0) {
            this.stocks = [...this.stocks, newlyReceivedStock]
            }
          }); 
        })
        let historical:Stocks;
        // attach live data to historical data
        this.dynamicStocks$ =  this.stockService.getStockLiveData().pipe(
          tap((response)=>{
            const newVals = response["new-value"].data[0],
                  liveSymbol = response["new-value"].symbol;
            let lastIndex:number;
            // replace old historical data with newly recieeved object
            historical = this.stocks.filter(stock => stock.symbol === liveSymbol)[0];
            if(historical){
              lastIndex = historical.x.length;
              this.setStockValue(historical,lastIndex,newVals);
            }
            // update candlestick chart data
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

      // insert new set of stock data into an array at specified position
      setStockValue = (stock:Stocks, index:number, newVals:any) => {
        stock.x[index]=newVals["timestamp"];
        stock.close[index]=newVals["close"];
        stock.high[index]=newVals["high"];
        stock.low[index]=newVals["low"];
        stock.open[index]=newVals["open"];
        stock.x = [...stock.x];
        stock.close = [...stock.close];
      }

      // generic function to go through an array of objects and return an array of a specific key
      unpackArray = (array:any[], key:string) => {
        return array.map(array => array[key]);
      }

      // handle when new stock is selected
      onSelectStock = (newSymbol:string) => {
        this.query = ''
        if (this.dataService.symbol.value !== newSymbol) {
          this.dataService.changeSymbol(newSymbol)
          this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
        }
      }

      // handle when new start date is selected
      onDateChange = () => {
        if (this.dataService.date.value !== this.startDate) {
          this.dataService.changeDate(this.startDate)
          this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
        }
      }

      // handle when new timeframe tick is selected
      onTimeframeChange = () => {
        if (this.dataService.timeframe.value !== this.timeframe) {
          this.dataService.changeTimeframe(this.timeframe)
          this.stockService.requestHistoricalData([this.dataService.symbol.value], this.dataService.timeframe.value, this.dataService.date.value)
        }
      }

      // handle user interactions
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