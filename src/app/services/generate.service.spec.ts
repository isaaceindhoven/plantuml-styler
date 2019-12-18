import { TestBed } from '@angular/core/testing';

import { GenerateService } from './generate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GenerateService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  it('should be created', () => {
    const service: GenerateService = TestBed.get(GenerateService);
    expect(service).toBeTruthy();
  });

  it('should generate a diagram', (done) => {
    const service: GenerateService = TestBed.get(GenerateService);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" contentscripttype="application/ecmascript" contentstyletype="text/css" height="150px" preserveAspectRatio="none" style="width: 191px; height: 150px; --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; --participant-stroke-width:2; --border-thickness:1; --font-size:14;" version="1.1" viewBox="0 0 191 150" width="191px" zoomAndPan="magnify"><defs></defs><g><line x1="34" x2="34" y1="44.625" y2="138.8906" class="null dashed"></line><line x1="151" x2="151" y1="44.625" y2="138.8906" class="null dashed"></line><rect height="40.625" rx="10" ry="10" width="53" x="8" y="3" name="participantshape"></rect><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="19" y="28.8516">Bob</text><rect height="40.625" rx="10" ry="10" width="57" x="123" y="3" name="participantshape"></rect><text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="134" y="28.8516">Alice</text><polygon points="139.5,79.7578,149.5,83.7578,139.5,87.7578,143.5,83.7578"></polygon><line x1="34.5" x2="145.5" y1="83.7578" y2="83.7578"></line><circle r="12" cx="50.3" cy="68.6919" name="label" class="label"></circle><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="45.5" y="73.6919" class="labelText">1</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="51" x="66.5" y="74.6919">Hi there</text><polygon points="45.5,116.8906,35.5,120.8906,45.5,124.8906,41.5,120.8906"></polygon><line x1="39.5" x2="150.5" y1="120.8906" y2="120.8906"></line><circle r="12" cx="60.3" cy="105.8247" name="label" class="label"></circle><text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="55.5" y="110.8247" class="labelText">2</text><text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="64" x="76.5" y="111.8247">Hey hello!</text><!--MD5=[d511b40ee6ef32e650f31c9f3e8f74eb]
@startuml
skinparam roundcorner 20  
 skinparam   Padding  4 
autonumber 1
skinparam titleBorderThickness 2 
skinparam SequenceTitleFontSize 17 
skinparam BoxPadding 15 
skinparam SequenceDividerFontSize 14 
skinparam ArrowFontSize 13 
skinparam ActorFontSize 16 
skinparam ParticipantFontSize 16 
skinparam ParticipantPadding  0 
skinparam notefontsize 12 
 skinparam Shadowing false 
hide footbox 
Bob -> Alice: Hi there
Alice -> Bob: Hey hello!
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
--></g></svg>`


    service.selectedTheme = 'ISAAC';
    service.isThemed = true;
    service.generateSVG(
      `Bob -> Alice: Hi there
       Alice -> Bob: Hey hello!`
    ).then(() => {
      expect(service.svg).toEqual(svg);
    });
  });

});
