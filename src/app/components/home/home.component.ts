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

  constructor(private http: HttpClient, private dataservice: DataService, private autonumberservice: AutoNumberService, private stylingservice: StylingService, ) { }
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
    if (this.dataservice.isThemed) {
      if (this.dataservice.selectedTheme == 'PlantUML') {
        this.plantumlStyle()
      }
      else if (this.dataservice.selectedTheme == 'ISAAC') {
        this.isaacStyle();
      }
    } else {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, this.dataservice.color1)
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, this.dataservice.color2)
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, this.dataservice.color3)
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, this.dataservice.color4)
      document.getElementById('svgTag').style.setProperty(`--text-color`, this.dataservice.color5);
      document.getElementById('svgTag').style.setProperty(`--line-color`, this.dataservice.color6);
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
  toImage(image, text) {
    this.stylingservice.img = window.URL.createObjectURL(image.files[0])
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 1 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
      });
  }
  toRounded(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get("http://www.plantuml.com/plantuml/svg/" + this.dataservice.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.setAutoNumberLabel();
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
        document.getElementById('svgTag').style.setProperty(`--primary-color`, '#a80036')
        document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#fefece')
        document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#fbfb77')
        document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#3a3a3a')
        document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');
        document.getElementById('svgTag').style.setProperty(`--line-color`, '#a80036');
      }
      else if (this.dataservice.selectedTheme == 'ISAAC') {
        document.getElementById('svgTag').style.setProperty(`--primary-color`, '#009ddc')
        document.getElementById('svgTag').style.setProperty(`--secondary-color`, '#ffffff')
        document.getElementById('svgTag').style.setProperty(`--tertiary-color`, '#f3f3f3')
        document.getElementById('svgTag').style.setProperty(`--quaternary-color`, '#009ddc')
        document.getElementById('svgTag').style.setProperty(`--text-color`, '#000000');
        document.getElementById('svgTag').style.setProperty(`--line-color`, '#009ddc');
      }
    } else {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, this.dataservice.color1)
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, this.dataservice.color2)
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, this.dataservice.color3)
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, this.dataservice.color4)
      document.getElementById('svgTag').style.setProperty(`--text-color`, this.dataservice.color5);
      document.getElementById('svgTag').style.setProperty(`--line-color`, this.dataservice.color6);
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
    this.generateSvg(this.dataservice.text);
  }
  plantumlStyle() {
    this.dataservice.selectedBreak = 'Default';
    this.dataservice.selectedNumber = 'None';
    this.dataservice.selectedShape = 'Rectangle';
    this.dataservice.selectedActor = 'Default';
    this.dataservice.selectedFont = 'Roboto'
    this.dataservice.hiddenFootnotes = true;
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
    this.dataservice.text = text;
    text = this.dataservice.replaceAll(text, 'Actor', 'actor')
    if (!this.dataservice.hiddenFootnotes)
      text = 'hide footbox \n' + text
    if (!this.dataservice.hiddenShadows)
      text = 'skinparam Shadowing false \n' + text

    text = `skinparam   ParticipantPadding  ${this.dataservice.participantpadding} \n` + text
    text = `skinparam   ParticipantFontSize ${this.dataservice.participantfontsize} \n` + text
    text = `skinparam   ActorFontSize ${this.dataservice.participantfontsize} \n` + text
    text = `skinparam   ArrowFontSize  ${this.dataservice.sequencetextsize} \n` + text

    text = 'skinparam SequenceDividerFontSize 14 \n' + text
    text = 'skinparam SequenceDividerFontSize 14 \n' + text
    switch (this.dataservice.selectedNumber) {
      case 'None':
        break;
      case 'Default':
        text = 'autonumber 1\n' + text;
        this.autonumberservice.clearLabels();
        break;
      case 'Circular':
        text = 'autonumber 1\n' + text;
        text = `skinparam   Padding  4 \n` + text
        break;
      case 'Rectangular':
        text = 'autonumber 1\n' + text;
        text = `skinparam   Padding  4 \n` + text
        break;
      case 'Rectangular-Framed':
        text = `skinparam   Padding  4 \n` + text
        text = 'autonumber 1\n' + text;
        break;
      case 'Circular-Framed':
        text = `skinparam   Padding  4 \n` + text
        text = 'autonumber 1\n' + text;
        break;
      case 'Rounded-Framed':
        text = `skinparam   Padding  4 \n` + text
        text = 'autonumber 1\n' + text;
        break;
      case 'Rounded':
        text = `skinparam   Padding  4 \n` + text
        text = 'autonumber 1\n' + text;
        break;
      default:
        break;
    }
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
    }, 100);
  }
  updateSVG(data) {
    if (document.getElementsByTagName('svg')[0]) {
      this.dataservice.svg = '<svg></svg>'
      setTimeout(() => {
        this.dataservice.svg = data;
      }, 1);
    }
    else {
      this.dataservice.svg = '<svg></svg>'
    }

  }
  setAutoNumberLabel() {
    if (this.dataservice.selectedNumber == 'Circular') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberCircular();
    } else if (this.dataservice.selectedNumber == 'Rectangular') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRectangular();
    } else if (this.dataservice.selectedNumber == 'Rectangular-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRectangularFramed();
    } else if (this.dataservice.selectedNumber == 'Rounded-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRoundedFramed();
    } else if (this.dataservice.selectedNumber == 'Circular-Framed') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberCircularFramed();
    } else if (this.dataservice.selectedNumber == 'Rounded') {
      this.autonumberservice.clearLabels();
      this.autonumberservice.setAutonumberRounded();
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