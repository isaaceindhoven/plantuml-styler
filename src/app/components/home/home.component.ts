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
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import { ZipService } from 'src/app/services/zip.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, public dataservice: DataService, private autonumberservice: AutoNumberService, private stylingservice: StylingService, private zipservice: ZipService) { }
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
    var zip = new JSZip();
    var doc = new jsPDF('landscape', 'px');
    zip.file("code.puml", this.dataservice.text);
    var svgstring = document.getElementById('svgTag').outerHTML;
    svgstring = svgstring.replace("<defs>", `<defs>${this.getSVGStyle()}`)
    zip.file("diagram.svg", svgstring);
    zip.file("style.json", this.dataservice.saveConfig(true));
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3, backgroundColor: '#fefefe' }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram.png", data, { base64: true });
    });
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 0.5, scale: 3 }, (data) => {
      doc.addImage(data, 'PNG', 0, 0, Number.parseFloat(document.getElementById('svgTag').getAttribute('width')) / 2, Number.parseFloat(document.getElementById('svgTag').getAttribute('height')) / 2);
      zip.file("diagram.pdf", doc.save('diagram.pdf'))
    });
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3 }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram-Transparent.png", data, { base64: true });
    });
    setTimeout(() => {
      zip.generateAsync({ type: "blob" })
        .then(function (blob) {
          saveAs(blob, `StyleUML_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.zip`);
        });
    }, 500);

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
      else if (this.dataservice.selectedTheme == 'Graytone') {
        this.GrayToneStyle();
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
      document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.dataservice.selectedFont);
    } else {
      var headID = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.id = 'googlelink'
      headID.appendChild(link);
      link.href = 'https://fonts.googleapis.com/css?family=' + this.dataservice.selectedFont;
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
  fileChanged(event) {
    const file = event.target.files[0];
    var entries = this.zipservice.getEntries(file);
    entries.subscribe(data => {
      data.forEach(entry => {
        if (entry.filename == 'code.puml') {
          var newdata = this.zipservice.getData(entry);
          newdata.data.subscribe(blob => {      
            this.dataservice.loadCode(blob)  
          })
        }
        if (entry.filename == 'style.json') {
          var newdata = this.zipservice.getData(entry);
          newdata.data.subscribe(blob => {         
            this.dataservice.loadConfig(blob);           
          })
        }
      });
    })
    setTimeout(() => {
      this.setStyle();
      this.generateSvg(this.dataservice.text);
    }, 300);
  }
  setJSON(json, text) {
    // this.dataservice.loadConfig(json);
    // setTimeout(() => {
    //   this.generateSvg(text);
    // }, 100);
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
        }, 50);
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
        }, 50);
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
        }, 50);
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
        }, 50);
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
        }, 50);
      }
    )
  }
  ShowNotes() {
    this.dataservice.showNotes();
  }
  HideNotes() {
    if (this.dataservice.isThemed) {
      if (!this.dataservice.themedHiddenNotes) {
        this.dataservice.hideNotes();
      } else {
        this.dataservice.showNotes();
      }
    }
    else {
      if (!this.dataservice.hiddenNotes) {
        this.dataservice.hideNotes();
      } else {
        this.dataservice.showNotes();
      }
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
    if (this.dataservice.isThemed) {
      switch (this.dataservice.themedActor) {
        case 'Default':
          if (this.dataservice.refresh) {
            this.generateSvg(this.dataservice.text);
            this.dataservice.refresh = false;
          }
          break;
        case 'Modern':
          this.stylingservice.setNewActor();
          this.dataservice.refresh = true;
          break;
        default:
          break;
      }
    }
    else {
      switch (this.dataservice.selectedActor) {
        case 'Default':
          if (this.dataservice.refresh) {
            this.generateSvg(this.dataservice.text);
            this.dataservice.refresh = false;
          }
          break;
        case 'Modern':
          this.stylingservice.setNewActor();
          this.dataservice.refresh = true;
          break;
        default:
          break;
      }
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
      else if (this.dataservice.selectedTheme == 'Graytone') {
        this.dataservice.addColorToStyle(
          '#bfbcbc',
          '#ffffff',
          '#bfbcbc',
          '#3a3a3a',
          '#000000',
          '#bfbcbc',
          '#bfbcbc',
          '#ffffff',
          '#707070')
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
    if (this.dataservice.isThemed) {
      document.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.dataservice.themedParticipantstroke.toString())
    }
    else {
      document.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.dataservice.participantstroke.toString())
    }
  }
  isaacStyle() {
    this.dataservice.themedBreak = 'Squiggly';
    this.dataservice.themedNumber = 'Circular';
    this.dataservice.themedShape = 'Rounded';
    this.dataservice.themedActor = 'Modern';
    this.dataservice.themedFont = 'Tahoma'
    this.dataservice.themedHiddenFootnotes = false;
    this.dataservice.themedHiddenShadows = true;
    this.dataservice.themedParticipantfontsize = 13;
    this.dataservice.themedSequencetextsize = 13;
    this.generateSvg(this.dataservice.text);
  }
  JohanStyle() {
    this.dataservice.themedBreak = 'Squiggly';
    this.dataservice.themedNumber = 'Circular';
    this.dataservice.themedShape = 'Rectangle';
    this.dataservice.themedActor = 'Modern';
    this.dataservice.themedFont = 'Muli'
    this.dataservice.themedHiddenFootnotes = false;
    this.dataservice.themedHiddenShadows = false;
    this.dataservice.themedParticipantfontsize = 18;
    this.dataservice.themedSequencetextsize = 13;
    this.generateSvg(this.dataservice.text);
  }
  GrayToneStyle() {
    this.dataservice.themedBreak = 'Squiggly';
    this.dataservice.themedNumber = 'Circular';
    this.dataservice.themedShape = 'Rectangle';
    this.dataservice.themedActor = 'Modern';
    this.dataservice.themedFont = 'Open Sans'
    this.dataservice.themedHiddenFootnotes = false;
    this.dataservice.themedHiddenShadows = false;
    this.dataservice.themedParticipantfontsize = 18;
    this.dataservice.themedSequencetextsize = 13;
    this.dataservice.themedParticipantstroke = 2;
    this.generateSvg(this.dataservice.text);
  }
  plantumlStyle() {
    this.dataservice.themedBreak = 'Default';
    this.dataservice.themedNumber = 'None';
    this.dataservice.themedShape = 'Rectangle';
    this.dataservice.themedActor = 'Default';
    this.dataservice.themedFont = 'Roboto'
    this.dataservice.themedHiddenFootnotes = true;
    this.dataservice.themedHiddenShadows = true;
    this.dataservice.themedParticipantfontsize = 13;
    this.dataservice.themedSequencetextsize = 13;
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
    if (this.dataservice.isThemed) {
      if (!this.dataservice.themedHiddenNotes) {
        this.HideNotes()
      }
      else {
        this.ShowNotes()
      }
    } else {
      if (!this.dataservice.hiddenNotes) {
        this.HideNotes()
      }
      else {
        this.ShowNotes()
      }
    }
  }
  changeFootnotes(text) {
    this.generateSvg(text)
  }
  generateSvg(text: string) {
    console.log("generating...");
    text = this.dataservice.changeText(text)
    if (this.dataservice.isThemed) {
      setTimeout(() => {
        switch (this.dataservice.themedShape) {
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
      }, 50);
    } else {
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
      }, 80);
    }
  }
  updateSVG(data) {
    if (document.getElementsByTagName('svg')[0]) {
      // this.dataservice.svg = `<svg 
      // height="${document.getElementsByTagName('svg')[0].getAttribute('height')}" 
      // width="${document.getElementsByTagName('svg')[0].getAttribute('width')}"></svg>`
      setTimeout(() => {
        this.dataservice.svg = data;
      }, 50);
    }
    else {
      this.dataservice.svg = `<svg height="1" width="1"></svg>`
    }

  }
  setBreak() {
    if (this.dataservice.isThemed) {
      if (this.dataservice.themedBreak == 'Squiggly') {
        this.stylingservice.setSquiggly();
      }
    } else {
      if (this.dataservice.selectedBreak == 'Squiggly') {
        this.stylingservice.setSquiggly();
      }
    }
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.dataservice.actorlist = [];
      var newtext = text.split('actor ')[1];
      if (newtext) {
        var actor = (newtext.split('\n')[0]).trim();
        newtext = text.replace(`actor ${actor}`, '')
        this.dataservice.addToActors(actor)
      } else {
        newtext = text.split('actor')[1];
      }

      while (newtext.includes('actor')) {
        var newer = newtext;
        var newtext2 = newtext.split('actor ')[1];
        if (newtext2) {
          var actor = (newtext2.split('\n')[0]).trim();
          newtext = newer.replace(`actor ${actor}`, '')
          this.dataservice.addToActors(actor)
        } else {
          newtext = newtext.split('actor')[1];
        }


      }
    }
  }
  getSVGStyle() {
    return `<style>svg g ellipse,
    svg g circle,
    svg g rect {
      stroke: var(--primary-color);
      stroke-width: var(--participant-stroke-width);
      /* fill: url(#image); */
      fill: var(--secondary-color);
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g path {
      fill: var(--tertiary-color);
      stroke: var(--quaternary-color);
      stroke-width: 1.5;
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g polygon {
      fill: var(--line-color);
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g line,
    svg g polyline {
      stroke: var(--line-color);
      stroke-width: 1px;
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g text {
      fill: var(--text-color);
      font-family: var(--font-stack), "Tahoma";
      font-size: 14;
    }
    
    svg g line.dashed {
      stroke-dasharray: 5, 5;
      animation: dash 1s infinite;
    }
    
    svg g line.dotted {
      stroke-dasharray: 2, 2;
      animation: dash 1s infinite;
    }
    
    svg g line.skipped {
      stroke-dasharray: 1, 4;
      animation: dash 1s infinite;
    }
    
    svg g line.labelDivider {
      stroke-width: 2px;
    }
    
    svg g .label {
      stroke: var(--label-border-color);
      fill: var(--label-background-color);
    }
    svg g .labelText {
      fill: var(--label-text-color);
    }
    
    svg g path.actor {
      stroke: var(--primary-color);
      stroke-width: 2;
    }
    
    svg g path.note {
      stroke: var(--quaternary-color);
      fill: var(--tertiary-color);
      stroke-width: 1;
    }
    
    svg g .transparent {
      fill: none;
    }
    
    svg g path.database {
      fill: var(--secondary-color);
      stroke: var(--primary-color);
      stroke-width: 1.5px;
    }</style>`;
  }
}