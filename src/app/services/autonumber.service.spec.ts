import { TestBed } from '@angular/core/testing';

import { AutoNumberService } from './autonumber.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AutoNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
  contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
  --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
  --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
  --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
  --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
  width="133px" zoomAndPan="magnify">
  <g xmlns="http://www.w3.org/2000/svg">
  <line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/>
  <line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/>
  <rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text>
  <rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text>
  <polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/>
  <line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919">1</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text>
  <polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/>
  <line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247">2</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text>
  <polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/>
  <line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575">3</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text>
  </g>
  </svg>`;
  const oParser = new DOMParser();

  it('should be created', () => {
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    expect(service).toBeTruthy();
  });

  it('should set default autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
    <g xmlns="http://www.w3.org/2000/svg">
  <line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/>
  <line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/>
  <rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text>
  <rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text>
  <polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/>
  <line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text>
  <polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/>
  <line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text>
  <polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/>
  <line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text>
  </g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberDefault(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    done();
  });

  it('should set circular autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
    <g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><circle r="12" cx="50.3" cy="68.6919" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="73.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><circle r="12" cx="60.3" cy="105.8247" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="110.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><circle r="12" cx="50.3" cy="142.9575" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="147.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[1f51b3d07837a43aab3b4df1b7fb5a49]
@startuml
skinparam roundcorner 20  
 skinparam   Padding  4 
autonumber 1
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberCircular(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));

    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })

  it('should set rectangular autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
 <g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><rect width="17" height="22" x="41.5" y="58.691900000000004" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><rect width="17" height="22" x="51.5" y="95.8247" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><rect width="17" height="22" x="41.5" y="132.9575" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[1f51b3d07837a43aab3b4df1b7fb5a49]
@startuml
skinparam roundcorner 20  
 skinparam   Padding  4 
autonumber 1
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberRectangular(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })

  it('should set rounded autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
<g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><rect width="17" height="22" x="41.5" y="58.691900000000004" rx="3.5" ry="3.5" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><rect width="17" height="22" x="51.5" y="95.8247" rx="3.5" ry="3.5" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><rect width="17" height="22" x="41.5" y="132.9575" rx="3.5" ry="3.5" name="label" class="label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[ac0719d46efaa63a80f60404f4b70398]
@startuml
skinparam roundcorner 20  
 autonumber 1
skinparam   Padding  4 
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberRounded(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })

  it('should set framed rectangular autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
  <g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><rect width="59" height="22" x="41.5" y="58.691900000000004" name="label" class="label"/><line x1="59.5" x2="59.5" y1="58.691900000000004" y2="80.6919" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><rect width="59" height="22" x="51.5" y="95.8247" name="label" class="label"/><line x1="69.5" x2="69.5" y1="95.8247" y2="117.8247" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><rect width="59" height="22" x="41.5" y="132.9575" name="label" class="label"/><line x1="59.5" x2="59.5" y1="132.9575" y2="154.9575" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[ac0719d46efaa63a80f60404f4b70398]
@startuml
skinparam roundcorner 20  
 autonumber 1
skinparam   Padding  4 
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberRectangularFramed(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })

  it('should set framed circular autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
<g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><rect width="59" height="22" x="41.5" y="58.691900000000004" name="label" class="label" rx="15"/><line x1="59.5" x2="59.5" y1="58.691900000000004" y2="80.6919" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><rect width="59" height="22" x="51.5" y="95.8247" name="label" class="label" rx="15"/><line x1="69.5" x2="69.5" y1="95.8247" y2="117.8247" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><rect width="59" height="22" x="41.5" y="132.9575" name="label" class="label" rx="15"/><line x1="59.5" x2="59.5" y1="132.9575" y2="154.9575" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[ac0719d46efaa63a80f60404f4b70398]
@startuml
skinparam roundcorner 20  
 autonumber 1
skinparam   Padding  4 
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberCircularFramed(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })

  it('should set framed rounded autonumbers', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentScriptType="application/ecmascript" 
    contentStyleType="text/css" height="156px" preserveAspectRatio="none" style="width: 133px; height: 156px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 133 156" 
    width="133px" zoomAndPan="magnify">
  <g xmlns="http://www.w3.org/2000/svg"><line x1="34" x2="34" y1="44.625" y2="176.0234" class="null dashed"/><line x1="117" x2="117" y1="44.625" y2="176.0234" class="null dashed"/><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="89" y="3" name="participantshape"/><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="100" y="28.8516">Alice</text><polygon points="105.5,79.7578,115.5,83.7578,105.5,87.7578,109.5,83.7578"/><line x1="34.5" x2="111.5" y1="83.7578" y2="83.7578"/><rect width="59" height="22" x="41.5" y="58.691900000000004" name="label" class="label" rx="3"/><line x1="59.5" x2="59.5" y1="58.691900000000004" y2="80.6919" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="74.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="74.6919">hello</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"/><line x1="39.5" x2="116.5" y1="120.8906" y2="120.8906"/><rect width="59" height="22" x="51.5" y="95.8247" name="label" class="label" rx="3"/><line x1="69.5" x2="69.5" y1="95.8247" y2="117.8247" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="111.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="76.5" y="111.8247">hello</text><polygon points="105.5,154.0234,115.5,158.0234,105.5,162.0234,109.5,158.0234"/><line x1="34.5" x2="111.5" y1="158.0234" y2="158.0234"/><rect width="59" height="22" x="41.5" y="132.9575" name="label" class="label" rx="3"/><line x1="59.5" x2="59.5" y1="132.9575" y2="154.9575" class="labelDivider label"/><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="148.9575" class="labelText">3</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="66.5" y="148.9575">hello</text><!--MD5=[ac0719d46efaa63a80f60404f4b70398]
@startuml
skinparam roundcorner 20  
 autonumber 1
skinparam   Padding  4 
 skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam   ArrowFontSize  13 
skinparam   ActorFontSize 16 
skinparam   ParticipantFontSize 16 
skinparam   ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
skinparam   Padding  4
autonumber
Bob -> Alice : hello
Alice -> Bob : hello
Bob -> Alice : hello
@enduml

PlantUML version 1.2019.11(Sun Sep 22 10:02:15 UTC 2019)
(GPL source distribution)
Java Runtime: OpenJDK Runtime Environment
JVM: OpenJDK 64-Bit Server VM
Java Version: 1.8.0_222-b10
Operating System: Linux
Default Encoding: UTF-8
Language: en
Country: null
--></g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: AutoNumberService = TestBed.get(AutoNumberService);
    service.setAutonumberRoundedFramed(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("labelText"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("labelText"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    let oDomArray2 = Array.from(oDOM.getElementsByClassName("label"));
    let oDomExArray2 = Array.from(oDOMexpect.getElementsByClassName("label"));
    for (let index = 0; index < oDomArray2.length; index++) {
      expect(oDomArray2[index]).toEqual(oDomExArray2[index])
    }
    done();
  })
});
