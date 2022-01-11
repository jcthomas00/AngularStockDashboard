import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor(private newsService:NewsService) { }

  ngOnInit(): void {
    this.newsService.getGeneralNews().subscribe((data) => {
      console.log('news data', data)
    })
  }

}
