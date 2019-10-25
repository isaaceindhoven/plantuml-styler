import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
declare var deflate: any
import * as svg from 'save-svg-as-png'
import { DataService } from 'src/app/services/data.service'
import { AutoNumberService } from 'src/app/services/autonumber.service'
import { StylingService } from 'src/app/services/styling.service'

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
  hiddenNotes: boolean = true;
  hiddenFootnotes: boolean = true;
  hiddenShadows: boolean = true;
  isThemed: boolean = false;
  textImages: boolean = false;
  participantpadding = 0;
  participantfontsize = 13;
  sequencetextsize = 13;
  shapes = ['Rectangle', 'Rounded', 'Ellipse', 'Circle'];
  autonumber = ['None', 'Default', 'Circular', 'Rectangular', 'Rounded', 'Rectangular-Framed', 'Circular-Framed', 'Rounded-Framed'];
  actors = ['Default', 'Modern'];
  breaks = ['Default', 'Squiggly'];
  fonts = ['Tahoma'];
  themes = ['PlantUML', 'ISAAC'];
  color1 = '';
  color2 = '';
  color3 = '';
  color4 = '';
  color5 = '';
  selectedSize = '14'
  selectedTheme = 'PlantUML';
  selectedFont = 'Tahoma';
  selectedBreak = 'Default';
  selectedActor = 'Default';
  selectedShape = 'Rectangle';
  selectedNumber = 'None';
  img;
  constructor(private http: HttpClient, private dataservice: DataService, private autonumberservice: AutoNumberService, private stylingservice: StylingService, ) { }
  ngOnInit() {
    this.generateSvg(this.text)
    this.dataservice.getFonts().subscribe(data => {
      this.fonts = Array.from((data as any).items);
    })

    this.color1 = '#a80036'
    this.color2 = '#fefece'
    this.color3 = '#fbfb77'
    this.color4 = '#3a3a3a'
    this.color5 = '#000000'
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
  setStyle() {
    if (this.isThemed) {
      if (this.selectedTheme == 'PlantUML') {
        this.plantumlStyle()
      }
      else if (this.selectedTheme == 'ISAAC') {
        this.isaacStyle();
      }
    } else {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, this.color1)
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, this.color2)
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, this.color3)
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, this.color4)
      document.getElementById('svgTag').style.setProperty(`--text-color`, this.color5);
    }
  }
  setFont() {
    if (document.getElementById('googlelink')) {
      document.getElementById('googlelink').setAttribute('href', 'http://fonts.googleapis.com/css?family=' + this.selectedFont);
    } else {
      var headID = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.id = 'googlelink'
      headID.appendChild(link);
      link.href = 'http://fonts.googleapis.com/css?family=' + this.selectedFont;
    }

    document.getElementById('svgTag').style.setProperty(`--font-stack`, this.selectedFont)
  }
  triggerResize() {
    document.getElementById('svgTag').style.setProperty(`--font-size`, this.selectedSize)
  }
  setImage(image, text) {
    this.img = image;
    setTimeout(() => {
      this.generateSvg(text);
    }, 100);
  }
  toImage(image, text) {
    this.stylingservice.img = window.URL.createObjectURL(image.files[0])
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 1 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toImageNode()
          this.readySVG();
          if (!this.textImages)
            this.stylingservice.removeTextFromParticipants()
        }, 50);
      }
    )
  }
  toEllipse(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toEllipseNode()
          this.readySVG();
        }, 50);
      }
    )
  }
  toCircles(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toCircleNode()
          this.readySVG();
        }, 50);
      }
    )
  }
  toRectangle(text) {
    text = "skinparam roundcorner 1  \n " + text;
    text = "skinparam notefontsize 12 \n " + text;
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          this.setSvgTag();
          this.readySVG();
        }, 50);
      });
  }
  toRounded(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
        setTimeout(() => {
          this.setSvgTag();
          this.readySVG();
        }, 50);
      }
    )
  }
  ShowNotes() {
    this.dataservice.showNotes();
  }
  HideNotes() {
    if (!this.hiddenNotes) {
      this.dataservice.hideNotes();
    } else {
      this.dataservice.showNotes();
    }
  }
  setSvgTag() {
    document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
  }
  readySVG() {
    this.stylingservice.removeStyling();
    this.HideNotes();
    this.setColors()
    this.stylingservice.findNamesInText();
    this.addListners();
    this.setAutoNumberLabel();
    this.setActors();
    this.setBreak();
    this.setFont();
    this.triggerResize()
  }
  setActors() {
    switch (this.selectedActor) {
      case 'Default':
        break;
      case 'Modern':
        this.stylingservice.setNewActor();
        break;
      default:
        break;
    }
  }
  private setColors() {
    if (this.isThemed) {
      if (this.selectedTheme == 'PlantUML') {
        document.getElementById('svgTag').style.setProperty(`--primary-color`, '#a80036')
        document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#fefece')
        document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#fbfb77')
        document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#3a3a3a')
        document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');
      }
      else if (this.selectedTheme == 'ISAAC') {
        document.getElementById('svgTag').style.setProperty(`--primary-color`, '#009ddc')
        document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#ffffff')
        document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#f3f3f3')
        document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#009ddc')
        document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');
      }
    } else {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, this.color1)
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, this.color2)
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, this.color3)
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, this.color4)
      document.getElementById('svgTag').style.setProperty(`--text-color`, this.color5);
    }
  }
  isaacStyle() {
    this.selectedBreak = 'Squiggly';
    this.selectedNumber = 'Circular';
    this.selectedShape = 'Rounded';
    this.selectedActor = 'Modern';
    this.selectedFont = 'Tahoma'
    this.hiddenFootnotes = false;
    this.generateSvg(this.text);
  }
  plantumlStyle() {
    this.selectedBreak = 'Default';
    this.selectedNumber = 'None';
    this.selectedShape = 'Rectangle';
    this.selectedActor = 'Default';
    this.selectedFont = 'Roboto'
    this.hiddenFootnotes = true;
    this.generateSvg(this.text);
  }
  addListners() {
    this.dataservice.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.addListenersTo(element)
        this.addListenersTo(element.nextElementSibling)
      }
    })
    this.dataservice.getTagList('image').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.dataservice.getTagList('ellipse').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.dataservice.getTagList('circle').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    // this.dataservice.getTagList('text').forEach((element: SVGRectElement) => {
    //   if (element.getAttribute('name') == 'participant') {
    //     this.addListenersTo(element)
    //   }
    // })
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
    if (!this.hiddenNotes) {
      this.HideNotes()
    }
    else {
      this.ShowNotes()
    }
  }
  changeFootnotes(text) {
    this.generateSvg(text)
  }
  generateSvg(text: string) {
    this.text = text;
    text = this.dataservice.replaceAll(text, 'Actor', 'actor')
    if (!this.hiddenFootnotes)
      text = 'hide footbox \n' + text
    if (!this.hiddenShadows)
      text = 'skinparam Shadowing false \n' + text

    text = `skinparam   ParticipantPadding  ${this.participantpadding} \n` + text
    text = `skinparam   ParticipantFontSize ${this.participantfontsize} \n` + text
    text = `skinparam   ActorFontSize ${this.participantfontsize} \n` + text
    text = `skinparam   ArrowFontSize  ${this.sequencetextsize} \n` + text

    text = 'skinparam SequenceDividerFontSize 14 \n' + text
    text = 'skinparam SequenceDividerFontSize 14 \n' + text
    switch (this.selectedNumber) {
      case 'None':
        break;
      case 'Default':
        text = 'autonumber 1\n' + text;
        this.autonumberservice.clearLabels();
        break;
      case 'Circular':
        text = 'autonumber 1\n' + text;
        break;
      case 'Rectangular':
        text = 'autonumber 1\n' + text;
        break;
      case 'Rectangular-Framed':
        text = 'autonumber 1\n' + text;
        break;
      case 'Circular-Framed':
        text = 'autonumber 1\n' + text;
        break;
      case 'Rounded-Framed':
        text = 'autonumber 1\n' + text;
        break;
      case 'Rounded':
        text = 'autonumber 1\n' + text;
        break;
      default:
        break;
    }
    this.clearSVG();
    setTimeout(() => {
      switch (this.selectedShape) {
        case 'Rectangle':
          this.toRectangle(text);
          break;
        case 'Rounded':
          this.toRounded(text);
          break;
        case 'Ellipse':
          this.toEllipse(text);
          break;
        case 'Circle':
          this.toCircles(text);
          break;
        case 'Images':
          this.toImage(this.img, text);
          break;
        default:
          this.toRectangle(text);
          break;
      }
    }, 100);
  }
  clearSVG() {
    if (document.getElementsByTagName('svg')[0]) {
      this.svg = `<svg 
      height="${document.getElementsByTagName('svg')[0].getAttribute('height')}" 
      width="${document.getElementsByTagName('svg')[0].getAttribute('width')}">
      </svg>`
    }
    else {
      this.svg = ''
    }

  }
  setAutoNumberLabel() {
    if (this.selectedNumber == 'Circular') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberCircular();
    } else if (this.selectedNumber == 'Rectangular') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRectangular();
    } else if (this.selectedNumber == 'Rectangular-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRectangularFramed();
    } else if (this.selectedNumber == 'Rounded-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRoundedFramed();
    } else if (this.selectedNumber == 'Circular-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberCircularFramed();
    } else if (this.selectedNumber == 'Rounded') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRounded();
    }
  }
  setBreak() {
    if (this.selectedBreak == 'Squiggly') {
      this.stylingservice.setSquiggly();
    }
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.dataservice.actors = [];
      var newtext = text.split('actor ')[1];
      var actor = (newtext.split('\n')[0]).trim();
      newtext = text.replace(`actor ${actor}`, '')
      this.dataservice.addToActors(actor)
      while (newtext.includes('actor')) {
        var newer = newtext;
        var newtext2 = newtext.split('actor ')[1];
        var actor = (newtext2.split('\n')[0]).trim();
        newtext = newer.replace(`actor ${actor}`, '')
        this.dataservice.addToActors(actor)
      }
    }
  }
}