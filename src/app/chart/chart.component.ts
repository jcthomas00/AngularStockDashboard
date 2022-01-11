import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor(private stockService:StockService) {
    this.stockService.requestHistoricalData();
  }
  stockInfo$:Observable<any> = of(null);

  ngOnInit(): void {
    // this.stockInfo$ = this.stockService.getStockHistoricalData().pipe(
    //   map((data)=>{return{

    //   }})
    // )
    this.stockService.getStockHistoricalData().subscribe((data)=>{
      console.log(data);
      this.setChartData(data);
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
        // decreasing: {line: {color: '#7F7F7F'}}, 
        // increasing: {line: {color: '#17BECF'}}, 
        // line: {color: 'rgba(31,119,180,1)'}, 
        // type: 'candlestick', 
        // xaxis: 'x', 
        // yaxis: 'y' 
    },
    ],
    layout: {}
  };
  unpackArray(array:any[], key:string) {
    return array.map(array => array[key]);
  }
  setChartData = (data:any) => {
    //console.log(this.unpackArray(data.data[0].data, "timestamp"))
    const newData = {
      x: this.unpackArray(data.data[0].data, "timestamp"),
      close: this.unpackArray(data.data[0].data, "close"),
      high: this.unpackArray(data.data[0].data, "high"),
      low: this.unpackArray(data.data[0].data, "low"),
      open: this.unpackArray(data.data[0].data, "open"),
      decreasing: {line: {color: '#7F7F7F'}}, 
      increasing: {line: {color: '#17BECF'}}, 
      line: {color: 'rgba(31,119,180,1)'}, 
      type: 'candlestick', 
      xaxis: 'x', 
      yaxis: 'y' 
    }
    this.graph1.data[0]= newData;
    this.graph1.layout = {
      title: 'Some Data to Hover Over',
      xaxis: {
        title: 'Date',
        autorange: true
      }}
      setTimeout(()=>{
        const newerData = {
          x: this.unpackArray(data.data[1].data, "timestamp").map((time)=>new Date(time).toLocaleDateString()),
          close: this.unpackArray(data.data[1].data, "close"),
          high: this.unpackArray(data.data[1].data, "high"),
          low: this.unpackArray(data.data[1].data, "low"),
          open: this.unpackArray(data.data[1].data, "open"), 
          type: 'candlestick', 
          xaxis: 'x', 
          yaxis: 'y' 
        }
        this.graph1.data[0]= newerData
      //   newData.x.push('1/12/2022');
      //   newData.high.push('22');
      //   newData.low.push('12');
      //   newData.close.push('22');
      //   newData.open.push('12');
      //   this.graph1.data[0]= newData;
      //   console.log("yolo")
      },5000);
  }

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
