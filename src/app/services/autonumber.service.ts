import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutoNumberService {
  constructor() { }
  getTagList(oDOM, type) {
    return Array.from(oDOM.getElementsByTagName(type));
  }
  setAutonumberDefault(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
        }
      }
    })
  }
  setAutonumberCircular(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let ns = 'http://www.w3.org/2000/svg'
          let circle = document.createElementNS(ns, 'circle');
          let r = (element.getAttribute('textLength').length as unknown as number);
          let fs = (element.getAttribute('font-size') as unknown as number);
          let extra = (fs / 13);
          if (r == 2) {
            extra = (fs / 13) * 5;
          }
          r = (((fs / 13) * 10) + (r * 2));
          let cx = (parseFloat(element.getAttribute('x')) - (fs / 13) + ((r * 0.4) + extra));
          let cy = (parseFloat(element.getAttribute('y')) - 2 + ((fs / 13) * 2) - (r / 2));
          element.setAttribute('y', (parseFloat(element.getAttribute('y')) - 1).toString());
          circle.setAttributeNS(null, 'r', r.toString())
          circle.setAttributeNS(null, 'cx', cx.toString())
          circle.setAttributeNS(null, 'cy', cy.toString())
          circle.setAttributeNS(null, 'name', 'label')
          circle.setAttributeNS(null, 'class', 'label')
          element.parentNode.insertBefore(circle, element)
        }
      }
    })
  }
  setAutonumberRectangular(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let ns = 'http://www.w3.org/2000/svg'
          let rect = document.createElementNS(ns, 'rect');
          let width = (+(element.getAttribute('textLength') as unknown as number) + 8);
          rect.setAttributeNS(null, 'width', width.toString())
          rect.setAttributeNS(null, 'height', '22')
          rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 4).toString())
          rect.setAttributeNS(null, 'y', (+(element.getAttribute('y') as unknown as number) - 16).toString())
          rect.setAttributeNS(null, 'name', 'label')
          rect.setAttributeNS(null, 'class', 'label')
          element.parentNode.insertBefore(rect, element)
        }
      }
    })
  }
  setAutonumberRectangularFramed(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let count = null;
          if (element.nextElementSibling as SVGTextElement) {
            let sibling = element.nextElementSibling;
            let elementNr = (Number.parseFloat(element.getAttribute('textLength')));
            let highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
            count = 1;
            let y = Number.parseFloat(sibling.getAttribute('y'));
            let lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
            let length = Number.parseFloat(sibling.getAttribute('textLength'));
            let italics = 0;
            if (sibling.getAttribute('font-style') == 'italic') {
              italics = 1;
            }
            let nr = 0;
            let temp = 0;
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
            let ns = 'http://www.w3.org/2000/svg'
            let rect = document.createElementNS(ns, 'rect');
            rect.setAttributeNS(null, 'width', (elementNr + highestNr + 20).toString())
            rect.setAttributeNS(null, 'height', (+(count * 15) + 7).toString())
            rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 4).toString())
            rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 16).toString())
            rect.setAttributeNS(null, 'name', 'label')
            rect.setAttributeNS(null, 'class', 'label')
            let line = document.createElementNS(ns, 'line');
            let x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 5).toString();
            line.setAttributeNS(null, 'x1', x);
            line.setAttributeNS(null, 'x2', x);
            line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
            line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
            line.setAttributeNS(null, 'class', 'labelDivider label')
            element.parentNode.insertBefore(rect, element)
            element.parentNode.insertBefore(line, element)
          }
        }
      }
    })
  }
  setAutonumberCircularFramed(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let count = null;
          if (element.nextElementSibling as SVGTextElement) {
            let sibling = element.nextElementSibling;
            let elementNr = (Number.parseFloat(element.getAttribute('textLength')));
            let highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
            count = 1;
            let y = Number.parseFloat(sibling.getAttribute('y'));
            let lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
            let length = Number.parseFloat(sibling.getAttribute('textLength'));
            let italics = 0;
            if (sibling.getAttribute('font-style') == 'italic') {
              italics = 1;
            }
            let nr = 0;
            let temp = 0;
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
            let ns = 'http://www.w3.org/2000/svg'
            let rect = document.createElementNS(ns, 'rect');
            rect.setAttributeNS(null, 'width', (elementNr + highestNr + 20).toString())
            rect.setAttributeNS(null, 'height', (+(count * 15) + 7).toString())
            rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 4).toString())
            rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 16).toString())
            rect.setAttributeNS(null, 'name', 'label')
            rect.setAttributeNS(null, 'class', 'label')
            rect.setAttributeNS(null, 'rx', '15')
            let line = document.createElementNS(ns, 'line');
            let x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 5).toString();
            line.setAttributeNS(null, 'x1', x);
            line.setAttributeNS(null, 'x2', x);
            line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
            line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
            line.setAttributeNS(null, 'class', 'labelDivider')
            line.setAttributeNS(null, 'class', 'labelDivider label')
            element.parentNode.insertBefore(rect, element)
            element.parentNode.insertBefore(line, element)
          }
        }
      }
    })
  }
  setAutonumberRoundedFramed(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let count = null;
          if (element.nextElementSibling as SVGTextElement) {
            let sibling = element.nextElementSibling;
            let elementNr = (Number.parseFloat(element.getAttribute('textLength')));
            let highestNr = (Number.parseFloat(sibling.getAttribute('textLength')));
            count = 1;
            let y = Number.parseFloat(sibling.getAttribute('y'));
            let lengthbase = Number.parseFloat(sibling.getAttribute('textLength'));
            let length = Number.parseFloat(sibling.getAttribute('textLength'));
            let italics = 0;
            if (sibling.getAttribute('font-style') == 'italic') {
              italics = 1;
            }
            let nr = 0;
            let temp = 0;
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
            let ns = 'http://www.w3.org/2000/svg'
            let rect = document.createElementNS(ns, 'rect');
            rect.setAttributeNS(null, 'width', (elementNr + highestNr + 20).toString())
            rect.setAttributeNS(null, 'height', (+(count * 15) + 7).toString())
            rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 4).toString())
            rect.setAttributeNS(null, 'y', (+(sibling.getAttribute('y') as unknown as number) - 16).toString())
            rect.setAttributeNS(null, 'name', 'label')
            rect.setAttributeNS(null, 'class', 'label')
            rect.setAttributeNS(null, 'rx', '3')
            let line = document.createElementNS(ns, 'line');
            let x = (Number.parseFloat(element.getAttribute('x')) + Number.parseFloat(element.getAttribute('textLength')) + 5).toString();
            line.setAttributeNS(null, 'x1', x);
            line.setAttributeNS(null, 'x2', x);
            line.setAttributeNS(null, 'y1', rect.getAttribute('y'));
            line.setAttributeNS(null, 'y2', (Number.parseFloat(rect.getAttribute('y')) + Number.parseFloat(rect.getAttribute('height'))).toString());
            line.setAttributeNS(null, 'class', 'labelDivider label')
            element.parentNode.insertBefore(rect, element)
            element.parentNode.insertBefore(line, element)
          }
        }
      }
    })
  }
  setAutonumberRounded(oDOM) {
    this.getTagList(oDOM, 'text').forEach((element: SVGRectElement) => {
      if (element.previousElementSibling) {
        if (element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'line' && element.innerHTML.length < 3 ||
          element.getAttribute('font-weight') == 'bold' && element.previousElementSibling.nodeName == 'polygon' && element.innerHTML.length < 3) {
          element.setAttribute('class', 'labelText');
          let ns = 'http://www.w3.org/2000/svg'
          let rect = document.createElementNS(ns, 'rect');
          let width = (+(element.getAttribute('textLength') as unknown as number) + 8);
          rect.setAttributeNS(null, 'width', width.toString())
          rect.setAttributeNS(null, 'height', '22')
          rect.setAttributeNS(null, 'x', (+(element.getAttribute('x') as unknown as number) - 4).toString())
          rect.setAttributeNS(null, 'y', (+(element.getAttribute('y') as unknown as number) - 16).toString())
          rect.setAttributeNS(null, 'rx', '3.5')
          rect.setAttributeNS(null, 'ry', '3.5')
          rect.setAttributeNS(null, 'name', 'label')
          rect.setAttributeNS(null, 'class', 'label')
          element.parentNode.insertBefore(rect, element)
        }
      }
    })
  }
}