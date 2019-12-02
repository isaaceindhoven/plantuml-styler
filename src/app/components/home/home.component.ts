import { Component, OnInit, ViewChild } from '@angular/core'
import * as svg from 'save-svg-as-png'
import { StylingService } from 'src/app/services/styling.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2'
import { ZipService } from 'src/app/services/zip.service'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatExpansionPanel, MatDialog } from '@angular/material'
import { GenerateService } from 'src/app/services/generate.service'
import { ImportExportService } from 'src/app/services/importexport.service'
import { TextAreaComponent } from '../text-area/text-area.component'
import { UtilityService } from 'src/app/services/utility.service'
import 'brace';
import 'brace/mode/text';
import 'brace/theme/dawn';
import { AceConfigInterface } from 'ngx-ace-wrapper/dist/lib/ace.interfaces';
import { AceComponent } from 'ngx-ace-wrapper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('aceComp', { static: true }) aceElement: AceComponent;
  files: NgxFileDropEntry[] = [];
  isOpen: boolean;
  isLoading = false;
  public config: AceConfigInterface = {
    mode: 'text',
    theme: 'dawn',
    readOnly: false
  };
  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, private util: UtilityService) { }


  ngOnInit() {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
      let dt = e.dataTransfer;
      if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.includes('Files'))) {
        if (!this.isOpen) {
          this.isOpen = true;
        }
      }
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
    this.generate.generateSVG(this.generate.text)
    this.stylingservice.getFonts().subscribe(data => {
      this.generate.fonts = Array.from((data as any).items);
    })
    this.generate.color1 = '#a80036'
    this.generate.color2 = '#fefece'
    this.generate.color3 = '#fbfb77'
    this.generate.color4 = '#3a3a3a'
    this.generate.color5 = '#000000'
    this.generate.color6 = '#a80036'
    this.generate.color7 = '#a80036'
    this.generate.color8 = '#fefece'
    this.generate.color9 = '#000000'
    this.generate.colorBoxBack = '#fefece'
    this.generate.colorBoxStroke = '#a80036'
    this.generate.selectedTheme = 'ISAAC';
    this.generate.isThemed = true;
    setTimeout(() => {
      this.editTheme();
    }, 1000);
  }
  reduceTextarea() {
    document.getElementById('tA').style.height = '150px';
    document.getElementById('appCard').style.width = '360px';
    document.getElementById('appCard').style.display = '';
    document.getElementById('scrollbar2').style.width = null;
    document.getElementById('scrollbar2').style.maxWidth = '1500px';
    document.getElementById('scrollbar2').style.marginLeft = null;
    this.generate.isLarge = false;
    this.generate.isSmall = false;
    this.aceElement.directiveRef.ace().resize();
  }
  closeApp() {
    document.getElementById('tA').style.height = '150px';
    document.getElementById('appCard').style.width = '0px';
    document.getElementById('appCard').style.display = 'none';
    document.getElementById('scrollbar2').style.width = '95%';
    document.getElementById('scrollbar2').style.maxWidth = '95%';
    document.getElementById('scrollbar2').style.marginLeft = '5%';
    this.generate.isLarge = false;
    this.generate.isSmall = true;
  }

  openTextDialog() {
    if (document.getElementById('appCard').style.width != '1000px') {
      document.getElementById('appCard').style.width = '1000px';
      document.getElementById('tA').style.height = '450px';
      this.stylingservice.setDiagramCardsize();
      this.generate.isLarge = true;
      this.aceElement.directiveRef.ace().resize();
    }
    else {
      this.reduceTextarea();
    }
    // this.dialog.open(TextAreaComponent, {
    //   height: '90%',
    //   width: '90%',
    //   data: {
    //     text: this.generate.text
    //   }
    // });
  }
  editTheme() {
    this.generate.isThemed = false;
    this.generate.selectedBreak = this.generate.themedBreak
    this.generate.selectedNumber = this.generate.themedNumber
    this.generate.selectedShape = this.generate.themedShape
    this.generate.selectedActor = this.generate.themedActor
    this.generate.selectedFont = this.generate.themedFont
    this.generate.footnotes = this.generate.themedFootnotes
    this.generate.hiddenShadows = this.generate.themedHiddenShadows
    this.generate.participantfontsize = this.generate.themedParticipantfontsize
    this.generate.sequencetextsize = this.generate.themedSequencetextsize
    this.generate.participantstroke = this.generate.themedParticipantstroke
    switch (this.generate.selectedTheme) {
      case 'PlantUML':
        this.setTheme(this.stylingservice.PlantUMLStyle)
        break;
      case 'ISAAC':
        this.setTheme(this.stylingservice.IsaacStyle)
        break;
      case 'Johan':
        this.setTheme(this.stylingservice.JohanStyle)
        break;
      case 'Graytone':
        this.setTheme(this.stylingservice.GraytoneStyle)
        break;
      case 'Blackwhite':
        this.setTheme(this.stylingservice.BlackWhiteStyle)
        break;
      default:
        break;
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
  dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    const droppedFile = files[0];
    // Is it a file?
    if (droppedFile.fileEntry.isFile) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.loadFile(file)
      });
    } else {
      // It was a directory (empty directories are added, otherwise only files)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You uploaded a empty directory!',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  download() {
    this.isLoading = true;
    let zip = new JSZip();
    zip.file("code.puml", this.generate.text);
    let svgstring = document.getElementById('svgTag').outerHTML;
    svgstring = svgstring.replace("<defs>", `<defs>${this.util.getSVGStyle()}`)
    zip.file("diagram.svg", svgstring);
    zip.file("style.json", this.impoexpo.saveConfig(true));
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3, backgroundColor: '#fefefe' }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram.png", data, { base64: true });
    });
    // let doc = new jsPDF('landscape', 'px');
    // svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 0.5, scale: 3 }, (data) => {
    //   doc.addImage(data, 'PNG', 0, 0, Number.parseFloat(document.getElementById('svgTag').getAttribute('width')) / 2, Number.parseFloat(document.getElementById('svgTag').getAttribute('height')) / 2);
    //   doc.save('diagram.pdf');
    // });
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3 }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram-Transparent.png", data, { base64: true });
    });
    setTimeout(() => {
      zip.generateAsync({ type: "blob" })
        .then(function (blob) {
          saveAs(blob, `StyleUML_${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}.zip`);
        });
      this.isLoading = false;
    }, 500);

  }
  setImage(image, text) {
    this.stylingservice.image = window.URL.createObjectURL(image.files[0])
    setTimeout(() => {
      this.generate.generateSVG(text);
    }, 100);
  }
  loadFile(file) {
    if (file.type == 'application/zip') {
      let entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        let correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            let newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob)
            })
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            let newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadConfig(blob);
            })
          }
        });
        if (!correctFile) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This zip contains no correct file types.',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
    else if (file.type == 'application/x-zip-compressed') {
      let entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        let correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            let newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob)
            })
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            let newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadConfig(blob);
            })
          }
        });
        if (!correctFile) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This zip contains no correct file types.',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    } else if (file.type == 'application/json') {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadConfig(file);
    }
    else if (file.name.endsWith('.puml')) {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadCode(file)
    }
    else if (file.type == 'text/plain') {
      this.generate.halfwayDoneProcessing = true;
      this.impoexpo.loadCode(file)
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'This file type is not supported.',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
  fileChanged(event) {
    const file = event.target.files[0];
    this.loadFile(file);
  }
}