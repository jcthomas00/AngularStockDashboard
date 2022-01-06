import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {

  list:string[] = [];
  constructor(private stockService:StockService) { }

  ngOnInit(): void {
    this.stockService.requestStockList();
    this.stockService.getStockList().subscribe((data) => {
      this.list=data; 
      console.log(data)
    })
    this.stockService.getStockLiveData(['FACE', 'APPL', 'jhfcegrj']).subscribe((data:any) => {
      //this.list=data; 
      console.log(data)
    })
  }

}
