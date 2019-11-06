import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
declare var deflate: any
import * as svg from 'save-svg-as-png'
import { DataService } from 'src/app/services/data.service'
import { AutoNumberService } from 'src/app/services/autonumber.service'
import { StylingService } from 'src/app/services/styling.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment.prod'
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import { ZipService } from 'src/app/services/zip.service'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { MatExpansionPanel } from '@angular/material'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  files: NgxFileDropEntry[] = [];
  isOpen: boolean;
  constructor(private http: HttpClient, public dataservice: DataService, private autonumberservice: AutoNumberService, private stylingservice: StylingService, private zipservice: ZipService) { }
  ngOnInit() {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
      if(!this.isOpen){
        this.isOpen = true;
      }
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
    this.dataservice.updateSVG('')
    this.dataservice.generateSvg(this.dataservice.text)
    this.dataservice.getFonts().subscribe(data => {
      this.dataservice.fonts = Array.from((data as any).items);
    })

    this.dataservice.color1 = '#a80036'
    this.dataservice.color2 = '#fefece'
    this.dataservice.color3 = '#fbfb77'
    this.dataservice.color4 = '#3a3a3a'
    this.dataservice.color5 = '#000000'
    this.dataservice.color6 = '#a80036'
    this.dataservice.color7 = '#a80036'
    this.dataservice.color8 = '#fefece'
    this.dataservice.color9 = '#000000'
  }
  dropped(files: NgxFileDropEntry[]) {
    console.log('dropped');

    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(file);
          this.fileLoading(file)
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
        console.log("error");
      }
    }
  }
  // async loadFile(fileEntry) {

  //   console.log(file);
  //   if (file.type == 'application/zip') {
  //     var entries = this.zipservice.getEntries(file);
  //     entries.subscribe(data => {
  //       data.forEach(entry => {
  //         if (entry.filename == 'code.puml') {
  //           var newdata = this.zipservice.getData(entry);
  //           newdata.data.subscribe(blob => {
  //             this.dataservice.loadCode(blob)
  //           })
  //         }
  //         if (entry.filename == 'style.json') {
  //           var newdata = this.zipservice.getData(entry);
  //           newdata.data.subscribe(blob => {
  //             this.dataservice.loadConfig(blob);
  //           })
  //         }
  //       });
  //     })
  //   } else if (file.type == 'application/json') {
  //     this.dataservice.loadConfig(file);
  //   }
  //   else if (file.name.endsWith('.puml')) {
  //     this.dataservice.loadCode(file)
  //   }
  //   else if (file.type == 'text/plain') {
  //     this.dataservice.loadCode(file)
  //   }
  //   );
  // }
  download() {
    var zip = new JSZip();
    var doc = new jsPDF('landscape', 'px');
    zip.file("code.puml", this.dataservice.text);
    var svgstring = document.getElementById('svgTag').outerHTML;
    svgstring = svgstring.replace("<defs>", `<defs>${this.getSVGStyle()}`)
    zip.file("diagram.svg", svgstring);
    zip.file("style.json", this.dataservice.saveConfig(true));
    svg.svgAsPngUri(document.getElementById('svgTag'), { encoderOptions: 1, scale: 3, backgroundColor: '#fefefe' }, (data) => {
      data = data.replace('data:image/png;base64,', '')
      zip.file("diagram.png", data, { base64: true });
    });
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
    }, 500);

  }
  setImage(image, text) {
    this.dataservice.img = image;
    setTimeout(() => {
      this.dataservice.generateSvg(text);
    }, 100);
  }

  fileLoading(file) {
    var entries = this.zipservice.getEntries(file);
    entries.subscribe(data => {
      console.log("data", data);
      data.forEach(entry => {
        console.log("entry", entry);
        if (entry.filename == 'code.puml') {
          var newdata = this.zipservice.getData(entry);
          newdata.data.subscribe(blob => {
            this.dataservice.loadCode(blob)
          })
        }
        if (entry.filename == 'style.json') {
          var newdata = this.zipservice.getData(entry);
          newdata.data.subscribe(blob => {
            this.dataservice.loadConfig(blob);
          })
        }
      });
    })
  }

  fileChanged(event) {
    const file = event.target.files[0];
    console.log('filechanged', file);

    this.fileLoading(file);
  }
  getSVGStyle() {
    return `<style>svg g ellipse,
    svg g circle,
    svg g rect {
      stroke: var(--primary-color);
      stroke-width: var(--participant-stroke-width);
      /* fill: url(#image); */
      fill: var(--secondary-color);
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g path {
      fill: var(--tertiary-color);
      stroke: var(--quaternary-color);
      stroke-width: 1.5;
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g polygon {
      fill: var(--line-color);
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g line,
    svg g polyline {
      stroke: var(--line-color);
      stroke-width: 1px;
      stroke-dasharray: 3000;
      animation: draw 3s linear;
    }
    
    svg g text {
      fill: var(--text-color);
      font-family: var(--font-stack), "Tahoma";
      font-size: 14;
    }
    
    svg g line.dashed {
      stroke-dasharray: 5, 5;
      animation: dash 1s infinite;
    }
    
    svg g line.dotted {
      stroke-dasharray: 2, 2;
      animation: dash 1s infinite;
    }
    
    svg g line.skipped {
      stroke-dasharray: 1, 4;
      animation: dash 1s infinite;
    }
    
    svg g line.labelDivider {
      stroke-width: 2px;
    }
    
    svg g .label {
      stroke: var(--label-border-color);
      fill: var(--label-background-color);
    }
    svg g .labelText {
      fill: var(--label-text-color);
    }
    
    svg g path.actor {
      stroke: var(--primary-color);
      stroke-width: 2;
    }
    
    svg g path.note {
      stroke: var(--quaternary-color);
      fill: var(--tertiary-color);
      stroke-width: 1;
    }
    
    svg g .transparent {
      fill: none;
    }
    
    svg g path.database {
      fill: var(--secondary-color);
      stroke: var(--primary-color);
      stroke-width: 1.5px;
    }</style>`;
  }
}