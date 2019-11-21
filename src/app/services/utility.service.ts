import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  encode64(data) {
    var r = "";
    for (var i = 0; i < data.length; i += 3) {
      if (i + 2 == data.length) {
        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
      } else if (i + 1 == data.length) {
        r += this.append3bytes(data.charCodeAt(i), 0, 0);
      } else {
        r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1),
          data.charCodeAt(i + 2));
      }
    }
    return r;
  }
  append3bytes(b1, b2, b3) {
    var c1 = b1 >> 2;
    var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    var c4 = b3 & 0x3F;
    var r = "";
    r += this.encode6bit(c1 & 0x3F);
    r += this.encode6bit(c2 & 0x3F);
    r += this.encode6bit(c3 & 0x3F);
    r += this.encode6bit(c4 & 0x3F);
    return r;
  }
  encode6bit(b) {
    if (b < 10) {
      return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
      return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
      return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b == 0) {
      return '-';
    }
    if (b == 1) {
      return '_';
    }
    return '?';
  }
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
  getTagList(type) {
    return Array.from(document.getElementsByTagName(type));
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
    }

    svg g rect.box {
      fill: var(--box-back-color);
      stroke: var(--box-stroke-color);
    }

    svg g .participant1 {
      stroke: var(--participant1-border-color)!important;
      fill: var(--participant1-background-color)!important;
    }
    svg g .participant2 {
      stroke: var(--participant2-border-color)!important;
      fill: var(--participant2-background-color)!important;
    }
    svg g .participant3 {
      stroke: var(--participant3-border-color)!important;
      fill: var(--participant3-background-color)!important;
    }
    svg g .participant4 {
      stroke: var(--participant4-border-color)!important;
      fill: var(--participant4-background-color)!important;
    }
    svg g .participant5 {
      stroke: var(--participant5-border-color)!important;
      fill: var(--participant5-background-color)!important;
    }
    svg g .participant6 {
      stroke: var(--participant6-border-color)!important;
      fill: var(--participant6-background-color)!important;
    }
    svg g .participant7 {
      stroke: var(--participant7-border-color)!important;
      fill: var(--participant7-background-color)!important;
    }
    svg g .participant8 {
      stroke: var(--participant8-border-color)!important;
      fill: var(--participant8-background-color)!important;
    }
    svg g .participant9 {
      stroke: var(--participant9-border-color)!important;
      fill: var(--participant9-background-color)!important;
    }</style>
    `;
  }
}