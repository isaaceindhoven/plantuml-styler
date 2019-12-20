import { Component, OnInit, ViewChild } from '@angular/core';
import { StylingService } from 'src/app/services/styling.service';
import { ZipService } from 'src/app/services/zip.service';
import { MatDialog } from '@angular/material';
import { GenerateService } from 'src/app/services/generate.service';
import { ImportExportService } from 'src/app/services/importexport.service';
import { UtilityService } from 'src/app/services/utility.service';


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

  close() {
    this.util.openEditor = false;
    setTimeout(() => {
      this.util.calcHeight();
      this.util.resizeAce();
    });
  }
}
