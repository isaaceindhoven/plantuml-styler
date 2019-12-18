import { Component, OnInit } from '@angular/core';
import { GenerateService } from 'src/app/services/generate.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

  constructor(public generate: GenerateService) { }

  ngOnInit() {
    window.addEventListener('dragover', e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener('drop', e => {
      e && e.preventDefault();
    }, false);
  }


}
