import { Component, OnInit } from '@angular/core'
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: NgxFileDropEntry[] = [];
  isOpen: boolean;
  isLoading = false;
  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, private util: UtilityService) { }
  ngOnInit() {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
      var dt = e.dataTransfer;
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

    this.generate.colorParticipantBorder1 = '#a80036'
    this.generate.colorParticipantBorder2 = '#a80036'
    this.generate.colorParticipantBorder3 = '#a80036'
    this.generate.colorParticipantBorder4 = '#a80036'
    this.generate.colorParticipantBorder5 = '#a80036'
    this.generate.colorParticipantBorder6 = '#a80036'
    this.generate.colorParticipantBorder7 = '#a80036'
    this.generate.colorParticipantBorder8 = '#a80036'
    this.generate.colorParticipantBorder9 = '#a80036'

    this.generate.colorParticipantBackground1 = '#fefece'
    this.generate.colorParticipantBackground2 = '#fefece'
    this.generate.colorParticipantBackground3 = '#fefece'
    this.generate.colorParticipantBackground4 = '#fefece'
    this.generate.colorParticipantBackground5 = '#fefece'
    this.generate.colorParticipantBackground6 = '#fefece'
    this.generate.colorParticipantBackground7 = '#fefece'
    this.generate.colorParticipantBackground8 = '#fefece'
    this.generate.colorParticipantBackground9 = '#fefece'
  }
  reduceTextarea() {
    document.getElementById('tA').style.height = '150px';
    document.getElementById('appCard').style.width = '360px';
    document.getElementById('scrollbar2').style.width = null;
    this.generate.isLarge = false;
  }
  openTextDialog() {
    if (document.getElementById('appCard').style.width != '1000px') {
      document.getElementById('appCard').style.width = '1000px';
      document.getElementById('tA').style.height = '450px';
      this.stylingservice.setDiagramCardsize();
      this.generate.isLarge = true;
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
        this.generate.color1 = this.stylingservice.PlantUMLStyle[0];
        this.generate.color2 = this.stylingservice.PlantUMLStyle[1];
        this.generate.color3 = this.stylingservice.PlantUMLStyle[2];
        this.generate.color4 = this.stylingservice.PlantUMLStyle[3];
        this.generate.color5 = this.stylingservice.PlantUMLStyle[4];
        this.generate.color6 = this.stylingservice.PlantUMLStyle[5];
        this.generate.color7 = this.stylingservice.PlantUMLStyle[6];
        this.generate.color8 = this.stylingservice.PlantUMLStyle[7];
        this.generate.color9 = this.stylingservice.PlantUMLStyle[8];
        this.generate.colorParticipantBorder1 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder2 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder3 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder4 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder5 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder6 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder7 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder8 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBorder9 = this.stylingservice.PlantUMLStyle[0];
        this.generate.colorParticipantBackground1 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground2 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground3 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground4 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground5 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground6 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground7 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground8 = this.stylingservice.PlantUMLStyle[1];
        this.generate.colorParticipantBackground9 = this.stylingservice.PlantUMLStyle[1];
        break;
      case 'ISAAC':
        this.generate.color1 = this.stylingservice.IsaacStyle[0];
        this.generate.color2 = this.stylingservice.IsaacStyle[1];
        this.generate.color3 = this.stylingservice.IsaacStyle[2];
        this.generate.color4 = this.stylingservice.IsaacStyle[3];
        this.generate.color5 = this.stylingservice.IsaacStyle[4];
        this.generate.color6 = this.stylingservice.IsaacStyle[5];
        this.generate.color7 = this.stylingservice.IsaacStyle[6];
        this.generate.color8 = this.stylingservice.IsaacStyle[7];
        this.generate.color9 = this.stylingservice.IsaacStyle[8];
        this.generate.colorParticipantBorder1 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder2 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder3 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder4 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder5 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder6 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder7 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder8 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBorder9 = this.stylingservice.IsaacStyle[0];
        this.generate.colorParticipantBackground1 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground2 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground3 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground4 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground5 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground6 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground7 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground8 = this.stylingservice.IsaacStyle[1];
        this.generate.colorParticipantBackground9 = this.stylingservice.IsaacStyle[1];
        break;
      case 'Johan':
        this.generate.color1 = this.stylingservice.JohanStyle[0];
        this.generate.color2 = this.stylingservice.JohanStyle[1];
        this.generate.color3 = this.stylingservice.JohanStyle[2];
        this.generate.color4 = this.stylingservice.JohanStyle[3];
        this.generate.color5 = this.stylingservice.JohanStyle[4];
        this.generate.color6 = this.stylingservice.JohanStyle[5];
        this.generate.color7 = this.stylingservice.JohanStyle[6];
        this.generate.color8 = this.stylingservice.JohanStyle[7];
        this.generate.color9 = this.stylingservice.JohanStyle[8];
        this.generate.colorParticipantBorder1 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder2 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder3 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder4 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder5 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder6 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder7 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder8 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBorder9 = this.stylingservice.JohanStyle[0];
        this.generate.colorParticipantBackground1 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground2 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground3 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground4 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground5 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground6 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground7 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground8 = this.stylingservice.JohanStyle[1];
        this.generate.colorParticipantBackground9 = this.stylingservice.JohanStyle[1];
        break;
      case 'Graytone':
        this.generate.color1 = this.stylingservice.GraytoneStyle[0];
        this.generate.color2 = this.stylingservice.GraytoneStyle[1];
        this.generate.color3 = this.stylingservice.GraytoneStyle[2];
        this.generate.color4 = this.stylingservice.GraytoneStyle[3];
        this.generate.color5 = this.stylingservice.GraytoneStyle[4];
        this.generate.color6 = this.stylingservice.GraytoneStyle[5];
        this.generate.color7 = this.stylingservice.GraytoneStyle[6];
        this.generate.color8 = this.stylingservice.GraytoneStyle[7];
        this.generate.color9 = this.stylingservice.GraytoneStyle[8];
        this.generate.colorParticipantBorder1 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder2 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder3 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder4 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder5 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder6 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder7 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder8 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBorder9 = this.stylingservice.GraytoneStyle[0];
        this.generate.colorParticipantBackground1 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground2 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground3 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground4 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground5 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground6 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground7 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground8 = this.stylingservice.GraytoneStyle[1];
        this.generate.colorParticipantBackground9 = this.stylingservice.GraytoneStyle[1];
        break;
      case 'Blackwhite':
        this.generate.color1 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.color2 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.color3 = this.stylingservice.BlackWhiteStyle[2];
        this.generate.color4 = this.stylingservice.BlackWhiteStyle[3];
        this.generate.color5 = this.stylingservice.BlackWhiteStyle[4];
        this.generate.color6 = this.stylingservice.BlackWhiteStyle[5];
        this.generate.color7 = this.stylingservice.BlackWhiteStyle[6];
        this.generate.color8 = this.stylingservice.BlackWhiteStyle[7];
        this.generate.color9 = this.stylingservice.BlackWhiteStyle[8];

        this.generate.colorParticipantBorder1 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder2 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder3 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder4 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder5 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder6 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder7 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder8 = this.stylingservice.BlackWhiteStyle[0];
        this.generate.colorParticipantBorder9 = this.stylingservice.BlackWhiteStyle[0];

        this.generate.colorParticipantBackground1 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground2 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground3 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground4 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground5 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground6 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground7 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground8 = this.stylingservice.BlackWhiteStyle[1];
        this.generate.colorParticipantBackground9 = this.stylingservice.BlackWhiteStyle[1];
        break;
      default:
        break;
    }

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
    var zip = new JSZip();
    zip.file("code.puml", this.generate.text);
    var svgstring = document.getElementById('svgTag').outerHTML;
    svgstring = svgstring.replace("<defs>", `<defs>${this.util.getSVGStyle()}`)
    zip.file("diagram.svg", svgstring);
    zip.file("style.json", this.impoexpo.saveConfig(true));
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3, backgroundColor: '#fefefe' }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram.png", data, { base64: true });
    });
    // var doc = new jsPDF('landscape', 'px');
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
      var entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        var correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            var newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob)
            })
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            var newdata = this.zipservice.getData(entry);
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
      var entries = this.zipservice.getEntries(file);
      entries.subscribe(data => {
        var correctFile = false;
        data.forEach(entry => {
          if (entry.filename == 'code.puml') {
            correctFile = true;
            var newdata = this.zipservice.getData(entry);
            newdata.data.subscribe(blob => {
              this.impoexpo.loadCode(blob)
            })
          }
          if (entry.filename == 'style.json') {
            correctFile = true;
            var newdata = this.zipservice.getData(entry);
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