import { Component, OnInit } from '@angular/core';
import * as svg from 'save-svg-as-png';
import { StylingService } from 'src/app/services/styling.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { ZipService } from 'src/app/services/zip.service';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { MatDialog, MatInput } from '@angular/material';
import { GenerateService } from 'src/app/services/generate.service';
import { ImportExportService } from 'src/app/services/importexport.service';
import { UtilityService } from 'src/app/services/utility.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, public util: UtilityService) { }
  isLoading = false;
  importing = false;
  files: NgxFileDropEntry[] = [];
  ngOnInit() {
    window.addEventListener('dragover', e => {
      e && e.preventDefault();
      const dt = e.dataTransfer;
      if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.includes('Files'))) {
        if (!this.util.openEditor) {
          this.util.openEditor = true;
        }
        if (!this.importing) {
          this.importing = true;
        }
      }
    }, false);
    window.addEventListener('drop', e => {
      e && e.preventDefault();
    }, false);
    this.generate.generateSVG(this.generate.text);
    this.stylingservice.getFonts().subscribe(data => {
      this.generate.fonts = Array.from((data as any).items);
    });
    this.generate.color1 = '#a80036';
    this.generate.color2 = '#fefece';
    this.generate.color3 = '#fbfb77';
    this.generate.color4 = '#3a3a3a';
    this.generate.color5 = '#000000';
    this.generate.color6 = '#a80036';
    this.generate.color7 = '#a80036';
    this.generate.color8 = '#fefece';
    this.generate.color9 = '#000000';
    this.generate.colorBoxBack = '#fefece';
    this.generate.colorBoxStroke = '#a80036';
    this.generate.selectedTheme = 'ISAAC';
    this.generate.isThemed = true;
    setTimeout(() => {
      this.editTheme();
      this.util.openEditor = true;

    }, 1000);
  }
  Select(input) {
    console.log(input);

    setTimeout(() => {
      input.select();
    }, 0);
  }

  editTheme() {
    this.util.openEditor = !this.util.openEditor;
    setTimeout(() => {
      this.util.setWidth();
      this.util.resizeAce();
    });
    if (this.util.openEditor && this.generate.selectedTheme != 'No theme') {
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
  activateTheme() {
    if (this.generate.selectedTheme != 'No theme') {
      this.generate.isThemed = true;
      this.generate.generateSVG(this.generate.text);
    } else {
      this.generate.isThemed = false;
      this.generate.generateSVG(this.generate.text);
    }
  }
  download() {
    this.isLoading = true;
    const zip = new JSZip();
    zip.file('code.puml', this.generate.text);
    let svgstring = document.getElementById('svgTag').outerHTML;
    svgstring = svgstring.replace('<defs>', `<defs>${this.util.getSVGStyle()}`);
    zip.file('diagram.svg', svgstring);
    zip.file('style.json', this.impoexpo.saveConfig(true));
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3, backgroundColor: '#fefefe' }, async (data) => {
      data = data.replace('data:image/png;base64,', '');
      await zip.file('diagram.png', data, { base64: true });
    });
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3 }, async (data) => {
      data = data.replace('data:image/png;base64,', '');
      await zip.file('diagram-Transparent.png', data, { base64: true });
    });
    if (this.generate.participantImages) {
      setTimeout(() => {
        zip.generateAsync({ type: 'blob' })
          .then(async function (blob) {
            await saveAs(blob, `StyleUML_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.zip`);
          }).then(this.isLoading = false);
      }, 3000);
    } else {
      setTimeout(() => {
        zip.generateAsync({ type: 'blob' })
          .then(async function (blob) {
            await saveAs(blob, `StyleUML_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.zip`);
          }).then(this.isLoading = false);
      }, 500);
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
  dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    const droppedFile = files[0];
    // Is it a file?
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.loadFile(file);
      });
    } else {
      // It was a directory (empty directories are added, otherwise only files)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You uploaded a empty directory!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  setEnvironment(string) {
    console.log(string);
    environment.api.base = string;
    console.log(environment);
    
  }
  getEnvironment() {
    return environment.api.base;
  }
}
