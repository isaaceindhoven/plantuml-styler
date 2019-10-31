import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
declare var deflate: any
import * as svg from 'save-svg-as-png'
import { DataService } from 'src/app/services/data.service'
import { AutoNumberService } from 'src/app/services/autonumber.service'
import { StylingService } from 'src/app/services/styling.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.prod'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, public dataservice: DataService, private autonumberservice: AutoNumberService, private stylingservice: StylingService, ) { }
  ngOnInit() {
    this.updateSVG('')
    this.generateSvg(this.dataservice.text)
    this.dataservice.getFonts().subscribe(data => {
      this.dataservice.fonts = Array.from((data as any).items);
    })

    this.dataservice.color1 = '#a80036'
    this.dataservice.color2 = '#fefece'
    this.dataservice.color3 = '#fbfb77'
    this.dataservice.color4 = '#3a3a3a'
    this.dataservice.color5 = '#000000'
    this.dataservice.color6 = '#a80036'
    this.dataservice.color7 = '#a80036'
    this.dataservice.color8 = '#fefece'
    this.dataservice.color9 = '#000000'
  }
  download() {
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1 }, (data) => {
      var zip = new JSZip();
      zip.file("code.puml", this.dataservice.text);
      zip.file("style.json", this.dataservice.saveConfig(true));
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram.png", data, { base64: true });
      zip.generateAsync({ type: "blob" })
        .then(function (blob) {
          saveAs(blob, `StyleUML_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.zip`);
        });
    });
  }
  setStyle() {
    if (this.dataservice.isThemed) {
      if (this.dataservice.selectedTheme == 'PlantUML') {
        this.plantumlStyle()
      }
      else if (this.dataservice.selectedTheme == 'ISAAC') {
        this.isaacStyle();
      }
      else if (this.dataservice.selectedTheme == 'Johan') {
        this.JohanStyle();
      }
    } else {
      this.dataservice.addColorToStyle(
        this.dataservice.color1,
        this.dataservice.color2,
        this.dataservice.color3,
        this.dataservice.color4,
        this.dataservice.color5,
        this.dataservice.color6,
        this.dataservice.color7,
        this.dataservice.color8,
        this.dataservice.color9)
    }
  }
  setFont() {
    if (document.getElementById('googlelink')) {
      document.getElementById('googlelink').setAttribute('href', 'http://fonts.googleapis.com/css?family=' + this.dataservice.selectedFont);
    } else {
      var headID = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.id = 'googlelink'
      headID.appendChild(link);
      link.href = 'http://fonts.googleapis.com/css?family=' + this.dataservice.selectedFont;
    }

    document.getElementById('svgTag').style.setProperty(`--font-stack`, this.dataservice.selectedFont)
  }
  triggerResize() {
    document.getElementById('svgTag').style.setProperty(`--font-size`, this.dataservice.selectedSize)
  }
  setImage(image, text) {
    this.dataservice.img = image;
    setTimeout(() => {
      this.generateSvg(text);
    }, 100);
  }
  setJSON(json, text) {
    this.dataservice.loadConfig(json);
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
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toImageNode()
          this.readySVG();
          if (!this.dataservice.textImages)
            this.stylingservice.removeTextFromParticipants()
        }, 1);
      }
    )
  }
  toEllipse(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toEllipseNode()
          this.readySVG();
        }, 1);
      }
    )
  }
  toCircles(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.stylingservice.toCircleNode()
          this.readySVG();
        }, 1);
      }
    )
  }
  toRectangle(text) {
    text = "skinparam roundcorner 1  \n " + text;
    text = "skinparam notefontsize 12 \n " + text;
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.readySVG();
        }, 1);
      });
  }
  resetRectangle(text) {
    text = "skinparam roundcorner 1  \n " + text;
    text = "skinparam notefontsize 12 \n " + text;
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
      });
  }
  toRounded(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.readySVG();
        }, 1);
      }
    )
  }
  ShowNotes() {
    this.dataservice.showNotes();
  }
  HideNotes() {
    if (!this.dataservice.hiddenNotes) {
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
    this.autonumberservice.setAutoNumberLabel();
    this.setActors();
    this.setBreak();
    this.setFont();
    this.setStroke();
    this.triggerResize()
  }
  setActors() {
    switch (this.dataservice.selectedActor) {
      case 'Default':
        break;
      case 'Modern':
        this.stylingservice.setNewActor();
        break;
      default:
        break;
    }
  }
  setColors() {
    if (this.dataservice.isThemed) {
      if (this.dataservice.selectedTheme == 'PlantUML') {
        this.dataservice.addColorToStyle(
          '#a80036',
          '#fefece',
          '#fbfb77',
          '#3a3a3a',
          '#000000',
          '#a80036',
          '#a80036',
          '#fefece',
          '#000000')
      }
      else if (this.dataservice.selectedTheme == 'ISAAC') {
        this.dataservice.addColorToStyle(
          '#009ddc',
          '#ffffff',
          '#f3f3f3',
          '#009ddc',
          '#000000',
          '#009ddc',
          '#009ddc',
          '#ffffff',
          '#000000')
      }
      else if (this.dataservice.selectedTheme == 'Johan') {
        this.dataservice.addColorToStyle(
          '#a6dee1',
          '#a6dee1',
          '#32bdb8',
          '#32bdb8',
          '#737373',
          '#737373',
          '#32bdb8',
          '#32bdb8',
          '#ffffff')
      }
    } else {
      this.dataservice.addColorToStyle(
        this.dataservice.color1,
        this.dataservice.color2,
        this.dataservice.color3,
        this.dataservice.color4,
        this.dataservice.color5,
        this.dataservice.color6,
        this.dataservice.color7,
        this.dataservice.color8,
        this.dataservice.color9)

    }
  }
  setStroke() {
    document.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.dataservice.participantstroke.toString())
  }
  isaacStyle() {
    this.dataservice.selectedBreak = 'Squiggly';
    this.dataservice.selectedNumber = 'Circular';
    this.dataservice.selectedShape = 'Rounded';
    this.dataservice.selectedActor = 'Modern';
    this.dataservice.selectedFont = 'Tahoma'
    this.dataservice.hiddenFootnotes = false;
    this.dataservice.hiddenShadows = true;
    this.dataservice.participantfontsize = 13;
    this.dataservice.sequencetextsize = 13;
    this.generateSvg(this.dataservice.text);
  }
  JohanStyle() {
    this.dataservice.selectedBreak = 'Squiggly';
    this.dataservice.selectedNumber = 'Circular';
    this.dataservice.selectedShape = 'Rectangle';
    this.dataservice.selectedActor = 'Modern';
    this.dataservice.selectedFont = 'Muli'
    this.dataservice.hiddenFootnotes = false;
    this.dataservice.hiddenShadows = false;
    this.dataservice.participantfontsize = 18;
    this.dataservice.sequencetextsize = 13;
    this.generateSvg(this.dataservice.text);
  }
  plantumlStyle() {
    this.dataservice.selectedBreak = 'Default';
    this.dataservice.selectedNumber = 'None';
    this.dataservice.selectedShape = 'Rectangle';
    this.dataservice.selectedActor = 'Default';
    this.dataservice.selectedFont = 'Roboto'
    this.dataservice.hiddenFootnotes = true;
    this.dataservice.hiddenShadows = true;
    this.dataservice.participantfontsize = 13;
    this.dataservice.sequencetextsize = 13;
    this.generateSvg(this.dataservice.text);
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
    if (!this.dataservice.hiddenNotes) {
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
    text = this.dataservice.changeText(text)
    setTimeout(() => {
      switch (this.dataservice.selectedShape) {
        case 'Rectangle':
          this.toRectangle(text);
          break;
        case 'Rounded':
          this.resetRectangle(text)
          this.toRounded(text);
          break;
        case 'Ellipse':
          this.resetRectangle(text)
          this.toEllipse(text);
          break;
        case 'Circle':
          this.resetRectangle(text)
          this.toCircles(text);
          break;
        case 'Images':
          this.resetRectangle(text)
          this.toImage(this.dataservice.img, text);
          break;
        default:
          this.toRectangle(text);
          break;
      }
    }, 1);
  }
  updateSVG(data) {
    if (document.getElementsByTagName('svg')[0]) {
      // this.dataservice.svg = `<svg 
      // height="${document.getElementsByTagName('svg')[0].getAttribute('height')}" 
      // width="${document.getElementsByTagName('svg')[0].getAttribute('width')}"></svg>`
      setTimeout(() => {
        this.dataservice.svg = data;
      }, 1);
    }
    else {
      this.dataservice.svg = `<svg height="1" width="1"></svg>`
    }

  }
  setBreak() {
    if (this.dataservice.selectedBreak == 'Squiggly') {
      this.stylingservice.setSquiggly();
    }
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.dataservice.actorlist = [];
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