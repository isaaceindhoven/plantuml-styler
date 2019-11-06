import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip'
import { environment } from 'src/environments/environment';
import { StylingService } from './styling.service';
import { AutoNumberService } from './autonumber.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private http: HttpClient, private stylingservice: StylingService, private autonumberservice: AutoNumberService) { }
  timeoutId;
  isDoneProcessing: boolean = false;
  halfwayDoneProcessing: boolean = false;
  refresh: boolean = false;

  svg: any
  rectangled: any;
  png: any
  text: any = "Bob->Alice : hello"
  hiddenNotes: boolean = true;
  hiddenFootnotes: boolean = true;
  hiddenShadows: boolean = true;
  themedHiddenNotes: boolean = true;
  themedHiddenFootnotes: boolean = true;
  themedHiddenShadows: boolean = true;
  isThemed: boolean = false;
  textImages: boolean = false;
  participantpadding = 0;
  participantfontsize = 13;
  participantstroke = 1.5;
  sequencetextsize = 13;
  themedParticipantpadding = 0;
  themedParticipantfontsize = 13;
  themedParticipantstroke = 1.5;
  themedSequencetextsize = 13;
  types = ['Sequence', 'Usecase', 'Class'];
  shapes = ['Rectangle', 'Rounded', 'Ellipse', 'Circle'];
  autonumber = ['None', 'Default', 'Circular', 'Rectangular', 'Rounded', 'Rectangular-Framed', 'Circular-Framed', 'Rounded-Framed'];
  actors = ['Default', 'Modern'];
  breaks = ['Default', 'Squiggly'];
  fonts = ['Tahoma'];
  themes = ['PlantUML', 'ISAAC', 'Johan', 'Graytone'];
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
  selectedType = 'Sequence';
  selectedFont = 'Tahoma';
  selectedBreak = 'Default';
  selectedActor = 'Default';
  selectedShape = 'Rectangle';
  selectedNumber = 'None';
  themedType = 'Sequence';
  themedFont = 'Tahoma';
  themedBreak = 'Default';
  themedActor = 'Default';
  themedShape = 'Rectangle';
  themedNumber = 'None';
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
    this.stylingservice.actorlist.push(actor);
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
    if (this.isThemed) {
      text = this.replaceAll(text, 'Actor', 'actor')
      if (!this.themedHiddenFootnotes)
        text = 'hide footbox \n' + text
      if (!this.themedHiddenShadows)
        text = 'skinparam Shadowing false \n' + text

      text = `skinparam   ParticipantPadding  ${this.themedParticipantpadding} \n` + text
      text = `skinparam   ParticipantFontSize ${this.themedParticipantfontsize} \n` + text
      text = `skinparam   ActorFontSize ${this.themedParticipantfontsize} \n` + text
      text = `skinparam   ArrowFontSize  ${this.themedSequencetextsize} \n` + text

      text = 'skinparam SequenceDividerFontSize 14 \n' + text
      text = 'skinparam SequenceDividerFontSize 14 \n' + text
      switch (this.themedNumber) {
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
    }
    else {
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
    }
    return text;
  }
  addColorToStyle(color1, color2, color3, color4, color5, color6, color7, color8, color9) {

    this.setSvgTag();
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
  saveConfig(returning) {
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
      themedBreak: this.themedBreak,
      themedNumber: this.themedNumber,
      themedShape: this.themedShape,
      themedActor: this.themedActor,
      themedFont: this.themedFont,
      themedHiddenFootnotes: this.themedHiddenFootnotes,
      themedHiddenShadows: this.themedHiddenShadows,
      themedParticipantfontsize: this.themedParticipantfontsize,
      themedSequencetextsize: this.themedSequencetextsize,
      themedParticipantstroke: this.themedParticipantstroke,
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
    if (returning) {
      return json;
    }
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var a = document.createElement('a');
    a.download = "style.json";
    a.href = dataStr;
    document.body.appendChild(a);
    a.click();
  }
  loadConfig(json) {
    var reader = new FileReader();
    reader.onload = (event) => {
      this.onConfigReaderLoad(event);
    }
    reader.readAsText(json);
  }
  loadCode(puml) {
    this.isDoneProcessing = false;
    var reader = new FileReader();
    reader.onload = (event) => {
      this.onCodeReaderLoad(event);
    }
    reader.readAsText(puml);
  }
  onCodeReaderLoad(event) {
    this.isDoneProcessing = false;
    var puml = event.target.result;
    this.text = puml;
    document.getElementById('tA').textContent = puml;
    if (this.halfwayDoneProcessing) {
      this.isDoneProcessing = true;
      this.startGeneration()
    } else {
      this.halfwayDoneProcessing = true;
    }
  }
  onConfigReaderLoad(event) {
    console.log("event", event);
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
    this.themedBreak = json.themedBreak
    this.themedNumber = json.themedNumber
    this.themedShape = json.themedShape
    this.themedActor = json.themedActor
    this.themedFont = json.themedFont
    this.themedHiddenFootnotes = json.themedHiddenFootnotes
    this.themedHiddenShadows = json.themedHiddenShadows
    this.themedParticipantfontsize = json.themedParticipantfontsize
    this.themedSequencetextsize = json.themedSequencetextsize
    this.themedParticipantstroke = json.themedParticipantstroke
    if (this.halfwayDoneProcessing) {
      this.isDoneProcessing = true;
      this.startGeneration()
    } else {
      this.halfwayDoneProcessing = true;
    }
  }
  isaacStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rounded';
    this.themedActor = 'Modern';
    this.themedFont = 'Tahoma'
    this.themedHiddenFootnotes = false;
    this.themedHiddenShadows = true;
    this.themedParticipantfontsize = 13;
    this.themedSequencetextsize = 13;
    this.generateSvg(this.text);
  }
  JohanStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Muli'
    this.themedHiddenFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.generateSvg(this.text);
  }
  GrayToneStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans'
    this.themedHiddenFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 2;
    this.generateSvg(this.text);
  }
  plantumlStyle() {
    this.themedBreak = 'Default';
    this.themedNumber = 'None';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Default';
    this.themedFont = 'Roboto'
    this.themedHiddenFootnotes = true;
    this.themedHiddenShadows = true;
    this.themedParticipantfontsize = 13;
    this.themedSequencetextsize = 13;
    this.generateSvg(this.text);
  }
  async setStyle() {
    setTimeout(() => {
      if (this.isThemed) {
        if (this.selectedTheme == 'PlantUML') {
          this.plantumlStyle()
        }
        else if (this.selectedTheme == 'ISAAC') {
          this.isaacStyle();
        }
        else if (this.selectedTheme == 'Johan') {
          this.JohanStyle();
        }
        else if (this.selectedTheme == 'Graytone') {
          this.GrayToneStyle();
        }
      } else {
        this.addColorToStyle(
          this.color1,
          this.color2,
          this.color3,
          this.color4,
          this.color5,
          this.color6,
          this.color7,
          this.color8,
          this.color9)

      }
    }, 100);
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.stylingservice.actorlist = [];
      var newtext = text.split('actor ')[1];
      if (newtext) {
        var actor = (newtext.split('\n')[0]).trim();
        newtext = text.replace(`actor ${actor}`, '')
        this.addToActors(actor)
      } else {
        newtext = text.split('actor')[1];
      }

      while (newtext.includes('actor')) {
        var newer = newtext;
        var newtext2 = newtext.split('actor ')[1];
        if (newtext2) {
          var actor = (newtext2.split('\n')[0]).trim();
          newtext = newer.replace(`actor ${actor}`, '')
          this.addToActors(actor)
        } else {
          newtext = newtext.split('actor')[1];
        }


      }
    }
  }
  updateSVG(data) {
    if (document.getElementsByTagName('svg')[0]) {
      setTimeout(() => {
        this.svg = data;
      }, 50);
    }
    else {
      this.svg = `<svg height="1" width="1"></svg>`
    }

  }
  setSvgTag() {
    document.getElementsByTagName('svg')[0].setAttribute('id', 'svgTag');
  }
  ShowNotes() {
    this.showNotes();
  }
  HideNotes() {
    if (this.isThemed) {
      if (!this.themedHiddenNotes) {
        this.hideNotes();
      } else {
        this.showNotes();
      }
    }
    else {
      if (!this.hiddenNotes) {
        this.hideNotes();
      } else {
        this.showNotes();
      }
    }
  }
  setActors() {
    if (this.isThemed) {
      switch (this.themedActor) {
        case 'Default':
          if (this.refresh) {
            this.generateSvg(this.text);
            this.refresh = false;
          }
          break;
        case 'Modern':
          this.stylingservice.setNewActor();
          this.refresh = true;
          break;
        default:
          break;
      }
    }
    else {
      switch (this.selectedActor) {
        case 'Default':
          if (this.refresh) {
            this.generateSvg(this.text);
            this.refresh = false;
          }
          break;
        case 'Modern':
          this.stylingservice.setNewActor();
          this.refresh = true;
          break;
        default:
          break;
      }
    }

  }
  setColors() {
    if (this.isThemed) {
      if (this.selectedTheme == 'PlantUML') {
        this.addColorToStyle(
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
      else if (this.selectedTheme == 'ISAAC') {
        this.addColorToStyle(
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
      else if (this.selectedTheme == 'Johan') {
        this.addColorToStyle(
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
      else if (this.selectedTheme == 'Graytone') {
        this.addColorToStyle(
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
      this.addColorToStyle(
        this.color1,
        this.color2,
        this.color3,
        this.color4,
        this.color5,
        this.color6,
        this.color7,
        this.color8,
        this.color9)

    }
  }
  setStroke() {
    if (this.isThemed) {
      document.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.themedParticipantstroke.toString())
    }
    else {
      document.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.participantstroke.toString())
    }
  }
  addListners() {
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.addListenersTo(element)
        this.addListenersTo(element.nextElementSibling)
      }
    })
    this.getTagList('image').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.getTagList('ellipse').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.getTagList('circle').forEach((element: SVGRectElement) => {
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
    if (this.isThemed) {
      if (!this.themedHiddenNotes) {
        this.HideNotes()
      }
      else {
        this.ShowNotes()
      }
    } else {
      if (!this.hiddenNotes) {
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
  setBreak() {
    if (this.isThemed) {
      if (this.themedBreak == 'Squiggly') {
        this.stylingservice.setSquiggly();
      }
    } else {
      if (this.selectedBreak == 'Squiggly') {
        this.stylingservice.setSquiggly();
      }
    }
  }
  setFont() {
    if (document.getElementById('googlelink')) {
      document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.selectedFont);
    } else {
      var headID = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.id = 'googlelink'
      headID.appendChild(link);
      link.href = 'https://fonts.googleapis.com/css?family=' + this.selectedFont;
    }

    document.getElementById('svgTag').style.setProperty(`--font-stack`, this.selectedFont)
  }
  triggerResize() {
    document.getElementById('svgTag').style.setProperty(`--font-size`, this.selectedSize)
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
  toImage(image, text) {
    this.stylingservice.image = window.URL.createObjectURL(image.files[0])
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 1 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
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
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
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
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
      });
  }
  toRounded(text) {
    text = "skinparam notefontsize 12 \n " + text
    text = "skinparam roundcorner 20 \n " + text
    this.getActors(text);
    var t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.updateSVG(data);
        setTimeout(() => {
          this.setSvgTag();
          this.readySVG();
        }, 50);
      }
    )
  }
  setAutoNumberLabel() {
    if (this.isThemed) {
      if (this.themedNumber == 'Circular') {
        this.clearLabels();
        this.autonumberservice.setAutonumberCircular();
      } else if (this.themedNumber == 'Rectangular') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRectangular();
      } else if (this.themedNumber == 'Rectangular-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRectangularFramed();
      } else if (this.themedNumber == 'Rounded-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRoundedFramed();
      } else if (this.themedNumber == 'Circular-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberCircularFramed();
      } else if (this.themedNumber == 'Rounded') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRounded();
      }
    }
    else {
      if (this.selectedNumber == 'Circular') {
        this.clearLabels();
        this.autonumberservice.setAutonumberCircular();
      } else if (this.selectedNumber == 'Rectangular') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRectangular();
      } else if (this.selectedNumber == 'Rectangular-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRectangularFramed();
      } else if (this.selectedNumber == 'Rounded-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRoundedFramed();
      } else if (this.selectedNumber == 'Circular-Framed') {
        this.clearLabels();
        this.autonumberservice.setAutonumberCircularFramed();
      } else if (this.selectedNumber == 'Rounded') {
        this.clearLabels();
        this.autonumberservice.setAutonumberRounded();
      }
    }
  }
  generateSvg(text: string) {
    text = this.changeText(text)
    if (this.isThemed) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        switch (this.themedShape) {
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
            this.toImage(this.img, text);
            break;
          default:
            this.toRectangle(text);
            break;
        }
      }, 300);
    } else {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        switch (this.selectedShape) {
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
            this.toImage(this.img, text);
            break;
          default:
            this.toRectangle(text);
            break;
        }
      }, 300);
    }
  }
  startGeneration() {
    this.setStyle().then(() => {
      this.generateSvg(this.text);
    })
  }
}