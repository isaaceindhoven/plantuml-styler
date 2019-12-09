import { Component, OnInit, ViewChild } from '@angular/core'
import { GenerateService } from 'src/app/services/generate.service'
import 'brace';
import 'brace/mode/text';
import 'brace/theme/dawn';
import { AceConfigInterface } from 'ngx-ace-wrapper/dist/lib/ace.interfaces';
import { AceComponent } from 'ngx-ace-wrapper';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

  @ViewChild('aceComp', { static: true }) aceElement: AceComponent;
  constructor(public generate: GenerateService, public util: UtilityService) { }
  openText: boolean;
  public config: AceConfigInterface = {
    mode: 'text',
    theme: 'dawn',
    readOnly: false
  };
  ngOnInit() {
   this.util.textarea = this.aceElement.directiveRef;
  }

}
