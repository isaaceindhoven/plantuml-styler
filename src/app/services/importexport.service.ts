import { Injectable } from '@angular/core';
import { GenerateService } from './generate.service';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {

  constructor(private gen: GenerateService) { }

  saveConfig(returning) {
    let json = JSON.stringify({
      color1: this.gen.color1,
      color2: this.gen.color2,
      color3: this.gen.color3,
      color4: this.gen.color4,
      color5: this.gen.color5,
      color6: this.gen.color6,
      color7: this.gen.color7,
      color8: this.gen.color8,
      color9: this.gen.color9,
      colorBoxBack: this.gen.colorBoxBack,
      colorBoxStroke: this.gen.colorBoxStroke,
      selectedSize: this.gen.selectedSize,
      selectedTheme: this.gen.selectedTheme,
      selectedFont: this.gen.selectedFont,
      selectedBreak: this.gen.selectedBreak,
      selectedActor: this.gen.selectedActor,
      selectedShape: this.gen.selectedShape,
      selectedNumber: this.gen.selectedNumber,
      themedBreak: this.gen.themedBreak,
      themedNumber: this.gen.themedNumber,
      themedShape: this.gen.themedShape,
      themedActor: this.gen.themedActor,
      themedFont: this.gen.themedFont,
      themedHiddenFootnotes: this.gen.themedFootnotes,
      themedHiddenShadows: this.gen.themedHiddenShadows,
      themedParticipantfontsize: this.gen.themedParticipantfontsize,
      themedSequencetextsize: this.gen.themedSequencetextsize,
      themedParticipantstroke: this.gen.themedParticipantstroke,
      hiddenNotes: this.gen.hiddenNotes,
      hiddenFootnotes: this.gen.footnotes,
      hiddenShadows: this.gen.hiddenShadows,
      isThemed: this.gen.isThemed,
      textImages: this.gen.textImages,
      participantpadding: this.gen.participantpadding,
      participantfontsize: this.gen.participantfontsize,
      participantstroke: this.gen.participantstroke,
      sequencetextsize: this.gen.sequencetextsize,
      lineThickness: this.gen.lineThickness,
      themedLineThickness: this.gen.themedLineThickness,
      multi: this.gen.multi,
      multicount: this.gen.multicount,
      participants: this.gen.participants,
      participantColors:this.gen.participantColors,
      participantShapes: this.gen.participantShapes
    });
    if (returning) {
      return json;
    }
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    let a = document.createElement('a');
    a.download = "style.json";
    a.href = dataStr;
    document.body.appendChild(a);
    a.click();
  }
  loadConfig(json) {
    let reader = new FileReader();
    reader.onload = (event) => {
      this.onConfigReaderLoad(event);
    }
    reader.readAsText(json);
  }
  loadCode(puml) {
    this.gen.isDoneProcessing = false;
    let reader = new FileReader();
    reader.onload = (event) => {
      this.onCodeReaderLoad(event);
    }
    reader.readAsText(puml);
  }
  onCodeReaderLoad(event) {
    this.gen.isDoneProcessing = false;
    let puml = event.target.result;
    this.gen.text = puml;
    // document.getElementById('tA').textContent = puml;
    setTimeout(() => {
      if (this.gen.halfwayDoneProcessing) {
        this.gen.isDoneProcessing = true;
        this.gen.generateSVG(puml)
      } else {
        this.gen.halfwayDoneProcessing = true;
      }
    }, 200);

  }
  onConfigReaderLoad(event) {
    let json = JSON.parse(event.target.result);
    this.gen.color1 = json.color1;
    this.gen.color2 = json.color2;
    this.gen.color3 = json.color3;
    this.gen.color4 = json.color4;
    this.gen.color5 = json.color5;
    this.gen.color6 = json.color6;
    this.gen.color7 = json.color7;
    this.gen.color8 = json.color8;
    this.gen.color9 = json.color9;
    this.gen.colorBoxBack = json.colorBoxBack;
    this.gen.colorBoxStroke = json.colorBoxStroke;
    this.gen.selectedSize = json.selectedSize;
    this.gen.selectedTheme = json.selectedTheme;
    this.gen.selectedFont = json.selectedFont;
    this.gen.selectedBreak = json.selectedBreak;
    this.gen.selectedActor = json.selectedActor;
    this.gen.selectedShape = json.selectedShape;
    this.gen.selectedNumber = json.selectedNumber;
    this.gen.hiddenNotes = json.hiddenNotes;
    this.gen.footnotes = json.hiddenFootnotes;
    this.gen.hiddenShadows = json.hiddenShadows;
    this.gen.isThemed = json.isThemed;
    this.gen.textImages = json.textImages;
    this.gen.participantpadding = json.participantpadding;
    this.gen.participantfontsize = json.participantfontsize;
    this.gen.participantstroke = json.participantstroke;
    this.gen.sequencetextsize = json.sequencetextsize;
    this.gen.themedBreak = json.themedBreak
    this.gen.themedNumber = json.themedNumber
    this.gen.themedShape = json.themedShape
    this.gen.themedActor = json.themedActor
    this.gen.themedFont = json.themedFont
    this.gen.themedFootnotes = json.themedHiddenFootnotes
    this.gen.themedHiddenShadows = json.themedHiddenShadows
    this.gen.themedParticipantfontsize = json.themedParticipantfontsize
    this.gen.themedSequencetextsize = json.themedSequencetextsize
    this.gen.themedParticipantstroke = json.themedParticipantstroke
    this.gen.lineThickness = json.lineThickness;
    this.gen.themedLineThickness = json.themedLineThickness;
    this.gen.multicount = json.multicount;
    this.gen.multi = json.multi;
    this.gen.participants = json.participants;
    this.gen.participantColors = json.participantColors;
    this.gen.participantShapes = json.participantShapes;
    if (this.gen.halfwayDoneProcessing) {
      this.gen.isDoneProcessing = true;
      this.gen.generateSVG(this.gen.text)
    } else {
      this.gen.halfwayDoneProcessing = true;
    }
  }
}