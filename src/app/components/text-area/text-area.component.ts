import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenerateService } from 'src/app/services/generate.service';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, public generate: GenerateService) {}

  ngOnInit() {
    document.getElementById('tA').innerText = this.generate.text
  }

}
