import { Component } from '@angular/core';
import { UtilityService } from './services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public util: UtilityService) { }
  title = 'plantUml';
  resizableArea;
  text;
  diagram;
  nav;
  mousemove;
  hide;
  ngOnInit() {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
    this.resizableArea = document.getElementById('resizableTextarea');
    this.util.diagram = document.getElementById('diagram');
    this.util.text = document.getElementById('text');
    this.nav = document.getElementById('nav');
    this.util.diagram.style.setProperty(`--comp-height`, '900px');
    this.util.text.style.setProperty(`--comp-height`, '880px');
    this.mousemove = (event) => this.onMouseMove(event);
  }
  getStartPoint(event) {
    this.moveAt(event.pageX);
    document.addEventListener('mousemove', this.mousemove);
  }
  getEndPoint() {
    document.removeEventListener('mousemove', this.mousemove);
  }
  moveAt(pageX) {
    this.resizableArea.style.width = `${pageX}px`;
    this.util.calcWidth(pageX);
  }
  onMouseMove(event) {
    this.moveAt(event.pageX);
  }
 
}
