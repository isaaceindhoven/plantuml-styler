import { Component, OnInit, ViewChild } from '@angular/core';
import { StylingService } from 'src/app/services/styling.service';
import { ZipService } from 'src/app/services/zip.service';
import { MatDialog } from '@angular/material';
import { GenerateService } from 'src/app/services/generate.service';
import { ImportExportService } from 'src/app/services/importexport.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, public util: UtilityService) { }

  ngOnInit() {
    let ns = 'http://www.w3.org/2000/svg'
    let rect = document.createElementNS(ns, 'rect');
    rect.setAttributeNS(null, 'width', "1")
    rect.setAttributeNS(null, 'height', '1')
    rect.setAttributeNS(null, 'x', "0")
    rect.setAttributeNS(null, 'y', "0")
    rect.setAttributeNS(null, 'name', 'label')
    rect.setAttributeNS(null, 'class', 'label')
    this.generate.selectedParticipant = { key: "Pick a Participant", value: [rect, rect] }
    this.close()
  }
  setTheme(array) {
    this.generate.color1 = array[0];
    this.generate.color2 = array[1];
    this.generate.color3 = array[2];
    this.generate.color4 = array[3];
    this.generate.color5 = array[4];
    this.generate.color6 = array[5];
    this.generate.color7 = array[6];
    this.generate.color8 = array[7];
    this.generate.color9 = array[8];
    this.generate.colorBoxBack = array[9];
    this.generate.colorBoxStroke = array[10];
  }
  editTheme() {
    this.util.openEditor = !this.util.openEditor;
    setTimeout(() => {
      this.util.setWidth();
    },5);
    if (this.util.openEditor && this.generate.selectedTheme!='No theme') {
      this.generate.isThemed = false;
      this.generate.selectedBreak = this.generate.themedBreak;
      this.generate.selectedNumber = this.generate.themedNumber;
      this.generate.selectedShape = this.generate.themedShape;
      this.generate.selectedActor = this.generate.themedActor;
      this.generate.selectedFont = this.generate.themedFont;
      this.generate.footnotes = this.generate.themedFootnotes;
      this.generate.hiddenShadows = this.generate.themedHiddenShadows;
      this.generate.participantfontsize = this.generate.themedParticipantfontsize;
      this.generate.sequencetextsize = this.generate.themedSequencetextsize;
      this.generate.participantstroke = this.generate.themedParticipantstroke;
      switch (this.generate.selectedTheme) {
        case 'Default plantUML':
          this.setTheme(this.stylingservice.PlantUMLStyle);
          break;
        case 'ISAAC':
          this.setTheme(this.stylingservice.IsaacStyle);
          break;
        case 'Deep sea':
          this.setTheme(this.stylingservice.DeepSeaStyle);
          break;
        case 'Graytone':
          this.setTheme(this.stylingservice.GraytoneStyle);
          break;
        case 'Black and white':
          this.setTheme(this.stylingservice.BlackWhiteStyle);
          break;
        default:
          break;
      }
    }
  }

  loadFile(file) {
    if (file.type == 'application/zip') {
      const entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        let correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            const newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob);
            });
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            const newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadConfig(blob);
            });
          }
        });
        if (!correctFile) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This zip contains no correct file types.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    } else if (file.type == 'application/x-zip-compressed') {
      const entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        let correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            const newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob);
            });
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            const newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadConfig(blob);
            });
          }
        });
        if (!correctFile) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This zip contains no correct file types.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    } else if (file.type == 'application/json') {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadConfig(file);
    } else if (file.name.endsWith('.puml')) {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadCode(file);
    } else if (file.type == 'text/plain') {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadCode(file);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This file type is not supported.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  fileChanged(event) {
    const file = event.target.files[0];
    this.loadFile(file);
  }
  close() {
    this.util.openEditor = false;
    setTimeout(() => {
      this.util.setWidth();
      this.util.resizeAce();
    });
  }
}
