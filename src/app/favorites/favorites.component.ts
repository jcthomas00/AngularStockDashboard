import { Component, Input } from '@angular/core';
import { Stocks } from 'src/Interfaces';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})

export class FavoritesComponent {
  @Input() stock:Stocks = <Stocks>{};

  
}
