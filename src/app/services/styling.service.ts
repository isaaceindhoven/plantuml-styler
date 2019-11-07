import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StylingService {
  constructor( private http: HttpClient) { }
  actorlist: string[] = [];
  oldActorElements: any[] = [];
  image;
  getTagList(type) {
    return Array.from(document.getElementsByTagName(type));
  }
  setSquiggly() {
    Array.from(document.getElementsByClassName('null skipped')).forEach((element: SVGLineElement) => {
      var distance = ((+(element.getAttribute('y2') as unknown as number) - (element.getAttribute('y1') as unknown as number)) / 3);
      var width = 20;
      var ns = 'http://www.w3.org/2000/svg'
      var line1 = document.createElementNS(ns, 'line');
      line1.setAttributeNS(null, 'x1', element.getAttribute('x2'));
      line1.setAttributeNS(null, 'x2', (+(element.getAttribute('x2') as unknown as number) - width).toString());
      line1.setAttributeNS(null, 'y1', element.previousElementSibling.getAttribute('y2'));
      line1.setAttributeNS(null, 'y2', (+(element.previousElementSibling.getAttribute('y2') as unknown as number) + distance).toString());

      var line2 = document.createElementNS(ns, 'line');
      line2.setAttributeNS(null, 'x1', (+(element.getAttribute('x2') as unknown as number) - width).toString());
      line2.setAttributeNS(null, 'x2', (+(element.getAttribute('x2') as unknown as number) + width).toString());
      line2.setAttributeNS(null, 'y1', line1.getAttribute('y2'));
      line2.setAttributeNS(null, 'y2', (+(line1.getAttribute('y2') as unknown as number) + distance).toString());

      var line3 = document.createElementNS(ns, 'line');
      line3.setAttributeNS(null, 'x1', (+(element.getAttribute('x2') as unknown as number) + width).toString());
      line3.setAttributeNS(null, 'x2', element.getAttribute('x2'));
      line3.setAttributeNS(null, 'y1', line2.getAttribute('y2'));
      line3.setAttributeNS(null, 'y2', (+(line2.getAttribute('y2') as unknown as number) + distance).toString());

      element.parentNode.insertBefore(line1, element);
      element.parentNode.insertBefore(line2, element);
      element.replaceWith(line3);
    })
  }
  setNewActor() {
    this.oldActorElements = [];
    Array.from(document.getElementsByClassName('actor transparent')).forEach((element: SVGPathElement) => {
      var ns = 'http://www.w3.org/2000/svg'
      var image = document.createElementNS(ns, 'image');
      image.setAttributeNS(null, 'filter', element.getAttribute('filter'))
      image.setAttributeNS(null, 'width', '45')
      image.setAttributeNS(null, 'height', '45')
      image.setAttributeNS(null, 'x', (+(element.previousSibling as SVGCircleElement).getAttribute('cx') - (25)).toString())
      image.setAttributeNS(null, 'y', (element.previousSibling as SVGCircleElement).getAttribute('cy'));
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'assets/customer.png');
      this.oldActorElements.push(element.previousSibling, element);
      (element.previousSibling as SVGCircleElement).replaceWith();
      element.replaceWith(image)
    })
  }
  toImageNode() {
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var image = document.createElementNS(ns, 'image');
        image.setAttributeNS(null, 'filter', element.getAttribute('filter'))
        image.setAttributeNS(null, 'width', element.getAttribute('width'))
        image.setAttributeNS(null, 'height', element.getAttribute('height'))
        image.setAttributeNS(null, 'x', element.getAttribute('x'))
        image.setAttributeNS(null, 'y', element.getAttribute('y'))
        image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.image)
        element.parentNode.replaceChild(image, element);
      }
    });
  }
  toEllipseNode() {
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var ellipse = document.createElementNS(ns, 'ellipse');
        var rx = ((element.getAttribute('width') as unknown as number) / 2);
        var ry = ((element.getAttribute('height') as unknown as number) / 2);
        var cx = (+(element.getAttribute('x') as unknown as number) + rx);
        var cy = (+(element.getAttribute('y') as unknown as number) + ry);
        ellipse.setAttributeNS(null, 'filter', element.getAttribute('filter'))
        ellipse.setAttributeNS(null, 'rx', rx.toString())
        ellipse.setAttributeNS(null, 'ry', ry.toString())
        ellipse.setAttributeNS(null, 'cx', cx.toString())
        ellipse.setAttributeNS(null, 'cy', cy.toString())
        element.parentNode.replaceChild(ellipse, element);
      }
    });
  }
  toCircleNode() {
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var circle = document.createElementNS(ns, 'circle');
        var r = (((element.getAttribute('width') as unknown as number) / 2) * 0.9);
        var cx = (+(element.getAttribute('x') as unknown as number) + (r * 1.12));
        var cy;
        if ((element.getAttribute('width') as unknown as number) >= 50) {
          cy = (+(element.getAttribute('y') as unknown as number) + (r * 0.5));
        } else if ((element.getAttribute('width') as unknown as number) >= 100) {
          cy = (+(element.getAttribute('y') as unknown as number) - (r * 1.5));
        } else if ((element.getAttribute('width') as unknown as number) >= 130) {
          cy = (+(element.getAttribute('y') as unknown as number) - (r * 4));
        } else {
          cy = (+(element.getAttribute('y') as unknown as number) + (r * 0.8));
        }
        circle.setAttributeNS(null, 'filter', element.getAttribute('filter'))
        circle.setAttributeNS(null, 'r', r.toString())
        circle.setAttributeNS(null, 'cx', cx.toString())
        circle.setAttributeNS(null, 'cy', cy.toString())
        element.parentNode.replaceChild(circle, element);
      }
    });
  }
  removeStyling() {
    this.removeStyleFrom('rect');
    this.removeStyleFrom('ellipse');
    this.removeStyleFrom('path');
    this.removeStyleFrom('line');
    this.removeStyleFrom('polygon');
    this.removeStyleFrom('polyline');
    this.removeStyleFrom('text');
  }
  removeStyleFrom(type) {
    this.getTagList(type).forEach(element => {
      if (element.getAttribute('fill') == 'none') {
        if (type == 'path' && element.previousSibling)
          element.setAttribute('class', 'actor')
        element.setAttribute('class', element.getAttribute('class') + ' transparent')
      }
      element.removeAttribute('fill');
      if (element.getAttribute('style')) {
        if (element.getAttribute('style').includes('dasharray: 5.0,5.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' dashed')
        }
        if (element.getAttribute('style').includes('dasharray: 2.0,2.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' dotted')
        }
        if (element.getAttribute('style').includes('dasharray: 1.0,4.0')) {
          element.setAttribute('class', element.getAttribute('class') + ' skipped')
        }
        element.removeAttribute('style');
        element.removeAttribute('font-size');
        element.removeAttribute('font-family');
      }
    });
  }
  findNamesInText() {
    var last;
    this.getTagList('text').forEach((element: SVGRectElement) => {
      if (last) {
        if (element.textContent == last.textContent) {
          element.setAttribute('name', 'participant');
          last.setAttribute('name', 'participant');
        }
        else {
          last = element;
        }
      } else {
        last = element;
      }
    });
  }
  removeTextFromParticipants() {
    this.getTagList('text').forEach((element: SVGRectElement) => {
      if ((element.getAttribute('name') == 'participant')) {
        if (!this.actorlist.includes(element.textContent)) {
          element.setAttribute('display', 'none');
        }
      }
    });
  }
  clearLabels() {
    this.getTagList('circle').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
    this.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
  }
  addToActors(actor) {
    this.actorlist.push(actor);
  }
  getActors(text: string) {
    if (text.includes('actor')) {
      this.actorlist = [];
      var newtext = text.split('actor ')[1];
      if (newtext) {
        var actor = (newtext.split('\n')[0]).trim();
        newtext = text.replace(`actor ${actor}`, '')
        this.addToActors(actor)
      } else {
        newtext = text.split('actor')[1];
      }
      while (newtext.includes('actor')) {
        var newer = newtext;
        var newtext2 = newtext.split('actor ')[1];
        if (newtext2) {
          var actor = (newtext2.split('\n')[0]).trim();
          newtext = newer.replace(`actor ${actor}`, '')
          this.addToActors(actor)
        } else {
          newtext = newtext.split('actor')[1];
        }
      }
    }
  }
  addColorToStyle(color1, color2, color3, color4, color5, color6, color7, color8, color9) {
    document.getElementById('svgTag').style.setProperty(`--primary-color`, color1)
    document.getElementById('svgTag').style.setProperty(`--secondary-color`, color2)
    document.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3)
    document.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4)
    document.getElementById('svgTag').style.setProperty(`--text-color`, color5);
    document.getElementById('svgTag').style.setProperty(`--line-color`, color6);
    document.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
    document.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
    document.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);

  }
  setNode(type, textImages) {
    switch (type) {
      case "Circle":
        this.toCircleNode();
        break;
      case "Ellipse":
        this.toEllipseNode();
        break;
      case "Images":
        this.toImageNode();
        if (!textImages)
          this.removeTextFromParticipants()
        break;
      default:
        break;
    }
  }
  getFonts() {
    return this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw');
  }
}