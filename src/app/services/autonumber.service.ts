import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AutoNumberService {
  constructor(private data: DataService) { }
  setAutonumberCircular() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var ns = 'http://www.w3.org/2000/svg'
        var circle = document.createElementNS(ns, 'circle');
        var r = (element.getAttribute('textLength').length as unknown as number);
        var extra = 1;
        if (r == 2) {
          extra = 5;
        }
        r = (6 + (r * 2));
        var cx = (+(element.getAttribute('x') as unknown as number) + ((r * 0.4) + extra));
        var cy = (+(element.getAttribute('y') as unknown as number) - (r / 2));
        circle.setAttributeNS(null, 'r', r.toString())
        circle.setAttributeNS(null, 'cx', cx.toString())
        circle.setAttributeNS(null, 'cy', cy.toString())
        circle.setAttributeNS(null, 'name', 'label')
        element.parentNode.insertBefore(circle, element)
      }
    })
  }
  setAutonumberRectangular() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var ns = 'http://www.w3.org/2000/svg'
        var rect = document.createElementNS(ns, 'rect');
        var width = (+(element.getAttribute('textLength') as unknown as number) + 2);
        rect.setAttributeNS(null, 'width', width.toString())
        rect.setAttributeNS(null, 'height', '18')
        rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 1).toString())
        rect.setAttributeNS(null, 'y', (+(element.getAttribute('y') as unknown as number) - 14).toString())
        rect.setAttributeNS(null, 'name', 'label')
        element.parentNode.insertBefore(rect, element)
      }
    })
  }
  setAutonumberRectangularFramed() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var count = null;
        if (element.nextElementSibling as SVGTextElement) {
          var sibling = element.nextElementSibling;
          var elementNr = (Number.parseFloat(element.getAttribute('textLength')));
          var highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
          count = 1;
          var y = Number.parseFloat(sibling.getAttribute('y'));
          var lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
          var length = Number.parseFloat(sibling.getAttribute('textLength'));
          var italics = 0;
          if (sibling.getAttribute('font-style') == 'italic') {
            italics = 1;
          }
          var nr = 0;
          var temp = 0;
          while (sibling.nextElementSibling) {
            if (sibling.nextElementSibling.nodeName == 'text') {
              sibling = (sibling.nextElementSibling as SVGTextElement);
              nr = (Number.parseFloat((sibling as SVGTextElement).getAttribute('textLength')));
              if (y.toPrecision(6) == Number.parseFloat(sibling.getAttribute('y')).toPrecision(6)) {
                lengthbase = length;
                temp = nr + temp;
              } else if (y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1328).toPrecision(6) || y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1329).toPrecision(6)) {
                lengthbase = length;
                count++;
                temp = 0;
              }
              else {
                temp = 0;
              }
              if (sibling.getAttribute('font-style') == 'italic') {
                italics++;
              }
              y = Number.parseFloat(sibling.getAttribute('y'));
              length = Number.parseFloat(sibling.getAttribute('textLength'));
              if (nr > highestNr) {
                highestNr = nr;
              }
              if ((temp + lengthbase) > highestNr) {
                highestNr = (temp + lengthbase);
              }
            } else if (sibling.nextElementSibling.nodeName == 'ellipse') {
              elementNr = (Number.parseFloat(element.getAttribute('textLength')) + 5);
              sibling = (sibling.nextElementSibling as SVGTextElement);
            }
            else {
              break;
            }
          }
          if (italics > 0) {
            elementNr = elementNr + (8 * italics);
          }
          sibling = element.nextElementSibling;
          var ns = 'http://www.w3.org/2000/svg'
          var rect = document.createElementNS(ns, 'rect');
          rect.setAttributeNS(null, 'width', (elementNr + highestNr + 9).toString())
          rect.setAttributeNS(null, 'height', (+(count * 15) + 3).toString())
          rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 1).toString())
          rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 14).toString())
          rect.setAttributeNS(null, 'name', 'label')

          var ns = 'http://www.w3.org/2000/svg'
          var line = document.createElementNS(ns, 'line');
          var x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 1).toString();
          line.setAttributeNS(null, 'x1', x);
          line.setAttributeNS(null, 'x2', x);
          line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
          line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
          line.setAttributeNS(null, 'class', 'labelDivider')

          element.parentNode.insertBefore(rect, element)
          element.parentNode.insertBefore(line, element)
        }
      }
    })
  }
  setAutonumberCircularFramed() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var count = null;
        if (element.nextElementSibling as SVGTextElement) {
          var sibling = element.nextElementSibling;
          var elementNr = (Number.parseFloat(element.getAttribute('textLength')));
          var highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
          count = 1;
          var y = Number.parseFloat(sibling.getAttribute('y'));
          var lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
          var length = Number.parseFloat(sibling.getAttribute('textLength'));
          var italics = 0;
          if (sibling.getAttribute('font-style') == 'italic') {
            italics = 1;
          }
          var nr = 0;
          var temp = 0;
          while (sibling.nextElementSibling) {
            if (sibling.nextElementSibling.nodeName == 'text') {
              sibling = (sibling.nextElementSibling as SVGTextElement);
              nr = (Number.parseFloat((sibling as SVGTextElement).getAttribute('textLength')));
              if (y.toPrecision(6) == Number.parseFloat(sibling.getAttribute('y')).toPrecision(6)) {
                lengthbase = length;
                temp = nr + temp;
              } else if (y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1328).toPrecision(6) || y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1329).toPrecision(6)) {
                lengthbase = length;
                count++;
                temp = 0;
              }
              else {
                temp = 0;
              }
              if (sibling.getAttribute('font-style') == 'italic') {
                italics++;
              }
              y = Number.parseFloat(sibling.getAttribute('y'));
              length = Number.parseFloat(sibling.getAttribute('textLength'));
              if (nr > highestNr) {
                highestNr = nr;
              }
              if ((temp + lengthbase) > highestNr) {
                highestNr = (temp + lengthbase);
              }
            } else if (sibling.nextElementSibling.nodeName == 'ellipse') {
              elementNr = (Number.parseFloat(element.getAttribute('textLength')) + 5);
              sibling = (sibling.nextElementSibling as SVGTextElement);
            }
            else {
              break;
            }
          }
          if (italics > 0) {
            elementNr = elementNr + (8 * italics);
          }

          sibling = element.nextElementSibling;
          var ns = 'http://www.w3.org/2000/svg'
          var rect = document.createElementNS(ns, 'rect');
          rect.setAttributeNS(null, 'width', (elementNr + highestNr + 9).toString())
          rect.setAttributeNS(null, 'height', (+(count * 15) + 3).toString())
          rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 1).toString())
          rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 14).toString())
          rect.setAttributeNS(null, 'name', 'label')
          rect.setAttributeNS(null, 'rx', '15')

          var ns = 'http://www.w3.org/2000/svg'
          var line = document.createElementNS(ns, 'line');
          var x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 1).toString();
          line.setAttributeNS(null, 'x1', x);
          line.setAttributeNS(null, 'x2', x);
          line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
          line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
          line.setAttributeNS(null, 'class', 'labelDivider')

          element.parentNode.insertBefore(rect, element)
          element.parentNode.insertBefore(line, element)
        }
      }
    })
  }
  setAutonumberRoundedFramed() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var count = null;
        if (element.nextElementSibling as SVGTextElement) {
          var sibling = element.nextElementSibling;
          var elementNr = (Number.parseFloat(element.getAttribute('textLength')));
          var highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
          count = 1;
          var y = Number.parseFloat(sibling.getAttribute('y'));
          var lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
          var length = Number.parseFloat(sibling.getAttribute('textLength'));
          var italics = 0;
          if (sibling.getAttribute('font-style') == 'italic') {
            italics = 1;
          }
          var nr = 0;
          var temp = 0;
          while (sibling.nextElementSibling) {
            if (sibling.nextElementSibling.nodeName == 'text') {
              sibling = (sibling.nextElementSibling as SVGTextElement);
              nr = (Number.parseFloat((sibling as SVGTextElement).getAttribute('textLength')));
              if (y.toPrecision(6) == Number.parseFloat(sibling.getAttribute('y')).toPrecision(6)) {
                lengthbase = length;
                temp = nr + temp;
              } else if (y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1328).toPrecision(6) || y.toPrecision(6) == (Number.parseFloat(sibling.getAttribute('y')) - 15.1329).toPrecision(6)) {
                lengthbase = length;
                count++;
                temp = 0;
              }
              else {
                temp = 0;
              }
              if (sibling.getAttribute('font-style') == 'italic') {
                italics++;
              }
              y = Number.parseFloat(sibling.getAttribute('y'));
              length = Number.parseFloat(sibling.getAttribute('textLength'));
              if (nr > highestNr) {
                highestNr = nr;
              }
              if ((temp + lengthbase) > highestNr) {
                highestNr = (temp + lengthbase);
              }
            } else if (sibling.nextElementSibling.nodeName == 'ellipse') {
              elementNr = (Number.parseFloat(element.getAttribute('textLength')) + 5);
              sibling = (sibling.nextElementSibling as SVGTextElement);
            }
            else {
              break;
            }
          }
          if (italics > 0) {
            elementNr = elementNr + (8 * italics);
          }
          sibling = element.nextElementSibling;
          var ns = 'http://www.w3.org/2000/svg'
          var rect = document.createElementNS(ns, 'rect');
          rect.setAttributeNS(null, 'width', (elementNr + highestNr + 9).toString())
          rect.setAttributeNS(null, 'height', (+(count * 15) + 3).toString())
          rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 1).toString())
          rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 14).toString())
          rect.setAttributeNS(null, 'name', 'label')
          rect.setAttributeNS(null, 'rx', '3')

          var ns = 'http://www.w3.org/2000/svg'
          var line = document.createElementNS(ns, 'line');
          var x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 1).toString();
          line.setAttributeNS(null, 'x1', x);
          line.setAttributeNS(null, 'x2', x);
          line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
          line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
          line.setAttributeNS(null, 'class', 'labelDivider')

          element.parentNode.insertBefore(rect, element)
          element.parentNode.insertBefore(line, element)
        }
      }
    })
  }
  setAutonumberRounded() {
    this.data.getTagList('text').forEach((element: SVGRectElement) => {
      if (element.getAttribute('font-weight') == 'bold' && element.getAttribute('font-size') != '14') {
        var ns = 'http://www.w3.org/2000/svg'
        var rect = document.createElementNS(ns, 'rect');
        var width = (+(element.getAttribute('textLength') as unknown as number) + 2);
        rect.setAttributeNS(null, 'width', width.toString())
        rect.setAttributeNS(null, 'height', '18')
        rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 1).toString())
        rect.setAttributeNS(null, 'y', (+(element.getAttribute('y') as unknown as number) - 14).toString())
        rect.setAttributeNS(null, 'rx', '3.5')
        rect.setAttributeNS(null, 'ry', '3.5')
        rect.setAttributeNS(null, 'name', 'label')
        element.parentNode.insertBefore(rect, element)
      }
    })
  }
  clearLabels() {
    this.data.getTagList('circle').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
    this.data.getTagList('rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('name') == 'label') {
        element.replaceWith()
      }
    })
  }
}