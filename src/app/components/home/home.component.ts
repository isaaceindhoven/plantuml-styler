import { Component, OnInit } from '@angular/core'
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
  constructor(private http: HttpClient, private dataservice: DataService) { }
  ngOnInit() {
    this.generateSvg(this.text)
  }
  download() {
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1 }, (uri) => {
      var a = document.createElement('a');
      a.download = "image.png";
      a.href = uri
      document.body.appendChild(a);
      a.click();
    })
  }
  toImage(image, text) {
    this.dataservice.img = window.URL.createObjectURL(image.files[0])
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 1 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[1].setAttribute('id', 'svgTag');
          this.dataservice.findNamesInText();
          this.dataservice.toImageNode(document)
          this.dataservice.removeStyling();
          this.addListners();
          this.setColors()
          this.dataservice.removeTextFromParticipants()
        }, 1);
      }
    )
  }
  toEllipse(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[1].setAttribute('id', 'svgTag');
          this.dataservice.toEllipseNode(document)
          this.dataservice.removeStyling();
          this.addListners();
          this.setColors()
          this.dataservice.findNamesInText();
        }, 1);
      }
    )
  }
  toCircles(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[1].setAttribute('id', 'svgTag');
          this.dataservice.toCircleNode(document)
          this.dataservice.removeStyling();
          this.addListners();
          this.setColors()
          this.dataservice.findNamesInText();
        }, 1);
      }
    )
  }
  toRounded(text) {
    this.toRectangle();
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          document.getElementsByTagName('svg')[1].setAttribute('id', 'svgTag');
          this.dataservice.removeStyling();
          if (this.hiddenNotes) {
            this.HideNotes();
          }
          else {
            this.ShowNotes()
          }
          this.addListners();
          this.setColors()
          this.dataservice.findNamesInText();
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
      document.getElementsByTagName('svg')[1].setAttribute('id', 'svgTag');
      this.dataservice.removeStyling();
      this.HideNotes();
      this.addListners();
      this.setColors();
      this.dataservice.findNamesInText();
    }, 1);
  }
  private setColors() {
    this.setColorChanges('primary')
    this.setColorChanges('secondary')
    this.setColorChanges('tertiary')
    this.setColorChanges('quaternary')
    this.setColorChanges('text')
  }
  private setColorChanges(name) {
    this.colorChange(name, (document.getElementById(name) as HTMLInputElement).value);
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
    document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');

    (document.getElementById('primary') as HTMLInputElement).value = '#009ddc';
    (document.getElementById('secondary') as HTMLInputElement).value = '#ffffff';
    (document.getElementById('tertiary') as HTMLInputElement).value = '#fbfb77';
    (document.getElementById('quaternary') as HTMLInputElement).value = '#3a3a3a';
    (document.getElementById('text') as HTMLInputElement).value = '#000000';
  }
  addListners() {
    this.dataservice.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.addListenersTo(element)
      }
    })
    this.dataservice.getTagList('image').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
    })
    this.dataservice.getTagList('ellipse').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
    })
    this.dataservice.getTagList('circle').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
    })
    this.dataservice.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'participant') {
        this.addListenersTo(element)
      }
    })
  }
  addListenersTo(element) {
    element.addEventListener('mouseover', () => {
      this.ShowNotes();
    });
    element.addEventListener('mouseenter', () => {
      this.ShowNotes();
    });
    element.addEventListener('mouseleave', () => {
      this.HideNotes();
    })
  }
  changeHidden() {
    this.hiddenNotes = !this.hiddenNotes;
    if (this.hiddenNotes) {
      this.HideNotes()
    }
    else {
      this.ShowNotes()
    }
  }
  generateSvg(text: string) {
    text = "skinparam roundcorner 1  \n " + text;
    text = "skinparam notefontsize 12 \n " + text;
    text = this.dataservice.replaceAll(text, 'Actor', 'actor')
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.rectangled = data
        this.toRectangle();
        this.addListners();
      }
    )
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.dataservice.actors = [];
      var newtext = text.split('actor ')[1];
      var actor = newtext.split('\n')[0];
      newtext = text.replace(`actor ${actor}`, '')
      this.dataservice.addToActors(actor)
      console.log(newtext);
      while (newtext.includes('actor')) {
        var newer = newtext;
        var newtext2 = newtext.split('actor ')[1];
        var actor = newtext2.split('\n')[0];
        newtext = newer.replace(`actor ${actor}`, '')
        this.dataservice.addToActors(actor)
        console.log(newtext);
      }
    }
  }
}