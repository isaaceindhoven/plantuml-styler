import { Component, OnInit, ViewChild } from '@angular/core'
import * as svg from 'save-svg-as-png'
import { StylingService } from 'src/app/services/styling.service'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2'
import { ZipService } from 'src/app/services/zip.service'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { MatDialog } from '@angular/material'
import { GenerateService } from 'src/app/services/generate.service'
import { ImportExportService } from 'src/app/services/importexport.service'
import { UtilityService } from 'src/app/services/utility.service'
import 'brace';
import 'brace/mode/text';
import 'brace/theme/dawn';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(public generate: GenerateService, private stylingservice: StylingService, private zipservice: ZipService, private impoexpo: ImportExportService, public dialog: MatDialog, private util: UtilityService) { }

  ngOnInit() {
  }
}
