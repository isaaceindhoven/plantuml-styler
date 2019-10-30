import { Injectable } from '@angular/core';
import { filter } from 'minimatch';
import { HttpClient } from '@angular/common/http';
import { AutoNumberService } from './autonumber.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  actorlist: string[] = [];
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
  participantstroke = 1.5;
  sequencetextsize = 13;
  shapes = ['Rectangle', 'Rounded', 'Ellipse', 'Circle'];
  autonumber = ['None', 'Default', 'Circular', 'Rectangular', 'Rounded', 'Rectangular-Framed', 'Circular-Framed', 'Rounded-Framed'];
  actors = ['Default', 'Modern'];
  breaks = ['Default', 'Squiggly'];
  fonts = ['Tahoma'];
  themes = ['PlantUML', 'ISAAC', 'Johan'];
  color1 = '';
  color2 = '';
  color3 = '';
  color4 = '';
  color5 = '';
  color6 = '';
  color7 = '';
  color8 = '';
  color9 = '';
  selectedSize = '14'
  selectedTheme = 'PlantUML';
  selectedFont = 'Tahoma';
  selectedBreak = 'Default';
  selectedActor = 'Default';
  selectedShape = 'Rectangle';
  selectedNumber = 'None';
  img;
  encode64(data) {
    var r = "";
    for (var i = 0; i < data.length; i += 3) {
      if (i + 2 == data.length) {
        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
      } else if (i + 1 == data.length) {
        r += this.append3bytes(data.charCodeAt(i), 0, 0);
      } else {
        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
          data.charCodeAt(i + 2));
      }
    }
    return r;
  }
  append3bytes(b1, b2, b3) {
    var c1 = b1 >> 2;
    var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    var c4 = b3 & 0x3F;
    var r = "";
    r += this.encode6bit(c1 & 0x3F);
    r += this.encode6bit(c2 & 0x3F);
    r += this.encode6bit(c3 & 0x3F);
    r += this.encode6bit(c4 & 0x3F);
    return r;
  }
  encode6bit(b) {
    if (b < 10) {
      return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
      return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
      return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b == 0) {
      return '-';
    }
    if (b == 1) {
      return '_';
    }
    return '?';
  }
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  hideNotes() {
    this.getTagList('path').forEach((element: SVGRectElement) => {
      if (element.getAttribute('class') == null) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    this.getTagList('polygon').forEach((element: SVGRectElement) => {
      if (element.getAttribute('points').split(',').length >= 9) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    this.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-size') == '12') {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
  }
  showNotes() {
    var notes: any = document.getElementsByName('note')
    var list = Array.from(notes);
    list.forEach((element: SVGRectElement) => {
      element.setAttribute('display', '');
    });
  }
  getTagList(type) {
    return Array.from(document.getElementsByTagName(type));
  }
  addToActors(actor) {
    this.actorlist.push(actor);
  }
  getFonts() {
    return this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw');
  }
  clearLabels() {
    this.getTagList('circle').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
  }
  changeText(text: string) {
    this.text = text;
    text = this.replaceAll(text, 'Actor', 'actor')
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
        this.clearLabels();
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
    return text;
  }
  addColorToStyle(color1, color2, color3, color4, color5, color6, color7, color8, color9) {
    document.getElementById('svgTag').style.setProperty(`--primary-color`, color1)
    document.getElementById('svgTag').style.setProperty(`--secondary-color`, color2)
    document.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3)
    document.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4)
    document.getElementById('svgTag').style.setProperty(`--text-color`, color5);
    document.getElementById('svgTag').style.setProperty(`--line-color`, color6);
    document.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
    document.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
    document.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);
  }
  saveConfig() {
    var json = JSON.stringify({
      color1: this.color1,
      color2: this.color2,
      color3: this.color3,
      color4: this.color4,
      color5: this.color5,
      color6: this.color6,
      color7: this.color7,
      color8: this.color8,
      color9: this.color9,
      selectedSize: this.selectedSize,
      selectedTheme: this.selectedTheme,
      selectedFont: this.selectedFont,
      selectedBreak: this.selectedBreak,
      selectedActor: this.selectedActor,
      selectedShape: this.selectedShape,
      selectedNumber: this.selectedNumber,
      hiddenNotes: this.hiddenNotes,
      hiddenFootnotes: this.hiddenFootnotes,
      hiddenShadows: this.hiddenShadows,
      isThemed: this.isThemed,
      textImages: this.textImages,
      participantpadding: this.participantpadding,
      participantfontsize: this.participantfontsize,
      participantstroke: this.participantstroke,
      sequencetextsize: this.sequencetextsize,
    });
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var a = document.createElement('a');
    a.download = "style.json";
    a.href = dataStr;
    document.body.appendChild(a);
    a.click();
  }
  loadConfig(json) {
    var reader = new FileReader();
    reader.onload = (event)=>{
      this.onConfigReaderLoad(event);
    } 
    reader.readAsText(json.files[0]);
  }
  onConfigReaderLoad(event) {
    var json = JSON.parse(event.target.result);
    this.color1 = json.color1;
    this.color2 = json.color2;
    this.color3 = json.color3;
    this.color4 = json.color4;
    this.color5 = json.color5;
    this.color6 = json.color6;
    this.color7 = json.color7;
    this.color8 = json.color8;
    this.color9 = json.color9;
    this.selectedSize = json.selectedSize;
    this.selectedTheme = json.selectedTheme;
    this.selectedFont = json.selectedFont;
    this.selectedBreak = json.selectedBreak;
    this.selectedActor = json.selectedActor;
    this.selectedShape = json.selectedShape;
    this.selectedNumber = json.selectedNumber;
    this.hiddenNotes = json.hiddenNotes;
    this.hiddenFootnotes = json.hiddenFootnotes;
    this.hiddenShadows = json.hiddenShadows;
    this.isThemed = json.isThemed;
    this.textImages = json.textImages;
    this.participantpadding = json.participantpadding;
    this.participantfontsize = json.participantfontsize;
    this.participantstroke = json.participantstroke;
    this.sequencetextsize = json.sequencetextsize;
  }

}