import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatButtonToggleModule} from '@angular/material/button-toggle';

// Plotly imports
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { NewsComponent } from './news/news.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { MapComponent } from './map/map.component';
import { ComparisonChartComponent } from './comparison-chart/comparison-chart.component';
import { CurrentInfoComponent } from './current-info/current-info.component';
import { IndexChartComponent } from './index-chart/index-chart.component';
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
    CompanyInfoComponent,
    SearchFilterPipe,
    MapComponent,
    ComparisonChartComponent,
    CurrentInfoComponent,
    IndexChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCommonModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
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
