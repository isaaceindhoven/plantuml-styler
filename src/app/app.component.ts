import { Component } from '@angular/core';
import { UtilityService } from './services/utility.service';
import Swal from 'sweetalert2';
import { generate } from 'rxjs';
import { GenerateService } from './services/generate.service';
import { ImportExportService } from './services/importexport.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public util: UtilityService, public gen: GenerateService, private impoexpo: ImportExportService) { }
  title = 'plantUml';
  resizableArea;
  text;
  diagram;
  nav;
  mousemove;
  hide;
  ngOnInit() {
    window.addEventListener('load', e => {
      console.log("loading previous");
      this.gen.text = localStorage.getItem('code');
      this.impoexpo.loadStyle(localStorage.getItem('style'));
      setTimeout(() => {
        this.gen.generateSVG(this.gen.text)
      }, );
    })
    window.addEventListener('dragover', e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener('drop', e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener('resize', e => {
      this.util.calcWidth(this.util.pageX);
    });
    window.addEventListener('beforeunload', e => {
      this.beforePageClose();
    });


    let disableConfirmation = false;
    window.addEventListener('beforeunload', event => {
      const confirmationText = 'Are you sure?';
      if (!disableConfirmation) {
        event.returnValue = confirmationText; // Gecko, Trident, Chrome 34+
        return confirmationText;              // Gecko, WebKit, Chrome <34
      } else {
        // Set flag back to false, just in case
        // user stops loading page after clicking a link.
        disableConfirmation = false;
      }
    });




    this.resizableArea = document.getElementById('resizableTextarea');
    this.util.diagram = document.getElementById('diagram');
    this.util.text = document.getElementById('text');
    this.nav = document.getElementById('nav');
    this.util.diagram.style.setProperty(`--comp-height`, '900px');
    this.util.text.style.setProperty(`--comp-height`, '880px');
    this.mousemove = (event) => this.onMouseMove(event);
    this.util.calcHeight();
  }
  getStartPoint(event) {
    this.moveAt(event.pageX);
    document.addEventListener('mousemove', this.mousemove);
  }
  getEndPoint() {
    document.removeEventListener('mousemove', this.mousemove);
  }
  moveAt(pageX) {
    pageX <= 400 ? pageX = 400 : null;
    this.util.openEditor ? pageX > window.innerWidth - 400 ? pageX = window.innerWidth - 450 : null : null;
    this.util.pageX = pageX
    this.resizableArea.style.width = `${pageX}px`;
    this.util.calcWidth(pageX);
  }
  onMouseMove(event) {
    this.moveAt(event.pageX);
  }
  getHalf() {
    return this.util.diagram.style.height / 2;
  }

  beforePageClose() {
    localStorage.setItem('code', this.gen.text);
    localStorage.setItem('style', this.impoexpo.saveConfig(true));
  }

}
