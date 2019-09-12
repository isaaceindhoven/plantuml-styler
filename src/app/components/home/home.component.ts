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

  isaacStyle() {
    document.getElementById('svgTag').style.setProperty(`--primary-color`, '#009ddc');
    document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#ffffff');
    document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#fbfb77');
    document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#3a3a3a');
    document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');

    document.getElementById('primary').setAttribute('value', '#009ddc')
    document.getElementById('secondary').setAttribute('value', '#ffffff')
    document.getElementById('tertiary').setAttribute('value', '#fbfb77')
    document.getElementById('quaternary').setAttribute('value', '#3a3a3a')
    document.getElementById('text').setAttribute('value', '#000000')
  }

  colorChange(name, color) {
    document.getElementById('svgTag').style.setProperty(`--${name}-color`, color);
    document.getElementById(name).setAttribute('value', color)

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
