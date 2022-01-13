import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { StockService } from '../stock.service';
import { map, max, mergeMap, tap } from 'rxjs/operators';
import { Stocks } from 'src/Interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(private stockService:StockService) {
    this.stockService.requestHistoricalData();
  }
  
  stocks:Stocks = <Stocks>{};
  dynamicStocks$ :Observable<any> = of(null);
  stockInfo$:Observable<any> = of(null);
  histStockInfo$:Observable<any> = of(null);
  x:string = ''; close:number[] = []; high:string[] = []; low:string[] = []; open:string[] = [];

  ngOnInit(): void {
    this.stockService.getStockHistoricalData().subscribe((response)=>{
      this.stocks = {
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
    })

    this.dynamicStocks$ =  this.stockService.getStockLiveData(["AAPL"]).pipe(
      tap((response)=>{
        const newVals = response["new-value"].data[0], historical = this.stocks, lastIndex = historical.x.length-1;

        historical.x[lastIndex]=newVals["timestamp"];
        historical.close[lastIndex]=newVals["close"];
        historical.high[lastIndex]=newVals["high"];
        historical.low[lastIndex]=newVals["low"];
        historical.open[lastIndex]=newVals["open"];
      }),
      map((response)=>{
              return {
                x:      this.stocks.x.slice(),
                close:  this.stocks.close.slice(),
                high:   this.stocks.high.slice(),
                low:    this.stocks.low.slice(),
                open:   this.stocks.open.slice(),
                decreasing: {line: {color: '#7F7F7F'}}, 
                increasing: {line: {color: '#17BECF'}}, 
                line: {color: 'rgba(31,119,180,1)'}, 
                type: 'candlestick', 
                xaxis: 'x', 
                yaxis: 'y', 
            }
      })
    )

    this.dynamicStocks$.subscribe(res=>{
      console.log("smell",res)
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
    
  title = 'dynamic-plots';
  // Bar Chart
  graph1 = {
    data: [
      {  
        x: [''],
        close: [''],
        high: [''],
        low: [''],
        open: ['']
    },
    ],
    layout: {
      useResizeHandler: true,
      autosize: true,
      title: 'Some Data to Hover Over',
      margin: 0,
      yaxis: {
        autorange: true, 
        fixedrange: false
      },
      xaxis: {
        autorange: true, 
        domain: [0, 1], 
        color: 'pink',
        title: 'Dates',
        rangebreaks: [
          {
            bounds: [17, 9], 
            pattern: "hour"
          }
        ]
      }}
  };

    chartChanged = () => {
      console.log("redraw")
    }
  unpackArray(array:any[], key:string) {
    return array.map(array => array[key]);
  }

  // setChartData = (data:any) => {
  //   //console.log(this.unpackArray(data.data[0].data, "timestamp"))
  //   const newData = {
  //     x: this.unpackArray(data.data[0].data, "timestamp"),
  //     close: this.unpackArray(data.data[0].data, "close"),
  //     high: this.unpackArray(data.data[0].data, "high"),
  //     low: this.unpackArray(data.data[0].data, "low"),
  //     open: this.unpackArray(data.data[0].data, "open"),
  //     decreasing: {line: {color: '#7F7F7F'}}, 
  //     increasing: {line: {color: '#17BECF'}}, 
  //     line: {color: 'rgba(31,119,180,1)'}, 
  //     type: 'candlestick', 
  //     xaxis: 'x', 
  //     yaxis: 'y' 
  //   }
  //   this.graph1.data[0]= newData;

  //   this.graph1.layout = {
  //     title: 'Some Data to Hover Over',
  //     xaxis: {
  //       color: '#123123',
  //       title: 'Dates',
  //       rangebreaks: [{
  //         bounds: ["sat", "sun"]
  //       }]
  //     }}
  //     setTimeout(()=>{
  //       const newerData = {
  //         x: this.unpackArray(data.data[1].data, "timestamp").map((time)=>new Date(time).toLocaleDateString()),
  //         close: this.unpackArray(data.data[1].data, "close"),
  //         high: this.unpackArray(data.data[1].data, "high"),
  //         low: this.unpackArray(data.data[1].data, "low"),
  //         open: this.unpackArray(data.data[1].data, "open"), 
  //         type: 'candlestick', 
  //         xaxis: 'x', 
  //         yaxis: 'y' 
  //       }
  //       this.graph1.data[0]= newerData
  //     //   newData.x.push('1/12/2022');
  //     //   newData.high.push('22');
  //     //   newData.low.push('12');
  //     //   newData.close.push('22');
  //     //   newData.open.push('12');
  //     //   this.graph1.data[0]= newData;
  //     //   console.log("yolo")
  //     },5000);
  // }

  // Line chart
  graph2 = {
    data: [
      { x: [1, 2, 3, 4, 5], y: [1, 4, 9, 4, 1], type: 'scatter' },
      { x: [1, 2, 3, 4, 5], y: [1, 3, 6, 9, 6], type: 'scatter' },
      { x: [1, 2, 3, 4, 5], y: [1, 2, 4, 5, 6], type: 'scatter' },
    ],
    layout: {title: 'Some Data to Highlight'}
  };

  interactivePlotSubject$: Subject<any> = new BehaviorSubject<any>(this.graph2.data);
  // We'll bind the hover event from plotly
hover(event: any): void {
  // The hover event has a lot of information about cursor location.
  // The bar the user is hovering over is in "pointIndex"
  this.interactivePlotSubject$.next(
    [this.graph2.data[event.points[0].pointIndex]]
  );
}
// Reset to default when hovering stops
mouseLeave(event:any): void {
  this.interactivePlotSubject$.next(this.graph2.data);
}
}
