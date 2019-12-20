import { Component, OnInit, ViewChild } from '@angular/core';
import { GenerateService } from 'src/app/services/generate.service';
import 'brace';
import 'brace/mode/text';
import 'brace/theme/dawn';
import { AceConfigInterface } from 'ngx-ace-wrapper/dist/lib/ace.interfaces';
import { AceComponent } from 'ngx-ace-wrapper';
import { UtilityService } from 'src/app/services/utility.service';
import { ZipService } from 'src/app/services/zip.service';
import { ImportExportService } from 'src/app/services/importexport.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

  @ViewChild('aceComp', { static: true }) aceElement: AceComponent;
  constructor(public generate: GenerateService, private zipservice: ZipService, private impoexpo: ImportExportService, public util: UtilityService) { }
  openText: boolean;
  public config: AceConfigInterface = {
    mode: 'text',
    theme: 'dawn',
    readOnly: false
  };
  ngOnInit() {
    this.util.textarea = this.aceElement.directiveRef;
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

}
