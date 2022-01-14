import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges {

  @Input() location = '';
  safeMapLink: SafeResourceUrl = 'Space+Needle,Seattle+WA';
  staticMapLink: SafeResourceUrl = '';
  constructor(public sanitizer:DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.safeMapLink= this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/place?key=AIzaSyCzzvxmhc8TkqHA5lg-wPbNxedKbwes7-U&q=${this.location}`
    );
    this.staticMapLink= this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.googleapis.com/maps/api/staticmap?center=${this.location}&zoom=13&size=500x500&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318&markers=color:red%7Clabel:C%7C40.718217,-73.998284&key=AIzaSyCzzvxmhc8TkqHA5lg-wPbNxedKbwes7-U&map_id=493ee6c0b8a901d9`
    );
  }

}
