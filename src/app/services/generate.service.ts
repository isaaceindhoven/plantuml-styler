import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { StylingService } from './styling.service';
import { AutoNumberService } from './autonumber.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class GenerateService {
  constructor(private utility: UtilityService, private styling: StylingService, private http: HttpClient, private autonumbering: AutoNumberService) { }
  /* #region variables   */
  timeoutId;
  isDoneProcessing = false;
  halfwayDoneProcessing = false;
  refresh = false;
  canRefresh = true;
  isError = false;
  isSmall = false;
  svg: any;
  rectangled: any;
  png: any;
  text: any = 'Bob->Alice : hello';
  hiddenNotes = true;
  footnotes = true;
  hiddenShadows = true;
  themedHiddenNotes = true;
  themedFootnotes = true;
  themedHiddenShadows = true;
  isThemed = true;
  textImages = false;
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
  themes = ['No theme', 'Default plantUML', 'ISAAC', 'Deep sea', 'Graytone', 'Black and white'];
  color1 = '';
  color2 = '';
  color3 = '';
  color4 = '';
  color5 = '';
  color6 = '';
  color7 = '';
  color8 = '';
  color9 = '';
  colorBoxBack = '';
  colorBoxStroke = '';
  selectedSize = '14';
  selectedTheme = 'Default plantUML';
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
  selectedParticipant;
  selectedPart;
  participants = {};
  participantShapes = [
    {
      name: null,
      shape: null,
    },
  ];
  participantImages = {};
  participantColors = [
    {
      name: null,
      border: null,
      background: null,
      text: null,
    },
  ];
  parshape = 'Rectangle';

  /* #endregion */


  async generateSVG(text: string) {
    // using a timeout to check if the diagram hasn't been requested to change within the last 300 ms. to prevent overloading the server with requests.
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(async () => {
      console.log('generating...');
      this.isError = false;
      // setting the variables to the ones needed for themes
      this.setTheme();
      // make the text ready for generation
      text = this.changeText(document, text);
      // resize the text area
      this.utility.resizeAce();
      // generate the svg and turning it into a DomParser
      let oDOM;
      this.isThemed ? oDOM = await this.getData(text, this.themedShape == 'Rounded' ? 20 : 1, this) : oDOM = await this.getData(text, this.selectedShape == 'Rounded' ? 20 : 1, this);
      if (this.isError) {
        this.styling.prepareError(oDOM);
        const s = new XMLSerializer();
        const str = s.serializeToString((oDOM as XMLDocument).firstChild);
        this.svg = str;
        return null;
      }
      // start styling the SVG
      this.styleSVG(oDOM);
    }, 300);
  }
  styleSVG(oDOM) {
    // removing all the styling PlantUML puts on it
    this.styling.removeStyling(oDOM);
    // checking if the multi participant toggle has been set because this will mean the shapes of participants shouldn't be set
    if (!this.multi) {
      // making the diagram participants take the wished shape. based on whether or not a theme has been set the right shape should be used
      this.isThemed ? this.styling.setNode(oDOM, this.themedShape, this.textImages) : this.styling.setNode(oDOM, this.selectedShape, this.textImages);
    }
    // hiding the notes based on the hideNotes variables which are based on if the diagram is using a theme or not
    this.isThemed ?
      (this.themedHiddenNotes ? this.ShowNotes() : this.HideNotes(oDOM)) :
      (this.hiddenNotes ? this.ShowNotes() : this.HideNotes(oDOM));
    // setting the variable colors to the SVG based on theme or selected colors
    this.setColors(oDOM);
    // adding the onMouseOver listeners on the participants to show hidden notes
    this.addListeners(oDOM);
    // setting the selected auto numbering labels
    this.isThemed ? this.setAutoNumberLabel(oDOM, this.themedNumber) : this.setAutoNumberLabel(oDOM, this.selectedNumber);
    // turning the standard PlantUML actors into nice svg modern actors
    this.isThemed ? this.styling.setActor(oDOM, this.themedActor) : this.styling.setActor(oDOM, this.selectedActor);
    // turning the standard breaks into nice looking breaks
    this.isThemed ? this.setBreak(oDOM, this.themedBreak) : this.setBreak(oDOM, this.selectedBreak);
    // finding the participant names <text> tags and making them ready to be used later
    this.isThemed ? this.findNamesInText(oDOM, this.themedParticipantfontsize) : this.findNamesInText(oDOM, this.participantfontsize);
    // by adding a title in PlantUML that title gets added right above the diagram. but is has very little space which makes it feel very cramped.
    // adding a box with a thick border solves this issue but this box is ugly. here we find this box and add some CSS to make it transparent.
    this.isThemed ? this.findTitle(oDOM, this.themedParticipantfontsize) : this.findTitle(oDOM, this.participantfontsize);
    // here we find the boxes that surround participants and add the styling needed to make them pretty. we make them a bit bigger too.
    this.findBoxes(oDOM);
    // here we find the dividers in the diagram and give them the right styling
    this.findDividers(oDOM);
    // here we find the Alt blocks in the diagram and give them the right styling
    this.findAlts(oDOM);
    // here we find the database participant <path> elements and give them the right styling
    this.findDbs(oDOM);
    // here we find the note elements and give them the right stling
    this.findNotes(oDOM);
    // here we get the chosen google font from google and apply it to the diagram
    this.setFont(oDOM);
    // here we set the alt blocks to fit the diagram when the selected shape is rounded
    this.isThemed ? this.setAlts(oDOM, this.themedShape) : this.setAlts(oDOM, this.selectedShape);
    // for some reason PlantUML adds extra <rect> elements around alt boxes that do nothing.
    // they do however make the diagram ugly when rounded so we get rid of them
    this.setAltBoxes(oDOM);
    // here we set the border size A.K.A. the stroke
    this.isThemed ? this.setStroke(oDOM, this.themedParticipantstroke.toString()) : this.setStroke(oDOM, this.participantstroke.toString());
    // here we set the border size of the lines
    this.isThemed ? this.setLineBorders(oDOM, this.themedLineThickness) : this.setLineBorders(oDOM, this.lineThickness);
    // here we set the font size of the diagram
    this.setFontSize(oDOM);
    // here we check if the multi participant toggle has been toggled on. if so we need te do some extra styling.
    if (this.multi) {
      this.multicount = this.setMultiParticipants(oDOM);
      this.setMultiParticipantShapes(oDOM);
      this.setMultiParticipantColors(oDOM);
      this.setMultiParticipantImages(oDOM);
    }
    // then finally we take the DomParser and get the changed SVG out of it and inject it into the page by setting the svg variable.
    const s = new XMLSerializer();
    const str = s.serializeToString((oDOM as XMLDocument).firstChild);
    this.svg = str;
  }
  changeText(oDOM, text: string) {
    // before we start changing the text we need to know what actors exist within the diagram
    this.styling.getActors(text);
    // then depending on whether the themed toggle has been toggled on. We decide what code to execute
    if (this.isThemed) {
      // checking if the user wants to hide the footnotes and if so add the right skinparam to do so
      this.themedFootnotes ? null : text = text + '\nhide footbox';
      // checking if the user wants to hide the backdrop shadow and if so add the right skinparam to do so
      this.themedHiddenShadows ? null : text = text + ' \nskinparam Shadowing false';
      // setting the fontsize of notes
      text = text + ` \n skinparam notefontsize 12`;
      // setting the padding between participants
      text = text + ` \nskinparam ParticipantPadding  ${this.themedParticipantpadding}`;
      // setting the participant's font size
      text = text + ` \nskinparam ParticipantFontSize ${this.themedParticipantfontsize}`;
      // setting the font size of the actors
      text = text + ` \nskinparam ActorFontSize ${this.themedParticipantfontsize}`;
      // setting the font size of the arrows
      text = text + ` \nskinparam ArrowFontSize ${this.themedSequencetextsize}`;
      // setting the font size of the sequence dividers
      text = text + '\nskinparam SequenceDividerFontSize 14 ';
      // setting the padding between the boxes
      text = text + ' \nskinparam BoxPadding 15';
      // setting the font size of the title
      text = text + ` \nskinparam SequenceTitleFontSize ${this.themedParticipantfontsize + 1}`;
      // setting the border thickness of the title
      text = text + ` \nskinparam titleBorderThickness 2`;
      // setting the skinparams to allow the autonumbers to work
      text = this.changeTextForNumbers(this.themedNumber, text, oDOM);

    } else {
      // checking if the user wants to hide the footnotes and if so add the right skinparam to do so
      this.footnotes ? null : text = text + ' \nhide footbox';
      // checking if the user wants to hide the backdrop shadow and if so add the right skinparam to do so
      this.hiddenShadows ? null : text = text + ' \nskinparam Shadowing false';
      // setting the fontsize of notes
      text = text + ` \nskinparam notefontsize 12 `;
      // making sure the numbers don't go above or below normal amounts
      this.participantfontsize < 1 ? this.participantfontsize = 1 : this.participantfontsize > 40 ? this.participantfontsize = 40 : null;
      this.sequencetextsize < 1 ? this.sequencetextsize = 1 : this.sequencetextsize > 40 ? this.sequencetextsize = 40 : null;
      this.participantpadding < 0 ? this.participantpadding = 0 : this.participantpadding > 500 ? this.participantpadding = 500 : null;
      // setting the padding between participants
      text = text + ` \nskinparam ParticipantPadding  ${this.participantpadding}`;
      // setting the participant's font size
      text = text + ` \nskinparam ParticipantFontSize ${this.participantfontsize}`;
      // setting the font size of the actors
      text = text + ` \nskinparam ActorFontSize ${this.participantfontsize}`;
      // setting the font size of the arrows
      text = text + ` \nskinparam ArrowFontSize ${this.sequencetextsize}`;
      // setting the font size of the sequence dividers
      text = text + ' \nskinparam SequenceDividerFontSize 14';
      // setting the padding between the boxes
      text = text + ' \nskinparam BoxPadding 15';
      // setting the font size of the title
      text = text + ` \nskinparam SequenceTitleFontSize ${this.participantfontsize + 1}`;
      // setting the border thickness of the title
      text = text + ` \nskinparam titleBorderThickness 2`;
      // setting the skinparams to allow the autonumbers to work
      text = this.changeTextForNumbers(this.selectedNumber, text, oDOM);
    }
    return text;
  }
  changeTextForNumbers(nr, text, oDOM) {
    // adding the autonumbers skin param and some padding if needed to gain more space for the labels to be added later
    switch (nr) {
      case 'None':
        return text;
      case 'Default':
        text = 'autonumber 1\n' + text;
        this.styling.clearLabels(oDOM);
        return text;
      default:
        text = 'autonumber 1\n' + text;
        text = text + `\nskinparam   Padding  4`;
        return text;
    }
  }
  async getData(text, roundcorner, generate) {
    return new Promise(function (resolve, reject) {
      // adding round corners to all rectangles to make it easier to find participants
      text = `${text} \n skinparam roundcorner ${roundcorner}`;
      // make the text ready to be sent to PlantUML
      const t = unescape(encodeURIComponent(text));
      // send a request to the PlantUML server
      generate.http.get(environment.api.prefix + environment.api.base + environment.api.path + generate.utility.encode64(deflate(t, 9)), { responseType: 'text' }).subscribe(
        (data) => {
          // add the svgTag id to the <svg> tag
          data = (data as string).replace('<svg', `<svg id="svgTag"`);
          // creating the domparser
          const oParser = new DOMParser();
          // parsing the svg from the PlantUML server into the domparser
          const oDOM = oParser.parseFromString(data, 'image/svg+xml');
          // returning the domparser when done
          resolve(oDOM);
        }, (er) => {
          // parsing the svg from the PlantUML server into the domparser
          try {
            const oDOM = generate.parseSVG(er.error) as Document;
            generate.isError = true;
            Array.from(oDOM.getElementsByTagName('text')).forEach(element => {
              if (element.textContent.includes('[From string ')) {
                let text = element;
                let content = text.textContent.split(')')[0];
                let string =
                  `[From string (line ${
                  (parseFloat(content.substr(18, content.length - 18)) -
                    (generate.isThemed ? generate.themedNumber == "None" ? 1 : 2 : generate.selectedNumber == "None" ? 1 : 2)
                  ).toString()
                  })]`;
                text.textContent = string;
                // returning the domparser when done
                resolve(oDOM);
              }
            })
          } catch{
            generate.svg = "<h1 style='color:red; font-family:\"Open sans\";'>404 No server Found</h1>";
            resolve()
          }

        });
    });
  }
  parseSVG(svgString) {
    var parser = new DOMParser();
    var parsererrorNS = parser.parseFromString('INVALID', 'image/svg+xml').getElementsByTagName("parsererror")[0].namespaceURI;
    var dom = parser.parseFromString(svgString, 'image/svg+xml');
    if (dom.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0) {
      throw new Error('Error parsing XML');
    }
    return dom;
  }
  hideNotes(oDOM) {
    // searching for notes and hiding them adding the note name tag
    this.styling.getTagList(oDOM, 'path').forEach((element: SVGRectElement) => {
      if (element.getAttribute('class') == null) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    // searching for notes and hiding them adding the note name tag
    this.styling.getTagList(oDOM, 'polygon').forEach((element: SVGRectElement) => {
      if (element.getAttribute('points').split(',').length >= 9) {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
    // hiding the text on the notes aswell
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-size') == '12') {
        element.setAttribute('display', 'none');
        element.setAttribute('name', 'note');
      }
    });
  }
  showNotes() {
    // get all notes
    const notes: any = document.getElementsByName('note');
    const list = Array.from(notes);
    // show all notes
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
    } else {
      if (!this.hiddenNotes) {
        this.hideNotes(oDOM);
      } else {
        this.showNotes();
      }
    }
  }
  setColors(oDOM) {
    // setting the color based on theme or own choices
    if (this.isThemed) {
      if (this.selectedTheme == 'Default plantUML') {
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
          this.styling.PlantUMLStyle[0]);
      } else if (this.selectedTheme == 'ISAAC') {
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
          this.styling.IsaacStyle[10]);
      } else if (this.selectedTheme == 'Deep sea') {
        this.styling.addColorToStyle(
          this.styling.DeepSeaStyle[0],
          this.styling.DeepSeaStyle[1],
          this.styling.DeepSeaStyle[2],
          this.styling.DeepSeaStyle[3],
          this.styling.DeepSeaStyle[4],
          this.styling.DeepSeaStyle[5],
          this.styling.DeepSeaStyle[6],
          this.styling.DeepSeaStyle[7],
          this.styling.DeepSeaStyle[8],
          oDOM,
          this.styling.DeepSeaStyle[9],
          this.styling.DeepSeaStyle[10]);
      } else if (this.selectedTheme == 'Graytone') {
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
          this.styling.GraytoneStyle[0]);
      } else if (this.selectedTheme == 'Black and white') {
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
          this.styling.BlackWhiteStyle[0]);
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
      );
    }
  }
  addListeners(oDOM) {
    this.styling.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.addListenersTo(element);
        this.addListenersTo(element.nextElementSibling);
      }
    });
    this.styling.getTagList(oDOM, 'image').forEach((element: SVGRectElement) => {
      this.addListenersTo(element);
      this.addListenersTo(element.nextElementSibling);
    });
    this.styling.getTagList(oDOM, 'ellipse').forEach((element: SVGRectElement) => {
      this.addListenersTo(element);
      this.addListenersTo(element.nextElementSibling);
    });
    this.styling.getTagList(oDOM, 'circle').forEach((element: SVGRectElement) => {
      this.addListenersTo(element);
      this.addListenersTo(element.nextElementSibling);
    });
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
    });
  }
  setAutoNumberLabel(oDOM, number) {
    switch (number) {
      case 'Circular':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircular(oDOM);
        break;
      case 'Rectangular':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangular(oDOM);
        break;
      case 'Rectangular-Framed':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRectangularFramed(oDOM);
        break;
      case 'Rounded-Framed':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRoundedFramed(oDOM);
        break;
      case 'Circular-Framed':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberCircularFramed(oDOM);
        break;
      case 'Rounded':
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberRounded(oDOM);
        break;
      case 'None':
        this.styling.clearLabels(oDOM);
        break;
      default:
        this.styling.clearLabels(oDOM);
        this.autonumbering.setAutonumberDefault(oDOM);
        break;
    }
  }
  setBreak(oDOM, Break) {
    switch (Break) {
      case 'Squiggly':
        this.styling.setSquiggly(oDOM);
        break;
      default:
        break;
    }
  }
  setFont(oDOM) {
    if (this.isThemed) {
      if (document.getElementById('googlelink')) {
        document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.themedFont);
      } else {
        const headID = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.id = 'googlelink';
        headID.appendChild(link);
        link.href = 'https://fonts.googleapis.com/css?family=' + this.themedFont;
      }
      oDOM.getElementById('svgTag').style.setProperty(`--font-stack`, this.themedFont);
    } else {
      if (document.getElementById('googlelink')) {
        document.getElementById('googlelink').setAttribute('href', 'https://fonts.googleapis.com/css?family=' + this.selectedFont);
      } else {
        const headID = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.id = 'googlelink';
        headID.appendChild(link);
        link.href = 'https://fonts.googleapis.com/css?family=' + this.selectedFont;
      }
      oDOM.getElementById('svgTag').style.setProperty(`--font-stack`, this.selectedFont);
    }
  }
  setStroke(oDOM, stroke) {
    stroke < 0 ? stroke = 0 : stroke > 15 ? stroke = 15 : null;
    this.participantstroke = stroke;
    oDOM.getElementById('svgTag').style.setProperty(`--participant-stroke-width`, stroke);
  }
  setLineBorders(oDOM, thickness) {
    thickness > 4 ? thickness = 4 : thickness < 0 ? thickness = 0 : null;
    this.lineThickness = thickness;
    oDOM.getElementById('svgTag').style.setProperty(`--border-thickness`, thickness.toString());
  }
  setFontSize(oDOM) {
    oDOM.getElementById('svgTag').style.setProperty(`--font-size`, this.selectedSize);
  }
  isaacStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rounded';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans';
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 16;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 2;
    this.multi = false;
  }
  DeepSeaStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Muli';
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
    this.multi = false;
  }
  GrayToneStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Circular';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans';
    this.themedFootnotes = false;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 2;
    this.multi = false;
  }
  BlackWhiteStyle() {
    this.themedBreak = 'Squiggly';
    this.themedNumber = 'Default';
    this.themedShape = 'Rounded';
    this.themedActor = 'Modern';
    this.themedFont = 'Open Sans';
    this.themedFootnotes = true;
    this.themedHiddenShadows = false;
    this.themedParticipantfontsize = 18;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
    this.multi = false;
  }
  plantumlStyle() {
    this.themedBreak = 'Default';
    this.themedNumber = 'None';
    this.themedShape = 'Rectangle';
    this.themedActor = 'Default';
    this.themedFont = 'Roboto';
    this.themedFootnotes = true;
    this.themedHiddenShadows = true;
    this.themedParticipantfontsize = 13;
    this.themedSequencetextsize = 13;
    this.themedParticipantstroke = 1.5;
    this.multi = false;
  }
  setTheme() {
    if (this.isThemed) {
      switch (this.selectedTheme) {
        case 'Default plantUML':
          this.plantumlStyle();
          break;
        case 'ISAAC':
          this.isaacStyle();
          break;
        case 'Deep sea':
          this.DeepSeaStyle();
          break;
        case 'Graytone':
          this.GrayToneStyle();
          break;
        case 'Black and white':
          this.BlackWhiteStyle();
          break;
        default:
          break;
      }
    }
  }
  findNamesInText(oDOM, fontsize) {
    // loop through all the <text> tags
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      // checking if its neither the first nor the last element in the diagram
      if (element.previousElementSibling && element.nextElementSibling) {
        // now er need to do some different things depending on the kind of tag the previous sibling is
        switch (element.previousElementSibling.nodeName) {
          // if its a <rect> then we need to check if its a participant by looking at the rx and class attributes
          case 'rect':
            if ((element.previousElementSibling as SVGRectElement).getAttribute('rx')) {
              if (!(element.previousElementSibling as SVGRectElement).getAttribute('class')) {
                if (element.getAttribute('font-size') == fontsize.toString()) {
                  (element.previousElementSibling as SVGRectElement).setAttribute('name', 'participantshape');
                }
              }
            }
            break;
          case 'ellipse':
            // if its an <ellipse> we need to check if its not part of an actor
            if (element.nextElementSibling.nextElementSibling) {
              if ((element.nextElementSibling.nextElementSibling as SVGRectElement).getAttribute('class')) {
                if ((element.nextElementSibling.nextElementSibling as SVGRectElement).getAttribute('class').includes('actor')) {
                  if (element.getAttribute('font-size') == fontsize.toString()) {
                    (element.nextElementSibling as SVGImageElement).setAttribute('name', 'participantshape');
                    (element.nextElementSibling as SVGImageElement).setAttribute('class', (element.nextElementSibling as SVGImageElement).getAttribute('class') + ' actorshape');
                  }
                }
              }
            }
            break;
          default:
            if (element.getAttribute('font-size') == fontsize.toString()) {
              (element.previousElementSibling as SVGRectElement).setAttribute('name', 'participantshape');
            }
            break;
        }
      }
    });
  }
  findTitle(oDOM, fontsize) {
    let once = true;
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGTextElement) => {
      if (parseFloat(element.getAttribute('font-size')) === fontsize + 1 && once) {
        once = false;
        (element.previousElementSibling as SVGRectElement).setAttribute('class', 'titleBox');
      }
    });
  }
  findBoxes(oDOM) {
    const height = parseFloat(oDOM.getElementById('svgTag').style.height) * 0.88;
    this.styling.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (parseFloat(element.getAttribute('height')) >= height) {
        element.setAttribute('class', element.getAttribute('class') ? element.getAttribute('class') + ' box' : 'box');
        element.setAttribute('height', (parseFloat(element.getAttribute('height')) + 5).toString());
        element.setAttribute('y', (parseFloat(element.getAttribute('y')) - 5).toString());
        element.setAttribute('x', (parseFloat(element.getAttribute('x')) - 5).toString());
        element.setAttribute('width', (parseFloat(element.getAttribute('width')) + 10).toString());
      }
    });
  }
  findNotes(oDOM) {
    this.styling.getTagList(oDOM, 'polygon').forEach((element: SVGPolygonElement) => {
      if (element.animatedPoints.length != 4) { element.setAttribute('class', 'note'); }
    });
  }
  findDividers(oDOM) {
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.previousElementSibling.nodeName == 'rect') {
          if (element.previousElementSibling.previousElementSibling) {
            if (element.previousElementSibling.previousElementSibling.nodeName == 'line') {
              if (element.previousElementSibling.previousElementSibling.previousElementSibling) {
                if (element.previousElementSibling.previousElementSibling.previousElementSibling.nodeName == 'line') {
                  if (element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling) {
                    if (element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.nodeName == 'rect') {
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
      if (element.getTotalLength().toPrecision(7) == '168.1421' ||
        element.getTotalLength().toPrecision(7) == '187.1421' ||
        element.getTotalLength().toPrecision(7) == '213.1421' ||
        element.getTotalLength().toPrecision(7) == '194.1421' ||
        element.getTotalLength().toPrecision(7) == '136.1421' ||
        element.getTotalLength().toPrecision(7) == '155.1421') {
        element.setAttribute('class', 'alt');
      }
    });
  }
  findDbs(oDOM) {
    this.styling.getTagList(oDOM, 'path').forEach((element: SVGRectElement) => {
      if (element.getTotalLength().toPrecision(6) == '142.712') {
        element.setAttribute('class', 'database');
      }
    });
  }
  setAlts(oDOM, shape) {
    this.styling.getTagList(oDOM, 'path').forEach((element: SVGPathElement) => {
      if (element.className.baseVal === 'alt') {
        if (shape === 'Rounded') {
          const d = element.getAttribute('d');
          const firstnrLength = d.split(',')[0].length - 1;
          const nr = parseFloat(d.substr(1, firstnrLength));
          const newnr = nr - 7;
          const nrstring = nr.toString();
          const newnrstring = newnr.toString();
          let newD = d.replace(nrstring, newnrstring);
          const secondnrLength = d.split(',')[1].split(' ')[0].length;
          const start = nr.toString().length + 2;
          const tnr = parseFloat(d.substr(start, secondnrLength));
          const tnewnr = tnr + 2;
          const tnrstring = tnr.toString();
          const tnewnrstring = tnewnr.toString();
          newD = newD.replace(tnrstring, tnewnrstring);
          element.setAttribute('d', newD);
        }
      }
    });
  }
  setAltBoxes(oDOM) {
    this.styling.getTagList(oDOM, 'rect').forEach((element: SVGPathElement) => {
      if (element.getAttribute('rx') === null && element.getAttribute('class') === null && parseFloat(element.getAttribute('width')) !== 10) {
        element.replaceWith();
      }
    });
    this.styling.getTagList(oDOM, 'text').forEach((element: SVGPathElement) => {
      if (element.getAttribute('font-size') === '11' && (element.previousElementSibling as SVGLineElement).getAttribute('class') === 'null dotted' && element.textContent.includes('[')) {
        (element.previousElementSibling as SVGLineElement).setAttribute('class', 'altDivider');
      }
    });
  }
  setMultiParticipants(oDOM: Document) {
    let count = 1;
    let half = false;
    this.participants = [];
    Array.from(oDOM.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
      let el;
      if (this.footnotes) {
        if (element.getAttribute('class')) {
          if (element.getAttribute('class').includes('actorshape')) {
            if (half) {
              half = false;
              (element.nextElementSibling.nextElementSibling as SVGRectElement).setAttribute('class', (element as SVGRectElement).getAttribute('class') + ` participant${count}`);
              const name = element.nextElementSibling.textContent;
              const elements = [element, element.nextElementSibling];
              const el = {};
              el[name] = elements;
              this.addToParticipants(name, elements);
              count++;
            } else {
              half = true;
              const name = element.nextElementSibling.textContent;
              const elements = [element, element.nextElementSibling];
              const el = {};
              el[name] = elements;
              this.addToParticipants(name, elements);
            }
          } else if (element.getAttribute('class').includes('actorClass')) {
            const name = element.parentElement.parentElement.nextElementSibling.textContent;
            const elements = [element, element.parentElement.parentElement.nextElementSibling];
            const el = {};
            el[name] = elements;
            this.addToParticipants(name, elements);
            count++;
          }
        } else {
          if (half) {
            half = false;
            const name = element.nextElementSibling.textContent;
            const elements = [element, element.nextElementSibling];
            const el = {};
            el[name] = elements;
            this.addToParticipants(name, elements);
            count++;
          } else {
            half = true;
            const name = element.nextElementSibling.textContent;
            const elements = [element, element.nextElementSibling];
            const el = {};
            el[name] = elements;
            this.addToParticipants(name, elements);
          }
        }
      } else {
        if (element.getAttribute('class')) {
          if (element.getAttribute('class').includes('actorshape')) {
            const name = element.nextElementSibling.textContent;
            const elements = [element, element.nextElementSibling.nextElementSibling];
            const el = {};
            el[name] = elements;
            this.addToParticipants(name, elements);
            count++;
          } else if (element.getAttribute('class').includes('actorClass')) {
            const name = element.parentElement.parentElement.nextElementSibling.textContent;
            const elements = [element, element.parentElement.parentElement.nextElementSibling];
            const el = {};
            el[name] = elements;
            this.addToParticipants(name, elements);
            count++;
          }
        } else {
          const name = element.nextElementSibling.textContent;
          const elements = [element, element.nextElementSibling];
          const el = {};
          el[name] = elements;
          this.addToParticipants(name, elements);
          count++;
        }
      }
    },
    );
    return count - 1;
  }
  addToParticipants(name, elements) {
    if (this.participants[name]) {
      this.participants[name].push(...elements);
    } else {
      this.participants[name] = elements;
    }
  }
  getParticipants() {
    const array = [];
    for (let i = 0; i < this.multicount; i++) {
      array.push(`participant ${i + 1}`);
    }
    return array;
  }
  setMultiParticipantShapes(oDOM) {
    this.participantShapes.forEach((ps) => {
      const participant = this.participants[ps.name];
      if (participant) {
        Array.from(oDOM.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
          if (participant[0]) {
            if (this.footnotes) {
              if (element.getAttribute('y') === participant[2].getAttribute('y') &&
                element.getAttribute('x') === participant[2].getAttribute('x')) {
                this.changeNode(oDOM, element, ps.shape, participant, ps.name, true);
              }
            }
            if (element.getAttribute('y') === participant[0].getAttribute('y') &&
              element.getAttribute('x') === participant[0].getAttribute('x')) {
              this.changeNode(oDOM, element, ps.shape, participant, ps.name);
            }
          }
        });
      }
    });
  }
  styleMultiParticipants(element, participant, pc) {
    if (this.footnotes) {
      if (element.getAttribute('y') === participant[2].getAttribute('y') &&
        element.getAttribute('cx') === participant[2].getAttribute('cx') &&
        element.getAttribute('cy') === participant[2].getAttribute('cy') &&
        element.getAttribute('x') === participant[2].getAttribute('x')) {
        (element as SVGRectElement).style.stroke = pc.border;
        (element as SVGRectElement).style.fill = pc.background;
        if (element.nextElementSibling) {
          (element.nextElementSibling as SVGRectElement).style.fill = pc.text;
          (element.nextElementSibling as SVGRectElement).style.stroke = 'none';
        } else {
          (element.parentElement.parentElement.nextElementSibling as SVGRectElement).style.fill = pc.text;
          (element.parentElement.parentElement.nextElementSibling as SVGRectElement).style.stroke = 'none';
        }
      }
    }
    if (element.getAttribute('y') === participant[0].getAttribute('y') &&
      element.getAttribute('cx') === participant[0].getAttribute('cx') &&
      element.getAttribute('cy') === participant[0].getAttribute('cy') &&
      element.getAttribute('x') === participant[0].getAttribute('x')) {
      (element as SVGRectElement).style.stroke = pc.border;
      (element as SVGRectElement).style.fill = pc.background;
      if (element.nextElementSibling) {
        (element.nextElementSibling as SVGRectElement).style.fill = pc.text;
        (element.nextElementSibling as SVGRectElement).style.stroke = 'none';
      } else {
        (element.parentElement.parentElement.nextElementSibling as SVGRectElement).style.fill = pc.text;
        (element.parentElement.parentElement.nextElementSibling as SVGRectElement).style.stroke = 'none';
      }
    }
  }
  setMultiParticipantColors(oDOM) {
    console.log(this);
    this.participantColors.forEach((pc) => {
      const participant = this.participants[pc.name];
      if (participant) {
        Array.from(oDOM.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
          if (participant[0]) {
            this.styleMultiParticipants(element, participant, pc);
          }
        });
      }
    });
  }
  changeNode(oDOM, element, shape, participant, name, second?) {
    if (shape === 'Ellipse') {
      this.styling.setEllipse(oDOM, element, participant, second);
    } else if (shape === 'Circle') {
      this.styling.setCircle(oDOM, element, participant, second);
    } else if (shape === 'Rectangle') {
      this.styling.setRectangle(oDOM, element, participant, second);
    } else if (shape === 'Rounded') {
      this.styling.setRounded(oDOM, element, participant, second);
    } else if (shape === 'Images') {
      this.styling.setImage(oDOM, element, this.participantImages[name], participant, second);
    }
  }
  setShapes(pname, pshape) {
    const index = this.participantShapes.findIndex((x) => x.name == pname);
    if (index === -1) {
      if (!this.participantShapes[0].name) {
        this.participantShapes.splice(0, 1, {
          name: pname,
          shape: pshape,
        });
      } else {
        this.participantShapes.push({
          name: pname,
          shape: pshape,
        });
      }
    } else {
      this.participantShapes.splice(index, 1, {
        name: pname,
        shape: pshape,
      });
    }
    for (let i = 0; i < this.participantShapes.length; i++) {
      const ps = this.participantShapes[i];
      if (!this.participants[ps.name]) {
        this.participantShapes.splice(i, 1);
      }
    }
  }
  setMultiColors(participant, pname, pborder?, pbackground?, ptext?) {
    const index = this.participantColors.findIndex((x) => x.name == pname);
    if (index === -1) {
      if (!this.participantColors[0].name) {
        this.participantColors.splice(0, 1, {
          name: pname,
          border: pborder,
          background: pbackground,
          text: ptext,
        });
      } else {
        this.participantColors.push({
          name: pname,
          border: pborder,
          background: pbackground,
          text: ptext,
        });
      }
    } else {
      if (pbackground) {
        this.participantColors[index].background = pbackground;
      }
      if (pborder) {
        this.participantColors[index].border = pborder;
      }
      if (ptext) {
        this.participantColors[index].text = ptext;
      }
    }
    for (let i = 0; i < this.participantColors.length; i++) {
      const ps = this.participantColors[i];
      if (!this.participants[ps.name]) {
        this.participantColors.splice(i, 1);
      }
    }
    const pc = { border: participant[0].style.stroke, background: participant[0].style.fill, text: participant[1].style.fill };
    Array.from(document.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
      this.styleMultiParticipants(element, participant, pc);
    });
  }
  setMultiParticipantImages(oDOM) {
    this.participantColors.forEach((pc) => {
      const participant = this.participants[pc.name];
      if (participant) {
        Array.from(oDOM.querySelectorAll('[name=participantshape]')).forEach((element: Element) => {
          if (participant[0]) {
            this.styleMultiParticipants(element, participant, pc);
          }
        });
      }
    });
  }
  setParticipantImage(img, name) {
    this.utility.toBase64(img).then(data => {
      this.participantImages[name] = data;
    }).then(() => {
      this.generateSVG(this.text);
    });
  }
  getShapeByName(participant) {
    this.parshape = 'Rectangle';
    this.participantShapes.forEach((shape) => {
      if (shape.name === participant.key) {
        this.parshape = shape.shape;
      }
    });
    this.selectedPart = participant;
  }
}
