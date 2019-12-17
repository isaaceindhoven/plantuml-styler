import { Component, OnInit, ViewChild } from '@angular/core'
import { StylingService } from 'src/app/services/styling.service'
import { ZipService } from 'src/app/services/zip.service'
import { MatDialog } from '@angular/material'
import { GenerateService } from 'src/app/services/generate.service'
import { ImportExportService } from 'src/app/services/importexport.service'
import { UtilityService } from 'src/app/services/utility.service'


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, public util: UtilityService) { }

  ngOnInit() {
  }

  close(){
    this.util.openEditor = false;
    setTimeout(() => {
      this.util.calcHeight();
      this.util.resizeAce();
    });
  }
}
