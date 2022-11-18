import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit, OnChanges {
  options: string[] = [];
  keyword: string = '';
  timer: any = null;
  activate: boolean = false;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987508, lng: -77.2532699 },
    zoom : 14
  }
  marker = {
    position: { lat: 38.9287208, lng: -77.3538699 },
  }
  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
  }

  getStatePosition(state: string) {
    const googleKey = `AIzaSyD3YtJ6XZSPDDd7DXnsOeAWdUIx2Q1SWRs`;
    this.httpClient.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + state + "&key=" + googleKey)
      .subscribe((data:any) => {
        let result = data.results[0].geometry.location;
        let lat = result.lat;
        let lng = result.lng;
        this.mapOptions = {
          center: { lat, lng },
          zoom : 14
        }
        this.marker = {
          position: { lat, lng},
        }
      })
  }

  chooseOption(option: string) {
    this.keyword = option;
    this.activate = false;
    this.options = [];
    this.getStatePosition(option);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['keyword']) {

    }
  }

  handleInput() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.keyword) {
        this.httpClient.get(`http://localhost:8080/${this.keyword}`)
          .subscribe(data => {
            this.options = data as string[];
            this.activate = true;
          })
      }

    }, 300);

  }
}
