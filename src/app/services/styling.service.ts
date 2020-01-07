import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StylingService {
  constructor(private http: HttpClient) { }
  actorlist: string[] = [];
  oldActorElements: any[] = [];
  image;
  isTheming = false;
  IsaacStyle = [
    '#cccccc',
    '#ffffff',
    '#fbf9eb',
    '#cccccc',
    '#333333',
    '#009ddc',
    '#cccccc',
    '#ffffff',
    '#009ddc',
    '#f5f5f5',
    '#f5f5f5'];
  PlantUMLStyle = [
    '#a80036',
    '#fefece',
    '#fbfb77',
    '#3a3a3a',
    '#000000',
    '#a80036',
    '#a80036',
    '#fefece',
    '#000000',
    '#fefece',
    '#a80036'];
  DeepSeaStyle = [
    '#90c9cc',
    '#a6dee1',
    '#32bdb8',
    '#208f8b',
    '#242424',
    '#737373',
    '#32bdb8',
    '#32bdb8',
    '#ffffff',
    '#a6dee1',
    '#90c9cc'];
  GraytoneStyle = [
    '#bfbcbc',
    '#ffffff',
    '#bfbcbc',
    '#3a3a3a',
    '#484848',
    '#bfbcbc',
    '#bfbcbc',
    '#ffffff',
    '#707070',
    '#ffffff',
    '#bfbcbc'];
  BlackWhiteStyle = [
    '#121212',
    '#ffffff',
    '#ffffff',
    '#121212',
    '#121212',
    '#121212',
    '#121212',
    '#ffffff',
    '#121212',
    '#ffffff',
    '#121212'];
  getTagList(oDOM, type): Element[] {
    return Array.from(oDOM.getElementsByTagName(type));
  }
  setSquiggly(oDOM) {
    Array.from(oDOM.getElementsByClassName('null skipped')).forEach((element: SVGLineElement) => {
      const distance = ((parseFloat(element.getAttribute('y2')) - parseFloat(element.getAttribute('y1'))) / 3);
      const width = 20;
      const ns = 'http://www.w3.org/2000/svg';
      const path = oDOM.createElementNS(ns, 'path');
      const m1 = element.getAttribute('x2');
      const m2 = element.previousElementSibling.getAttribute('y2');
      const l1 = (parseFloat(element.getAttribute('x2')) - width).toString();
      const l2 = (parseFloat(element.previousElementSibling.getAttribute('y2')) + distance).toString();
      const l3 = (parseFloat(element.getAttribute('x2')) + width).toString();
      const l4 = ((parseFloat(l2) + distance)).toString();
      const l5 = element.getAttribute('x2');
      const l6 = ((parseFloat(l4) + distance)).toString();
      path.setAttributeNS(null, 'd', `M${m1} ${m2} L${l1} ${l2} L${l3} ${l4} L${l5} ${l6}`);
      path.setAttributeNS(null, 'class', 'squiggly');
      element.replaceWith(path);
    });
  }
  setMaleActor(oDOM) {
    this.oldActorElements = [];
    Array.from(oDOM.getElementsByClassName('actor transparent')).forEach((element: SVGPathElement) => {
      const ns = 'http://www.w3.org/2000/svg';
      const actor = oDOM.createElementNS(ns, 'svg');
      actor.setAttributeNS(null, 'x', (+(element.previousElementSibling as SVGCircleElement).getAttribute('cx') - (25)).toString());
      const half = parseFloat(element.parentElement.parentElement.style.height) / 2;
      if (parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) > half) {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) - 5).toString()));
      } else {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) + 5).toString()));
      }
      actor.setAttributeNS(null, 'width', '45px');
      actor.setAttributeNS(null, 'height', '45px');
      actor.setAttributeNS(null, 'viewBox', '0 -1 45 45');
      actor.setAttributeNS(null, 'version', '1.1');
      const g = oDOM.createElementNS(ns, 'g');
      g.setAttributeNS(null, 'id', 'surface1');
      const path = oDOM.createElementNS(ns, 'path');
      path.setAttributeNS(null, 'class', 'actorClass');
      path.setAttributeNS(null, 'name', 'participantshape');
      path.setAttributeNS(null, 'd', 'M 44.972656 43.835938 L 43.847656 39.335938 C 43.3125 37.152344 41.695312 35.398438 39.5625 34.6875 L 31.3125 31.9375 C 29.300781 31.101562 28.378906 27.859375 28.179688 26.628906 C 29.714844 25.355469 30.699219 23.542969 30.9375 21.5625 C 30.902344 21.222656 30.984375 20.882812 31.164062 20.597656 C 31.457031 20.523438 31.695312 20.3125 31.808594 20.035156 C 32.347656 18.726562 32.6875 17.347656 32.8125 15.9375 C 32.8125 15.859375 32.804688 15.785156 32.785156 15.710938 C 32.648438 15.164062 32.328125 14.679688 31.875 14.34375 L 31.875 9.375 C 31.875 6.355469 30.953125 5.113281 29.980469 4.398438 C 29.796875 2.941406 28.238281 0 22.5 0 C 17.410156 0.203125 13.328125 4.285156 13.125 9.375 L 13.125 14.34375 C 12.671875 14.679688 12.347656 15.164062 12.214844 15.710938 C 12.195312 15.785156 12.1875 15.859375 12.1875 15.9375 C 12.3125 17.347656 12.652344 18.730469 13.191406 20.035156 C 13.273438 20.300781 13.484375 20.503906 13.753906 20.574219 C 13.859375 20.628906 14.054688 20.898438 14.054688 21.5625 C 14.292969 23.546875 15.285156 25.367188 16.828125 26.640625 C 16.632812 27.867188 15.714844 31.105469 13.761719 31.925781 L 5.4375 34.6875 C 3.304688 35.398438 1.6875 37.152344 1.15625 39.332031 L 0.03125 43.832031 C -0.0976562 44.332031 0.207031 44.84375 0.707031 44.972656 C 0.78125 44.992188 0.859375 45 0.9375 45 L 44.0625 45 C 44.578125 45 45 44.582031 45 44.0625 C 45 43.984375 44.988281 43.910156 44.972656 43.835938 Z M 44.972656 43.835938 ');
      (g as SVGElement).appendChild(path);
      (actor as SVGElement).appendChild(g);
      this.oldActorElements.push(element.previousElementSibling, element);
      (element.parentNode).insertBefore(actor, element.previousElementSibling.previousElementSibling);
      (element.previousElementSibling as SVGCircleElement).replaceWith();
      (element).replaceWith();
    });
  }
  setFemaleActor(oDOM) {
    this.oldActorElements = [];
    Array.from(oDOM.getElementsByClassName('actor transparent')).forEach((element: SVGPathElement) => {
      const ns = 'http://www.w3.org/2000/svg';
      const actor = oDOM.createElementNS(ns, 'svg');
      actor.setAttributeNS(null, 'x', (+(element.previousElementSibling as SVGCircleElement).getAttribute('cx') - (25)).toString());
      const half = parseFloat(element.parentElement.parentElement.style.height) / 2;
      if (parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) > half) {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) - 5).toString()));
      } else {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) + 5).toString()));
      }
      actor.setAttributeNS(null, 'width', '45px');
      actor.setAttributeNS(null, 'height', '45px');
      actor.setAttributeNS(null, 'viewBox', '0 -1 45 45');
      actor.setAttributeNS(null, 'version', '1.1');
      const g = oDOM.createElementNS(ns, 'g');
      g.setAttributeNS(null, 'id', 'surface1');
      const path = oDOM.createElementNS(ns, 'path');
      path.setAttributeNS(null, 'class', 'actorClass');
      path.setAttributeNS(null, 'name', 'participantshape');
      path.setAttributeNS(null, 'd', 'M 36.265625 30.328125 L 29.703125 29.011719 C 29.007812 28.871094 28.5 28.253906 28.5 27.542969 L 28.5 25.828125 C 35.054688 25.207031 36 23.863281 36 22.5 C 36 18.464844 33.316406 9.097656 32.875 7.570312 C 32.820312 5.21875 32.386719 3.890625 31.3125 2.734375 C 30.550781 1.90625 29.429688 1.714844 28.527344 1.5625 C 28.171875 1.5 27.683594 1.417969 27.503906 1.320312 C 25.90625 0.453125 24.324219 0.0351562 22.4375 0 C 18.484375 0.160156 13.628906 2.675781 11.96875 7.273438 C 11.847656 7.699219 9 17.847656 9 22.5 C 9 24.441406 11.195312 25.464844 16.5 25.933594 L 16.5 27.542969 C 16.5 28.253906 15.992188 28.871094 15.292969 29.011719 L 8.738281 30.328125 C 4.546875 31.152344 1.5 34.863281 1.5 39.148438 L 1.5 42 C 1.5 43.652344 2.847656 45 4.5 45 L 40.5 45 C 42.152344 45 43.5 43.652344 43.5 42 L 43.5 39.148438 C 43.5 34.863281 40.453125 31.152344 36.265625 30.328125 Z M 36.265625 30.328125 ');
      (g as SVGElement).appendChild(path);
      (actor as SVGElement).appendChild(g);
      this.oldActorElements.push(element.previousElementSibling, element);
      (element.parentNode).insertBefore(actor, element.previousElementSibling.previousElementSibling);
      (element.previousElementSibling as SVGCircleElement).replaceWith();
      (element).replaceWith();
    });
  }
  setModernActor(oDOM) {
    this.oldActorElements = [];
    Array.from(oDOM.getElementsByClassName('actor transparent')).forEach((element: SVGPathElement) => {
      const ns = 'http://www.w3.org/2000/svg';
      const actor = oDOM.createElementNS(ns, 'svg');
      actor.setAttributeNS(null, 'x', (+(element.previousElementSibling as SVGCircleElement).getAttribute('cx') - (25)).toString());
      const half = parseFloat(element.parentElement.parentElement.style.height) / 2;
      if (parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) > half) {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) - 5).toString()));
      } else {
        actor.setAttributeNS(null, 'y', ((parseFloat((element.previousElementSibling as SVGCircleElement).getAttribute('cy')) + 5).toString()));
      }
      actor.setAttributeNS(null, 'width', '45px');
      actor.setAttributeNS(null, 'height', '45px');
      actor.setAttributeNS(null, 'viewBox', '0 -1 45 45');
      actor.setAttributeNS(null, 'version', '1.1');
      const g = oDOM.createElementNS(ns, 'g');
      g.setAttributeNS(null, 'id', 'surface1');
      const path = oDOM.createElementNS(ns, 'path');
      path.setAttributeNS(null, 'class', 'actorClass');
      path.setAttributeNS(null, 'name', 'participantshape');
      path.setAttributeNS(null, 'd', 'M 38.410156 29.089844 C 35.960938 26.640625 33.042969 24.824219 29.859375 23.726562 C 33.269531 21.378906 35.507812 17.449219 35.507812 13.007812 C 35.507812 5.835938 29.671875 0 22.5 0 C 15.328125 0 9.492188 5.835938 9.492188 13.007812 C 9.492188 17.449219 11.730469 21.378906 15.140625 23.726562 C 11.957031 24.824219 9.039062 26.640625 6.589844 29.089844 C 2.339844 33.339844 0 38.988281 0 45 L 3.515625 45 C 3.515625 34.53125 12.03125 26.015625 22.5 26.015625 C 32.96875 26.015625 41.484375 34.53125 41.484375 45 L 45 45 C 45 38.988281 42.660156 33.339844 38.410156 29.089844 Z M 22.5 22.5 C 17.265625 22.5 13.007812 18.242188 13.007812 13.007812 C 13.007812 7.773438 17.265625 3.515625 22.5 3.515625 C 27.734375 3.515625 31.992188 7.773438 31.992188 13.007812 C 31.992188 18.242188 27.734375 22.5 22.5 22.5 Z M 22.5 22.5 ');
      (g as SVGElement).appendChild(path);
      (actor as SVGElement).appendChild(g);
      this.oldActorElements.push(element.previousElementSibling, element);
      (element.parentNode).insertBefore(actor, element.previousElementSibling.previousElementSibling);
      (element.previousElementSibling as SVGCircleElement).replaceWith();
      (element).replaceWith();
    });
  }
  toImageNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.setImage(oDOM, element, this.image);
      }
    });
  }
  setImage(oDOM, element, img, participant?, second?) {
    if ((element as SVGEllipseElement).nodeName != 'rect') {
      return;
    }
    const ns = 'http://www.w3.org/2000/svg';
    const image = oDOM.createElementNS(ns, 'image');
    image.setAttributeNS(null, 'filter', element.getAttribute('filter'));
    image.setAttributeNS(null, 'width', element.getAttribute('width'));
    image.setAttributeNS(null, 'height', (Number.parseFloat(element.getAttribute('height')) * 1.5).toString());
    image.setAttributeNS(null, 'x', element.getAttribute('x'));
    image.setAttributeNS(null, 'y', (Number.parseFloat(element.getAttribute('y')) * 0.8).toString());
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', img);
    image.setAttributeNS(null, 'style', element.getAttribute('style'));
    image.setAttributeNS(null, 'name', 'participantshape');
    if (participant) {
      if (second) {
        image.setAttributeNS(null, 'y', (Number.parseFloat(element.getAttribute('y'))).toString());
        (participant).splice(2, 1, image);
      } else {
        (participant).splice(0, 1, image);
      }
    }
    element.parentNode.replaceChild(image, element);
  }
  toEllipseNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.setEllipse(oDOM, element);
      }
    });
  }
  setEllipse(oDOM, element, participant?, second?) {
    if ((element as SVGEllipseElement).nodeName != 'rect') {
      return;
    }
    console.log(oDOM, element, participant, second);

    const ns = 'http://www.w3.org/2000/svg';
    const ellipse = oDOM.createElementNS(ns, 'ellipse');
    const rx = (parseFloat(element.getAttribute('width')) / 2);
    const ry = (parseFloat(element.getAttribute('height')) / 2);
    const cx = (parseFloat(element.getAttribute('x')) + rx);
    const cy = (parseFloat(element.getAttribute('y')) + ry);
    ellipse.setAttributeNS(null, 'filter', element.getAttribute('filter'));
    ellipse.setAttributeNS(null, 'rx', rx.toString());
    ellipse.setAttributeNS(null, 'ry', ry.toString());
    ellipse.setAttributeNS(null, 'cx', cx.toString());
    ellipse.setAttributeNS(null, 'cy', cy.toString());
    ellipse.setAttributeNS(null, 'style', element.getAttribute('style'));
    ellipse.setAttributeNS(null, 'name', 'participantshape');
    participant ? second ? (participant).splice(2, 1, ellipse) : (participant).splice(0, 1, ellipse) : null;
    element.parentNode.replaceChild(ellipse, element);
  }
  toCircleNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        this.setCircle(oDOM, element);
      }
    });
  }
  setCircle(oDOM, element, participant?, second?) {
    if ((element as SVGCircleElement).nodeName != 'rect') {
      return;
    }
    const ns = 'http://www.w3.org/2000/svg';
    const circle = oDOM.createElementNS(ns, 'circle');
    const r = ((parseFloat(element.getAttribute('width')) / 2) * 0.9);
    const cx = (parseFloat(element.getAttribute('x')) + (r * 1.12));
    let cy;
    if (parseFloat(element.getAttribute('width')) >= 50) {
      cy = (parseFloat(element.getAttribute('y')) + (r * 0.5));
    } else if (parseFloat(element.getAttribute('width')) >= 100) {
      cy = (parseFloat(element.getAttribute('y')) - (r * 1.5));
    } else if (parseFloat(element.getAttribute('width')) >= 130) {
      cy = (parseFloat(element.getAttribute('y')) - (r * 4));
    } else {
      cy = (parseFloat(element.getAttribute('y')) + (r * 0.8));
    }
    circle.setAttributeNS(null, 'filter', element.getAttribute('filter'));
    circle.setAttributeNS(null, 'r', r.toString());
    circle.setAttributeNS(null, 'cx', cx.toString());
    circle.setAttributeNS(null, 'cy', cy.toString());
    circle.setAttributeNS(null, 'name', 'participantshape');
    circle.setAttributeNS(null, 'style', element.getAttribute('style'));
    participant ? second ? (participant).splice(2, 1, circle) : (participant).splice(0, 1, circle) : null;
    element.parentNode.replaceChild(circle, element);
  }
  setRounded(oDOM, element, participant?, second?) {
    element.setAttribute('rx', 10);
    element.setAttribute('ry', 10);
    participant ? second ? (participant).splice(2, 1, element) : (participant).splice(0, 1, element) : null;
  }
  setRectangle(oDOM, element, participant?, second?) {
    element.setAttribute('rx', 0.5);
    element.setAttribute('ry', 0.5);
    participant ? second ? (participant).splice(2, 1, element) : (participant).splice(0, 1, element) : null;
  }
  removeStyling(oDOM) {
    this.removeStyleFrom(oDOM, 'rect');
    this.removeStyleFrom(oDOM, 'ellipse');
    this.removeStyleFrom(oDOM, 'path');
    this.removeStyleFrom(oDOM, 'line');
    this.removeStyleFrom(oDOM, 'polygon');
    this.removeStyleFrom(oDOM, 'polyline');
    this.removeStyleFrom(oDOM, 'text');
  }
  removeStyleFrom(oDOM, type) {
    this.getTagList(oDOM, type).forEach((element) => {
      if (element.getAttribute('fill') == 'none') {
        if (type == 'path') {
          if ((element as SVGPathElement).getTotalLength().toPrecision(6) == '92.6989') {
            element.setAttribute('class', 'actor');
          }
        }
        element.setAttribute('class', element.getAttribute('class') + ' transparent');
      }
      element.removeAttribute('fill');
      if (element.getAttribute('style')) {
        if (element.getAttribute('style').includes('dasharray: 5.0,5.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' dashed');
        }
        if (element.getAttribute('style').includes('dasharray: 2.0,2.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' dotted');
        }
        if (element.getAttribute('style').includes('dasharray: 1.0,4.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' skipped');
        }
        element.removeAttribute('style');
        element.removeAttribute('font-size');
        element.removeAttribute('font-family');
      }
    });
  }
  setDiagramCardsize() {
    const width = Number.parseFloat((document.getElementById('svgTag') as HTMLElement).style.width.replace('px', ''));
    if (width > 800) {
      document.getElementById('scrollbar2').style.width = '800px';
    }
  }
  removeTextFromParticipants(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if ((element.getAttribute('name') == 'participant')) {
        if (!this.actorlist.includes(element.textContent)) {
          element.setAttribute('display', 'none');
        }
      }
    });
  }
  clearLabels(oDOM) {
    this.getTagList(oDOM, 'circle').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith();
      }
    });
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith();
      }
    });
  }
  addToActors(actor) {
    this.actorlist.push(actor);
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.actorlist = [];
      const x = text.split(' ');
      let actorFound = false;
      x.forEach(word => {
        if (actorFound) {
          this.addToActors(word);
          actorFound = false;
        }
        if (word === 'actor') {
          actorFound = true;
        }
      });
    }
  }
  addColorToStyle(color1, color2, color3, color4, color5, color6, color7, color8, color9, oDOM,
    colorBoxBack,
    colorBoxStroke) {
    if (!oDOM) {
      oDOM = document;
    }
    if (oDOM.getElementById('svgTag')) {
      oDOM.getElementById('svgTag').style.setProperty(`--primary-color`, color1);
      oDOM.getElementById('svgTag').style.setProperty(`--secondary-color`, color2);
      oDOM.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3);
      oDOM.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4);
      oDOM.getElementById('svgTag').style.setProperty(`--text-color`, color5);
      oDOM.getElementById('svgTag').style.setProperty(`--line-color`, color6);
      oDOM.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
      oDOM.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
      oDOM.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);
      oDOM.getElementById('svgTag').style.setProperty(`--box-back-color`, colorBoxBack);
      oDOM.getElementById('svgTag').style.setProperty(`--box-stroke-color`, colorBoxStroke);
    }
    if (document.getElementById('svgTag')) {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, color1);
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, color2);
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3);
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4);
      document.getElementById('svgTag').style.setProperty(`--text-color`, color5);
      document.getElementById('svgTag').style.setProperty(`--line-color`, color6);
      document.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
      document.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
      document.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);
      document.getElementById('svgTag').style.setProperty(`--box-back-color`, colorBoxBack);
      document.getElementById('svgTag').style.setProperty(`--box-stroke-color`, colorBoxStroke);
    }
  }
  setNode(oDOM, type, textImages) {
    switch (type) {
      case 'Circle':
        this.toCircleNode(oDOM);
        break;
      case 'Ellipse':
        this.toEllipseNode(oDOM);
        break;
      case 'Images':
        if (!textImages) {
          this.removeTextFromParticipants(oDOM);
        }
        this.toImageNode(oDOM);
        break;
      default:
        break;
    }
  }
  setActor(oDOM, type) {
    switch (type) {
      case 'Modern':
        this.setModernActor(oDOM);
        break;
      case 'Male':
        this.setMaleActor(oDOM);
        break;
      case 'Female':
        this.setFemaleActor(oDOM);
        break;
      case 'Default':
        break;
      default:
        break;
    }
  }
  getFonts() {
    return this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw');
  }
  prepareError(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      element.setAttribute('style', `fill:${element.getAttribute('fill')}`)
    });
  }
}
