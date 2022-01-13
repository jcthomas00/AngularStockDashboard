import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(private newsService:NewsService) { }

  newsList$:Observable<any> = of(null);

  ngOnInit(): void {
    //this.newsList$ = this.newsService.getGeneralNews();
  }

}
