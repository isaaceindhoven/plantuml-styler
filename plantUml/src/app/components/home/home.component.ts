import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var deflate: any;
import * as svg from 'save-svg-as-png';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  svg: any;
  png: any;
  text: any = "Bob->Alice : hello";
  constructor(private http: HttpClient, private dataservice: DataService, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.generateSvg(this.text)
  }

  download() {
    svg.svgAsPngUri(document.getElementById('svgTag'), {}, (uri) => {
      this.png = uri;
    });
  }

  colorChange(name, color) {
    this.el.nativeElement.style.setProperty(`--${name}-color`, color);
  }

  generateSvg(text) {
    var t = unescape(encodeURIComponent(text));
    console.log(t)

    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = this.dataservice.removeStyling(data);
      }
    )

  }



}
