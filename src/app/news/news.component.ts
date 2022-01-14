import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from '../data.service';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(private newsService:NewsService, private dataService:DataService) { }

  newsList$:Observable<any> = of(null);

  ngOnInit(): void {
    this.dataService.symbol.subscribe(symbol => {
      if(symbol === ''){
        this.newsList$ = this.newsService.getGeneralNews();
      }else{
        this.newsList$ = this.newsService.getStockNews(symbol);
      }
    })
  }

}
