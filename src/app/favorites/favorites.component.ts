import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { StockService } from '../stock.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})

export class FavoritesComponent {

  favorites:string[] = []
  query:string = ''
  symbols:string[] = [];

  constructor(private dataService:DataService, private userService:UserService, private stockService:StockService){
    dataService.getFavoritesSymbols().subscribe((symbols:string[]) => {
      this.favorites = symbols;
      console.log("syms", symbols)
    })
    this.stockService.getStockList().subscribe(list => {
      this.symbols = list.symbols;
    });
  }

  addFavorite = (symbol:string) => {
    if(this.favorites.indexOf(symbol) < 0){
      this.favorites.push(symbol)
    }
    this.dataService.setFavoritesSymbol(this.favorites);
  }

  onSelectStock = (newSymbol:string) => {
    this.query = '';
    this.addFavorite(newSymbol);
    this.dataService.changeSymbol(newSymbol);
  }

  deleteStock(index:number): void {
    this.favorites.splice(index, 1)
    this.dataService.setFavoritesSymbol(this.favorites);
  }
  
}
