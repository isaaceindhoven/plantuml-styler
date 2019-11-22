import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StylingService } from './styling.service';
import { AutoNumberService } from './autonumber.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateService {

  constructor(private utility: UtilityService, private styling: StylingService, private http: HttpClient, private autonumbering: AutoNumberService) { }
  /* #region variables   */
  timeoutId;
  isDoneProcessing: boolean = false;
  halfwayDoneProcessing: boolean = false;
  refresh: boolean = false;
  canRefresh: boolean = true;
  isLarge = false;
  isSmall = false;
  svg: any
  rectangled: any;
  png: any
  text: any = "Bob->Alice : hello"
  hiddenNotes: boolean = true;
  footnotes: boolean = true;
  hiddenShadows: boolean = true;
  themedHiddenNotes: boolean = true;
  themedFootnotes: boolean = true;
  themedHiddenShadows: boolean = true;
  isThemed: boolean = false;
  textImages: boolean = false;
  participantpadding = 0;
  participantfontsize = 13;
  participantstroke = 1.5;
  lineThickness = 1;
  themedLineThickness = 1;
  sequencetextsize = 13;
  themedParticipantpadding = 0;
  themedParticipantfontsize = 13;
  themedParticipantstroke = 1.5;
  themedSequencetextsize = 13;
  types = ['Sequence', 'Usecase', 'Class'];
  shapes = ['Rectangle', 'Rounded', 'Ellipse', 'Circle'];
  autonumber = ['None', 'Default', 'Circular', 'Rectangular', 'Rounded', 'Rectangular-Framed', 'Circular-Framed', 'Rounded-Framed'];
  actors = ['Default', 'Modern', 'Male', 'Female'];
  breaks = ['Default', 'Squiggly'];
  fonts = ['Tahoma'];
  themes = ['PlantUML', 'ISAAC', 'Johan', 'Graytone', 'Blackwhite'];
  color1 = '';
  color2 = '';
  color3 = '';
  color4 = '';
  color5 = '';
  color6 = '';
  color7 = '';
  color8 = '';
  color9 = '';
  colorParticipantBorder1 = '';
  colorParticipantBorder2 = '';
  colorParticipantBorder3 = '';
  colorParticipantBorder4 = '';
  colorParticipantBorder5 = '';
  colorParticipantBorder6 = '';
  colorParticipantBorder7 = '';
  colorParticipantBorder8 = '';
  colorParticipantBorder9 = '';
  colorParticipantBackground1 = '';
  colorParticipantBackground2 = '';
  colorParticipantBackground3 = '';
  colorParticipantBackground4 = '';
  colorParticipantBackground5 = '';
  colorParticipantBackground6 = '';
  colorParticipantBackground7 = '';
  colorParticipantBackground8 = '';
  colorParticipantBackground9 = '';
  colorBoxBack = '';
  colorBoxStroke = '';
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
  multi = false;
  multicount = 1;
  /* #endregion */

  async generateSVG(text: string) {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(async () => {
      console.log("generating...");
      //setting the variables to the ones needed for themes
      this.setTheme();
      //make the text ready for generation
      text = this.changeText(document, text);
      //generate the svg and set it to the svg variable while checking if its rounded 
      let oDOM;
      this.isThemed ? oDOM = await this.getData(text, this.themedShape == 'Rounded' ? 20 : 1, this) : oDOM = await this.getData(text, this.selectedShape == 'Rounded' ? 20 : 1, this)
      this.styleSVG(oDOM);
    }, 300);
  }
  resetRectangle(text) {
    text = "skinparam roundcorner 1  \n " + text;
    text = "skinparam notefontsize 12 \n " + text;
    let t = unescape(encodeURIComponent(text))
    this.http.get(environment.api.base + this.utility.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
      data => {
        this.svg = data;
      });
  }
  styleSVG(oDOM) {
    //removing all the styling PlantUML puts on it
    this.styling.removeStyling(oDOM);
    this.isThemed ? this.styling.setNode(oDOM, this.themedShape, this.textImages) : this.styling.setNode(oDOM, this.selectedShape, this.textImages);
    this.isThemed ?
      (this.themedHiddenNotes ? this.ShowNotes() : this.HideNotes(oDOM)) :
      (this.hiddenNotes ? this.ShowNotes() : this.HideNotes(oDOM));
    this.setColors(oDOM);
    this.addListeners(oDOM);
    this.setAutoNumberLabel(oDOM);
    this.isThemed ? this.styling.setActor(oDOM, this.themedActor) : this.styling.setActor(oDOM, this.selectedActor);
    this.isThemed ?
      (this.themedBreak == 'Squiggly' ? this.styling.setSquiggly(oDOM) : null) :
      (this.selectedBreak == 'Squiggly' ? this.styling.setSquiggly(oDOM) : null);
    this.findNamesInText(oDOM);
    this.findBoxes(oDOM);
    this.findDividers(oDOM);
    this.findAlts(oDOM);
    this.setFont(oDOM);
    this.setStroke(oDOM);
    this.setLineBorders(oDOM);
    this.triggerResize(oDOM);
    if (this.multi) {
      this.multicount = this.setMultiParticipants(oDOM);
    }
    let s = new XMLSerializer();
    let str = s.serializeToString((oDOM as XMLDocument).firstChild);
    this.svg = str;
    setTimeout(() => {
      if (this.isLarge)
        this.styling.setDiagramCardsize();
    });
  }
  changeText(oDOM, text: string) {
    this.styling.getActors(text);
    if (this.isThemed) {
      text = this.utility.replaceAll(text, 'Actor', 'actor');
      if (!this.themedFootnotes)
        text = 'hide footbox \n' + text
      if (!this.themedHiddenShadows)
        text = 'skinparam Shadowing false \n' + text
      text = `skinparam notefontsize 12 \n ` + text;
      text = `skinparam   ParticipantPadding  ${this.themedParticipantpadding} \n` + text
      text = `skinparam   ParticipantFontSize ${this.themedParticipantfontsize} \n` + text
      text = `skinparam   ActorFontSize ${this.themedParticipantfontsize} \n` + text
      text = `skinparam   ArrowFontSize  ${this.themedSequencetextsize} \n` + text
      text = 'skinparam SequenceDividerFontSize 14 \n' + text
      switch (this.themedNumber) {
        case 'None':
          break;
        case 'Default':
          text = 'autonumber 1\n' + text;
          this.styling.clearLabels(oDOM);
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
      text = this.utility.replaceAll(text, 'Actor', 'actor')
      if (!this.footnotes)
        text = 'hide footbox \n' + text
      if (!this.hiddenShadows)
        text = 'skinparam Shadowing false \n' + text
      text = `skinparam notefontsize 12 \n ` + text;

      if (this.participantfontsize < 1) {
        this.participantfontsize = 1;
      }
      if (this.participantfontsize > 40) {
        this.participantfontsize = 40;
      }
      if (this.sequencetextsize < 1) {
        this.sequencetextsize = 1;
      }
      if (this.sequencetextsize > 40) {
        this.sequencetextsize = 40;
      }
      if (this.participantpadding < 0) {
        this.participantpadding = 0;
      }
      if (this.participantpadding > 500) {
        this.participantpadding = 500;
      }

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
          this.styling.clearLabels(oDOM);
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
  async getData(text, roundcorner, generate) {
    return new Promise(function (resolve, reject) {
      text = `skinparam roundcorner ${roundcorner}  \n ${text}`;
      generate.styling.getActors(text);
      let t = unescape(encodeURIComponent(text))
      generate.http.get(environment.api.base + generate.utility.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
        data => {
          data = (data as string).replace("<svg", `<svg id="svgTag"`);
          let oParser = new DOMParser();
          let oDOM = oParser.parseFromString(data, "image/svg+xml");
          // generate.svg = data;
          resolve(oDOM);
        });
    });
  }
  hideNotes(oDOM) {
    this.styling.getTagList(oDOM, 'path').forEach((element: SVGRectElement) => {
      if (element.getAttribute('class') == null) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    this.styling.getTagList(oDOM, 'polygon').forEach((element: SVGRectElement) => {
      if (element.getAttribute('points').split(',').length >= 9) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-size') == '12') {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
  }
  showNotes() {
    let notes: any = document.getElementsByName('note')
    let list = Array.from(notes);
    list.forEach((element: SVGRectElement) => {
      element.setAttribute('display', '');
    });
  }
  ShowNotes() {
    this.showNotes();
  }
  HideNotes(oDOM) {
    if (this.isThemed) {
      if (!this.themedHiddenNotes) {
        this.hideNotes(oDOM);
      } else {
        this.showNotes();
      }
    }
    else {
      if (!this.hiddenNotes) {
        this.hideNotes(oDOM);
      } else {
        this.showNotes();
      }
    }
  }
  setColors(oDOM) {
    if (this.isThemed) {
      if (this.selectedTheme == 'PlantUML') {
        this.styling.addColorToStyle(
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[2],
          this.styling.PlantUMLStyle[3],
          this.styling.PlantUMLStyle[4],
          this.styling.PlantUMLStyle[5],
          this.styling.PlantUMLStyle[6],
          this.styling.PlantUMLStyle[7],
          this.styling.PlantUMLStyle[8],
          oDOM,
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[0],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1],
          this.styling.PlantUMLStyle[1])
      }
      else if (this.selectedTheme == 'ISAAC') {
        this.styling.addColorToStyle(
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[2],
          this.styling.IsaacStyle[3],
          this.styling.IsaacStyle[4],
          this.styling.IsaacStyle[5],
          this.styling.IsaacStyle[6],
          this.styling.IsaacStyle[7],
          this.styling.IsaacStyle[8],
          oDOM,
          this.styling.IsaacStyle[9],
          this.styling.IsaacStyle[10],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[0],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1],
          this.styling.IsaacStyle[1])
      }
      else if (this.selectedTheme == 'Johan') {
        this.styling.addColorToStyle(
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[2],
          this.styling.JohanStyle[3],
          this.styling.JohanStyle[4],
          this.styling.JohanStyle[5],
          this.styling.JohanStyle[6],
          this.styling.JohanStyle[7],
          this.styling.JohanStyle[8],
          oDOM,
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[0],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1],
          this.styling.JohanStyle[1])
      }
      else if (this.selectedTheme == 'Graytone') {
        this.styling.addColorToStyle(
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[2],
          this.styling.GraytoneStyle[3],
          this.styling.GraytoneStyle[4],
          this.styling.GraytoneStyle[5],
          this.styling.GraytoneStyle[6],
          this.styling.GraytoneStyle[7],
          this.styling.GraytoneStyle[8],
          oDOM,
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[0],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1],
          this.styling.GraytoneStyle[1])
      }
      else if (this.selectedTheme == 'Blackwhite') {
        this.styling.addColorToStyle(
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[2],
          this.styling.BlackWhiteStyle[3],
          this.styling.BlackWhiteStyle[4],
          this.styling.BlackWhiteStyle[5],
          this.styling.BlackWhiteStyle[6],
          this.styling.BlackWhiteStyle[7],
          this.styling.BlackWhiteStyle[8],
          oDOM,
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[0],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1],
          this.styling.BlackWhiteStyle[1])
      }
    } else {
      this.styling.addColorToStyle(
        this.color1,
        this.color2,
        this.color3,
        this.color4,
        this.color5,
        this.color6,
        this.color7,
        this.color8,
        this.color9,
        oDOM,
        this.colorBoxBack,
        this.colorBoxStroke,
        this.colorParticipantBorder1,
        this.colorParticipantBorder2,
        this.colorParticipantBorder3,
        this.colorParticipantBorder4,
        this.colorParticipantBorder5,
        this.colorParticipantBorder6,
        this.colorParticipantBorder7,
        this.colorParticipantBorder8,
        this.colorParticipantBorder9,
        this.colorParticipantBackground1,
        this.colorParticipantBackground2,
        this.colorParticipantBackground3,
        this.colorParticipantBackground4,
        this.colorParticipantBackground5,
        this.colorParticipantBackground6,
        this.colorParticipantBackground7,
        this.colorParticipantBackground8,
        this.colorParticipantBackground9)

    }
  }
  addListeners(oDOM) {
    this.styling.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.addListenersTo(element)
        this.addListenersTo(element.nextElementSibling)
      }
    })
    this.styling.getTagList(oDOM, 'image').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.styling.getTagList(oDOM, 'ellipse').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
    this.styling.getTagList(oDOM, 'circle').forEach((element: SVGRectElement) => {
      this.addListenersTo(element)
      this.addListenersTo(element.nextElementSibling)
    })
  }
  addListenersTo(element) {
    element.addEventListener('mouseover', () => {
      this.showNotes();
    });
    element.addEventListener('mouseenter', () => {
      this.showNotes();
    });
    element.addEventListener('mouseleave', () => {
      this.hideNotes(document);
    })
  }
  setAutoNumberLabel(oDOM) {
    if (this.isThemed) {
      if (this.themedNumber == 'Circular') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircular(oDOM);
      } else if (this.themedNumber == 'Rectangular') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangular(oDOM);
      } else if (this.themedNumber == 'Rectangular-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangularFramed(oDOM);
      } else if (this.themedNumber == 'Rounded-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRoundedFramed(oDOM);
      } else if (this.themedNumber == 'Circular-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircularFramed(oDOM);
      } else if (this.themedNumber == 'Rounded') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRounded(oDOM);
      } else if (this.themedNumber == 'Default') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberDefault(oDOM);
      }
    }
    else {
      if (this.selectedNumber == 'Circular') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircular(oDOM);
      } else if (this.selectedNumber == 'Rectangular') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangular(oDOM);
      } else if (this.selectedNumber == 'Rectangular-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangularFramed(oDOM);
      } else if (this.selectedNumber == 'Rounded-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRoundedFramed(oDOM);
      } else if (this.selectedNumber == 'Circular-Framed') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircularFramed(oDOM);
      } else if (this.selectedNumber == 'Rounded') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRounded(oDOM);
      } else if (this.selectedNumber == 'Default') {
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberDefault(oDOM);
      }
    }
  }
  setFont(oDOM) {
    if (this.isThemed) {
      if (document.getElementById('googlelink')) {
        document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.themedFont);
      } else {
        let headID = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.id = 'googlelink'
        headID.appendChild(link);
        link.href = 'https://fonts.googleapis.com/css?family=' + this.themedFont;
      }
      oDOM.getElementById('svgTag').style.setProperty(`--font-stack`, this.themedFont)
    } else {
      if (document.getElementById('googlelink')) {
        document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.selectedFont);
      } else {
        let headID = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.id = 'googlelink'
        headID.appendChild(link);
        link.href = 'https://fonts.googleapis.com/css?family=' + this.selectedFont;
      }
      oDOM.getElementById('svgTag').style.setProperty(`--font-stack`, this.selectedFont)
    }
  }
  setStroke(oDOM) {
    if (this.participantstroke < 0) {
      this.participantstroke = 0;
    }
    if (this.participantstroke > 15) {
      this.participantstroke = 15;
    }
    if (this.isThemed) {
      oDOM.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.themedParticipantstroke.toString())
    }
    else {
      oDOM.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, this.participantstroke.toString())
    }
  }
  setLineBorders(oDOM) {
    if (this.isThemed) {
      oDOM.getElementById('svgTag').style.setProperty(`--border-thickness`, this.themedLineThickness.toString())
    }
    else {
      if (this.lineThickness > 4) {
        this.lineThickness = 4;
      }
      if (this.lineThickness < 0) {
        this.lineThickness = 0;
      }
      oDOM.getElementById('svgTag').style.setProperty(`--border-thickness`, this.lineThickness.toString())
    }
  }
  triggerResize(oDOM) {
    oDOM.getElementById('svgTag').style.setProperty(`--font-size`, this.selectedSize)
  }
  isaacStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans'
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 16;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 2;
  }
  JohanStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Muli'
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
  }
  GrayToneStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans'
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 2;

  }
  BlackWhiteStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Default';
    this.themedShape = 'Rounded';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans'
    this.themedFootnotes = true;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
  }
  plantumlStyle() {
    this.themedBreak = 'Default';
    this.themedNumber = 'None';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Default';
    this.themedFont = 'Roboto'
    this.themedFootnotes = true;
    this.themedHiddenShadows = true;
    this.themedParticipantfontsize = 13;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
  }
  setTheme() {
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
      else if (this.selectedTheme == 'Blackwhite') {
        this.BlackWhiteStyle();
      }
    }
  }
  findNamesInText(oDOM) {
    let last;
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousSibling && element.nextSibling) {
        if (element.previousSibling.nodeName == 'rect') {
          if ((element.previousSibling as SVGRectElement).getAttribute('rx')) {
            if (!(element.previousSibling as SVGRectElement).getAttribute('class')) {
              if (this.isThemed) {
                if (element.getAttribute('font-size') == this.themedParticipantfontsize.toString()) {
                  (element.previousSibling as SVGRectElement).setAttribute('name', 'participantshape');
                }
              } else {
                if (element.getAttribute('font-size') == this.participantfontsize.toString()) {
                  (element.previousSibling as SVGRectElement).setAttribute('name', 'participantshape');
                }
              }
            }
          }
        } else if (element.previousSibling.nodeName == 'image') {
          if (this.isThemed) {
            if (element.getAttribute('font-size') == this.themedParticipantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          } else {
            if (element.getAttribute('font-size') == this.participantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          }
        } else if (element.previousSibling.nodeName == 'ellipse') {
          if (this.isThemed) {
            if (element.getAttribute('font-size') == this.themedParticipantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          } else {
            if (element.getAttribute('font-size') == this.participantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          }
        } else if (element.previousSibling.nodeName == 'circle') {
          if (this.isThemed) {
            if (element.getAttribute('font-size') == this.themedParticipantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          } else {
            if (element.getAttribute('font-size') == this.participantfontsize.toString()) {
              (element.previousSibling as SVGImageElement).setAttribute('name', 'participantshape');
            }
          }
        } else if (element.nextSibling.nodeName == 'ellipse') {
          if ((element.nextSibling.nextSibling as SVGRectElement).getAttribute('class')) {
            if ((element.nextSibling.nextSibling as SVGRectElement).getAttribute('class').includes('actor')) {
              if (this.isThemed) {
                if (element.getAttribute('font-size') == this.themedParticipantfontsize.toString()) {
                  (element.nextSibling as SVGImageElement).setAttribute('name', 'participantshape');
                  (element.nextSibling as SVGImageElement).setAttribute('class', (element.nextSibling as SVGImageElement).getAttribute('class') + ' actorshape');
                }
              } else {
                if (element.getAttribute('font-size') == this.participantfontsize.toString()) {
                  (element.nextSibling as SVGImageElement).setAttribute('name', 'participantshape');
                  (element.nextSibling as SVGImageElement).setAttribute('class', (element.nextSibling as SVGImageElement).getAttribute('class') + ' actorshape');
                }
              }
            }
          }
        }
      }
      if (last) {
        if (element.textContent == last.textContent) {
          element.setAttribute('name', 'participant');
          last.setAttribute('name', 'participant');
        }
        else {
          last = element;
        }
      } else {
        last = element;
      }
    });
  }
  findBoxes(oDOM) {
    let height = parseFloat(oDOM.getElementById('svgTag').style.height);
    let minus = height * 0.05;
    height = height - minus;
    this.styling.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (parseFloat(element.getAttribute('height')) >= height) {
        if (element.getAttribute('class')) {
          element.setAttribute('class', element.getAttribute('class') + ' box');
        } else {
          element.setAttribute('class', 'box');
        }
      }
    });
  }
  findDividers(oDOM) {
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousSibling) {
        if (element.previousSibling.nodeName == 'rect') {
          if (element.previousSibling.previousSibling) {
            if (element.previousSibling.previousSibling.nodeName == 'line') {
              if (element.previousSibling.previousSibling.previousSibling) {
                if (element.previousSibling.previousSibling.previousSibling.nodeName == 'line') {
                  if (element.previousSibling.previousSibling.previousSibling.previousSibling) {
                    if (element.previousSibling.previousSibling.previousSibling.previousSibling.nodeName == 'rect') {
                      element.setAttribute('class', 'divider');
                      element.previousElementSibling.setAttribute('class', 'divider');
                      element.previousElementSibling.previousElementSibling.setAttribute('class', 'divider');
                      element.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('class', 'divider');
                      element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('class', 'divider');
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }
  findAlts(oDOM) {
    this.styling.getTagList(oDOM, 'path').forEach((element: SVGRectElement) => {
      console.log(element, element.getTotalLength());
      if (element.getTotalLength() == 168.1421356201172 || element.getTotalLength() == 187.1421356201172) {
        element.setAttribute('class', 'alt');
      }
    });
  }
  setMultiParticipants(oDOM: Document) {
    let count = 1;
    let half = false;
    Array.from(oDOM.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
      console.log(this.footnotes);
      if (this.footnotes) {
        if (element.getAttribute('class')) {
          if (element.getAttribute('class').includes('actorshape')) {
            if (half) {
              (element as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
              (element.nextSibling as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
              half = false;
              count++;
            } else {
              half = true;
              (element as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
              (element.nextSibling as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
            }
          }
        } else {
          if (half) {
            (element as SVGRectElement).setAttribute('class', `participant${count}`)
            half = false;
            count++;
          } else {
            half = true;
            (element as SVGRectElement).setAttribute('class', `participant${count}`)
          }
        }
      } else {
        if (element.getAttribute('class')) {
          if (element.getAttribute('class').includes('actorshape')) {
            (element as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
            (element.nextSibling as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
            count++;
          }
        }
        else {
          (element as SVGRectElement).setAttribute('class', `participant${count}`);
          count++;
        }
      }
    }
    );
    return count - 1;
  }
}
