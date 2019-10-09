import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2 } from '@angular/core'
import { HttpClient } from '@angular/common/http'
declare var deflate: any
import * as svg from 'save-svg-as-png'
import { DataService } from 'src/app/services/data.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  svg: any
  rectangled: any;
  png: any
  text: any = "Bob->Alice : hello"
  hiddenNotes: boolean = false;
  constructor(private http: HttpClient, private dataservice: DataService, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.generateSvg(this.text)
  }

  download() {
    svg.svgAsPngUri(document.getElementById('svgTag'), {}, (uri) => {
      this.png = uri
    })
  }

  toImage(image, text) {
    this.dataservice.img = window.URL.createObjectURL(image.files[0])
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 1 \n " + text
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
          this.dataservice.toImageNode(document)
          this.dataservice.removeStyling();
        }, 1);
      }
    )
  }

  toEllipse(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
          this.dataservice.toEllipseNode(document)
          this.dataservice.removeStyling();
        }, 1);
      }
    )
  }

  toCircles(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
          this.dataservice.toCircleNode(document)
          this.dataservice.removeStyling();
        }, 1);
      }
    )
  }

  toRounded(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
          this.dataservice.removeStyling();
        }, 1);
      }
    )
  }

  ShowNotes() {
    this.dataservice.showNotes();
  }

  HideNotes() {
    if (this.hiddenNotes) {
      this.dataservice.hideNotes();
    } else {
      this.dataservice.showNotes();
    }
  }

  toRectangle() {
    this.svg = this.rectangled;
    setTimeout(() => {
      document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
      this.dataservice.removeStyling();
      this.HideNotes();
    }, 1);
  }

  colorChange(name, color) {
    document.getElementById('svgTag').style.setProperty(`--${name}-color`, color)
    document.getElementById(name).setAttribute('value', color)
  }

  isaacStyle() {
    document.getElementById('svgTag').style.setProperty(`--primary-color`, '#009ddc')
    document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#ffffff')
    document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#fbfb77')
    document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#3a3a3a')
    document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000')

    document.getElementById('primary').setAttribute('value', '#009ddc')
    document.getElementById('secondary').setAttribute('value', '#ffffff')
    document.getElementById('tertiary').setAttribute('value', '#fbfb77')
    document.getElementById('quaternary').setAttribute('value', '#3a3a3a')
    document.getElementById('text').setAttribute('value', '#000000')
  }

  changeHidden(text) {
    this.hiddenNotes = !this.hiddenNotes;
  }

  generateSvg(text) {
    text = "skinparam roundcorner 1  \n " + text
    text = "skinparam notefontsize 12 \n " + text
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.rectangled = data
        this.toRectangle();
      }
    )
  }
}