import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }
  diagram;
  text;
  openEditor = true;
  textarea;
  pageX;
  encode64(data) {
    let r = '';
    for (let i = 0; i < data.length; i += 3) {
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
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3F;
    let r = '';
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
  resizeAce() {
    if (this.textarea)
      this.textarea.ace().resize(true);
  }
  calcHeight() {
    this.diagram.style.setProperty(`--comp-height`, `${window.innerHeight - document.getElementById('nav').clientHeight}px`);
    this.text.style.setProperty(`--comp-height`, `${window.innerHeight - document.getElementById('nav').clientHeight}px`);
  }
  setWidth(){
    this.diagram.style.setProperty(`--comp-width`, `${this.openEditor ? window.innerWidth - this.pageX - 400 : window.innerWidth - this.pageX}px`);
    this.text.style.setProperty(`--comp-width`, `${this.pageX}px`);

  }
  calcWidth(pageX) {
    this.diagram.style.setProperty(`--comp-width`, `${this.openEditor ? window.innerWidth - pageX - 400 : window.innerWidth - pageX}px`);
    this.text.style.setProperty(`--comp-width`, `${pageX}px`);
  }
  getSVGStyle() {
    return `<style>

    svg g ellipse,
    svg g circle,
    svg g rect {
      stroke: var(--primary-color);
      stroke-width: var(--participant-stroke-width);
      /* fill: url(#image); */
      fill: var(--secondary-color);
      stroke-dasharray: 7500;
      animation: draw 5s linear;
    }

    svg g path {
      fill: var(--tertiary-color);
      stroke: var(--quaternary-color);
      stroke-width: 1.5;
      stroke-dasharray: 7500;
      animation: draw 5s linear;
    }

    svg g polygon {
      fill: var(--line-color);
      stroke-dasharray: 7500;
      animation: draw 5s linear;
    }

    svg g line,
    svg g polyline {
      stroke: var(--line-color);
      stroke-width: var(--border-thickness);
      stroke-dasharray: 7500;
      animation: draw 5s linear;
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
      font-size: 12;
    }
    svg g polygon.note {
      stroke: var(--quaternary-color);
      fill: var(--tertiary-color);
      stroke-width: 1;
      font-size: 12;
    }

    svg g .transparent {
      fill: none;
    }

    svg g path.database {
      fill: var(--secondary-color);
      stroke: var(--primary-color);
      stroke-width: 1.5px;
    }

    svg g path.squiggly {
      fill: none !important;
      stroke: var(--line-color) !important;
    }

    svg g rect.box {
      fill: var(--box-back-color);
      stroke: var(--box-stroke-color);
    }
    svg g rect.titleBox {
      fill: none;
      stroke: white;
      stroke-width: 5;

    }
    svg g line.divider {
      stroke: var(--primary-color);
      stroke-width: 3.5;
    }
    svg g line.altDivider {
      stroke: var(--primary-color);
      stroke-dasharray: 2, 2;
    }


    svg g path.alt {
      fill: var(--primary-color);
      stroke: var(--primary-color);
    }

    svg g path.actorClass {
      fill: var(--primary-color);
      stroke: var(--primary-color);
    }

    </style>
    `;
  }
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
