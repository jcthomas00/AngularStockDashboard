import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StocksComponent } from './stocks/stocks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import firebase modules
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

// Custom components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { ChartComponent } from './chart/chart.component';
import { FavoritesComponent } from './favorites/favorites.component';

// Angular Material modules
import { MatSliderModule } from '@angular/material/slider'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCommonModule} from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Plotly imports
import * as PlotlyJS from 'plotly.js-dist';
import { PlotlyModule } from 'angular-plotly.js';
import { NewsComponent } from './news/news.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    StocksComponent,
    FavoritesComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AboutComponent,
    ChartComponent,
    NewsComponent,
    CompanyInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatSliderModule,
    MatDatepickerModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    PlotlyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
