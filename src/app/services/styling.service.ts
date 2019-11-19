import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StylingService {
  constructor(private http: HttpClient) { }
  actorlist: string[] = [];
  oldActorElements: any[] = [];
  image;
  PlantUMLStyle = [
    '#a80036',
    '#fefece',
    '#fbfb77',
    '#3a3a3a',
    '#000000',
    '#a80036',
    '#a80036',
    '#fefece',
    '#000000',];
  IsaacStyle = [
    '#cbc7c7',
    '#ffffff',
    '#f0eded',
    '#cbc7c7',
    '#737070',
    '#009ddc',
    '#cbc7c7',
    '#ffffff',
    '#009ddc',];
  JohanStyle = [
    '#90c9cc',
    '#a6dee1',
    '#32bdb8',
    '#208f8b',
    '#242424',
    '#737373',
    '#32bdb8',
    '#32bdb8',
    '#ffffff',];
  GraytoneStyle = [
    '#bfbcbc',
    '#ffffff',
    '#bfbcbc',
    '#3a3a3a',
    '#484848',
    '#bfbcbc',
    '#bfbcbc',
    '#ffffff',
    '#707070',];
  BlackWhiteStyle = [
    '#121212',
    '#ffffff',
    '#ffffff',
    '#121212',
    '#121212',
    '#121212',
    '#121212',
    '#ffffff',
    '#121212',];
  getTagList(oDOM, type): Element[] {
    return Array.from(oDOM.getElementsByTagName(type));
  }
  setSquiggly(oDOM) {
    Array.from(oDOM.getElementsByClassName('null skipped')).forEach((element: SVGLineElement) => {
      var distance = ((parseFloat(element.getAttribute('y2')) - parseFloat(element.getAttribute('y1'))) / 3);
      var width = 20;
      var ns = 'http://www.w3.org/2000/svg'
      var path = oDOM.createElementNS(ns, 'path');
  
      var m1 = element.getAttribute('x2');
      var m2 = element.previousElementSibling.getAttribute('y2')
      var l1 = (parseFloat(element.getAttribute('x2')) - width).toString();
      var l2 = (parseFloat(element.previousElementSibling.getAttribute('y2')) + distance).toString();
      var l3 = (parseFloat(element.getAttribute('x2')) + width).toString();
      var l4 = ((parseFloat(l2) + distance)).toString();
      var l5 = element.getAttribute('x2');
      var l6 = ((parseFloat(l4) + distance)).toString();

      path.setAttributeNS(null, 'd', `M${m1} ${m2} L${l1} ${l2} L${l3} ${l4} L${l5} ${l6}`);
      path.setAttributeNS(null, 'class', 'squiggly');

      element.replaceWith(path);
    })
  }
  setNewActor(oDOM) {
    this.oldActorElements = [];
    Array.from(oDOM.getElementsByClassName('actor transparent')).forEach((element: SVGPathElement) => {
      var ns = 'http://www.w3.org/2000/svg'
      var image = oDOM.createElementNS(ns, 'image');
      image.setAttributeNS(null, 'filter', element.getAttribute('filter'))
      image.setAttributeNS(null, 'width', '45')
      image.setAttributeNS(null, 'height', '45')
      image.setAttributeNS(null, 'x', (+(element.previousSibling as SVGCircleElement).getAttribute('cx') - (25)).toString())
      image.setAttributeNS(null, 'y', (element.previousSibling as SVGCircleElement).getAttribute('cy'));
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'assets/customer.png');
      this.oldActorElements.push(element.previousSibling, element);
      (element.parentNode).insertBefore(image, element.previousSibling.previousSibling);
      (element.previousSibling as SVGCircleElement).replaceWith();
      (element).replaceWith();
    })
  }
  toImageNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var image = oDOM.createElementNS(ns, 'image');
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
  toEllipseNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var ellipse = oDOM.createElementNS(ns, 'ellipse');
        var rx = (parseFloat(element.getAttribute('width')) / 2);
        var ry = (parseFloat(element.getAttribute('height')) / 2);
        var cx = (parseFloat(element.getAttribute('x')) + rx);
        var cy = (parseFloat(element.getAttribute('y')) + ry);
        ellipse.setAttributeNS(null, 'filter', element.getAttribute('filter'))
        ellipse.setAttributeNS(null, 'rx', rx.toString())
        ellipse.setAttributeNS(null, 'ry', ry.toString())
        ellipse.setAttributeNS(null, 'cx', cx.toString())
        ellipse.setAttributeNS(null, 'cy', cy.toString())
        element.parentNode.replaceChild(ellipse, element);
      }
    });
  }
  toCircleNode(oDOM) {
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
      if (element.getAttribute('rx') != null) {
        var ns = 'http://www.w3.org/2000/svg'
        var circle = oDOM.createElementNS(ns, 'circle');
        var r = ((parseFloat(element.getAttribute('width')) / 2) * 0.9);
        var cx = (parseFloat(element.getAttribute('x')) + (r * 1.12));
        var cy;
        if (parseFloat(element.getAttribute('width')) >= 50) {
          cy = (parseFloat(element.getAttribute('y')) + (r * 0.5));
        } else if (parseFloat(element.getAttribute('width')) >= 100) {
          cy = (parseFloat(element.getAttribute('y')) - (r * 1.5));
        } else if (parseFloat(element.getAttribute('width')) >= 130) {
          cy = (parseFloat(element.getAttribute('y')) - (r * 4));
        } else {
          cy = (parseFloat(element.getAttribute('y')) + (r * 0.8));
        }
        circle.setAttributeNS(null, 'filter', element.getAttribute('filter'))
        circle.setAttributeNS(null, 'r', r.toString())
        circle.setAttributeNS(null, 'cx', cx.toString())
        circle.setAttributeNS(null, 'cy', cy.toString())
        element.parentNode.replaceChild(circle, element);
      }
    });
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
    this.getTagList(oDOM, type).forEach(element => {
      if (element.getAttribute('fill') == 'none') {
        if (type == 'path')
          if ((element as SVGPathElement).getTotalLength().toPrecision(6) == '92.6989')
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
  setDiagramCardsize() {
    var width = Number.parseFloat((document.getElementById('svgTag') as HTMLElement).style.width.replace('px', ''));
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
        element.replaceWith()
      }
    })
    this.getTagList(oDOM, 'rect').forEach((element: SVGRectElement) => {
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
  addColorToStyle(color1, color2, color3, color4, color5, color6, color7, color8, color9, oDOM,
    colorParticipantBorder1?,
    colorParticipantBorder2?,
    colorParticipantBorder3?,
    colorParticipantBorder4?,
    colorParticipantBorder5?,
    colorParticipantBorder6?,
    colorParticipantBorder7?,
    colorParticipantBorder8?,
    colorParticipantBorder9?,
    colorParticipantBackground1?,
    colorParticipantBackground2?,
    colorParticipantBackground3?,
    colorParticipantBackground4?,
    colorParticipantBackground5?,
    colorParticipantBackground6?,
    colorParticipantBackground7?,
    colorParticipantBackground8?,
    colorParticipantBackground9?,
  ) {
    if (!oDOM) {
      oDOM = document;
    }
    if (oDOM.getElementById('svgTag')) {
      oDOM.getElementById('svgTag').style.setProperty(`--primary-color`, color1)
      oDOM.getElementById('svgTag').style.setProperty(`--secondary-color`, color2)
      oDOM.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3)
      oDOM.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4)
      oDOM.getElementById('svgTag').style.setProperty(`--text-color`, color5);
      oDOM.getElementById('svgTag').style.setProperty(`--line-color`, color6);
      oDOM.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
      oDOM.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
      oDOM.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);

      oDOM.getElementById('svgTag').style.setProperty(`--participant1-border-color`, colorParticipantBorder1);
      oDOM.getElementById('svgTag').style.setProperty(`--participant2-border-color`, colorParticipantBorder2);
      oDOM.getElementById('svgTag').style.setProperty(`--participant3-border-color`, colorParticipantBorder3);
      oDOM.getElementById('svgTag').style.setProperty(`--participant4-border-color`, colorParticipantBorder4);
      oDOM.getElementById('svgTag').style.setProperty(`--participant5-border-color`, colorParticipantBorder5);
      oDOM.getElementById('svgTag').style.setProperty(`--participant6-border-color`, colorParticipantBorder6);
      oDOM.getElementById('svgTag').style.setProperty(`--participant7-border-color`, colorParticipantBorder7);
      oDOM.getElementById('svgTag').style.setProperty(`--participant8-border-color`, colorParticipantBorder8);
      oDOM.getElementById('svgTag').style.setProperty(`--participant9-border-color`, colorParticipantBorder9);

      oDOM.getElementById('svgTag').style.setProperty(`--participant1-background-color`, colorParticipantBackground1);
      oDOM.getElementById('svgTag').style.setProperty(`--participant2-background-color`, colorParticipantBackground2);
      oDOM.getElementById('svgTag').style.setProperty(`--participant3-background-color`, colorParticipantBackground3);
      oDOM.getElementById('svgTag').style.setProperty(`--participant4-background-color`, colorParticipantBackground4);
      oDOM.getElementById('svgTag').style.setProperty(`--participant5-background-color`, colorParticipantBackground5);
      oDOM.getElementById('svgTag').style.setProperty(`--participant6-background-color`, colorParticipantBackground6);
      oDOM.getElementById('svgTag').style.setProperty(`--participant7-background-color`, colorParticipantBackground7);
      oDOM.getElementById('svgTag').style.setProperty(`--participant8-background-color`, colorParticipantBackground8);
      oDOM.getElementById('svgTag').style.setProperty(`--participant9-background-color`, colorParticipantBackground9);
    }
    if (document.getElementById('svgTag')) {
      document.getElementById('svgTag').style.setProperty(`--primary-color`, color1)
      document.getElementById('svgTag').style.setProperty(`--secondary-color`, color2)
      document.getElementById('svgTag').style.setProperty(`--tertiary-color`, color3)
      document.getElementById('svgTag').style.setProperty(`--quaternary-color`, color4)
      document.getElementById('svgTag').style.setProperty(`--text-color`, color5);
      document.getElementById('svgTag').style.setProperty(`--line-color`, color6);
      document.getElementById('svgTag').style.setProperty(`--label-border-color`, color7);
      document.getElementById('svgTag').style.setProperty(`--label-background-color`, color8);
      document.getElementById('svgTag').style.setProperty(`--label-text-color`, color9);

      document.getElementById('svgTag').style.setProperty(`--participant1-border-color`, colorParticipantBorder1);
      document.getElementById('svgTag').style.setProperty(`--participant2-border-color`, colorParticipantBorder2);
      document.getElementById('svgTag').style.setProperty(`--participant3-border-color`, colorParticipantBorder3);
      document.getElementById('svgTag').style.setProperty(`--participant4-border-color`, colorParticipantBorder4);
      document.getElementById('svgTag').style.setProperty(`--participant5-border-color`, colorParticipantBorder5);
      document.getElementById('svgTag').style.setProperty(`--participant6-border-color`, colorParticipantBorder6);
      document.getElementById('svgTag').style.setProperty(`--participant7-border-color`, colorParticipantBorder7);
      document.getElementById('svgTag').style.setProperty(`--participant8-border-color`, colorParticipantBorder8);
      document.getElementById('svgTag').style.setProperty(`--participant9-border-color`, colorParticipantBorder9);

      document.getElementById('svgTag').style.setProperty(`--participant1-background-color`, colorParticipantBackground1);
      document.getElementById('svgTag').style.setProperty(`--participant2-background-color`, colorParticipantBackground2);
      document.getElementById('svgTag').style.setProperty(`--participant3-background-color`, colorParticipantBackground3);
      document.getElementById('svgTag').style.setProperty(`--participant4-background-color`, colorParticipantBackground4);
      document.getElementById('svgTag').style.setProperty(`--participant5-background-color`, colorParticipantBackground5);
      document.getElementById('svgTag').style.setProperty(`--participant6-background-color`, colorParticipantBackground6);
      document.getElementById('svgTag').style.setProperty(`--participant7-background-color`, colorParticipantBackground7);
      document.getElementById('svgTag').style.setProperty(`--participant8-background-color`, colorParticipantBackground8);
      document.getElementById('svgTag').style.setProperty(`--participant9-background-color`, colorParticipantBackground9);
    }
  }
  setNode(oDOM, type, textImages) {
    switch (type) {
      case "Circle":
        this.toCircleNode(oDOM);
        break;
      case "Ellipse":
        this.toEllipseNode(oDOM);
        break;
      case "Images":
        if (!textImages)
          this.removeTextFromParticipants(oDOM)
        this.toImageNode(oDOM);
        break;
      default:
        break;
    }
  }
  getFonts() {
    return this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw');
  }
}