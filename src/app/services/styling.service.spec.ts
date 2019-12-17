import { TestBed } from '@angular/core/testing';

import { StylingService } from './styling.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StylingService', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule] }));

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" 
  contentscripttype="application/ecmascript" contentstyletype="text/css" height="224px" preserveAspectRatio="none" 
  style="width: 157px; height: 224px; 
  --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
  --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
  --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
  --participant-stroke-width:2; --border-thickness:1; --font-size:14;" 
  version="1.1" viewBox="0 0 157 224" width="157px" zoomAndPan="magnify">
  <g>
  <line x1="30" x2="30" y1="92.625" y2="176.8906"></line>
  <line x1="30" x2="30" y1="176.8906" y2="212.8906" class="null skipped"></line>
  <line x1="30" x2="30" y1="212.8906" y2="260.0234"></line>
  <line x1="113" x2="113" y1="92.625" y2="176.8906"></line>
  <line x1="113" x2="113" y1="176.8906" y2="212.8906" class="null skipped"></line>
  <line x1="113" x2="113" y1="212.8906" y2="260.0234"></line>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="12" y="84.8516">Bob</text>
  <ellipse cx="30.5" cy="13" rx="8" ry="8" name="participantshape" class="null actorshape"></ellipse>
  <path d="M30.5,21 L30.5,48 M17.5,29 L43.5,29 M30.5,48 L17.5,63 M30.5,48 L43.5,63 " class="actor transparent"></path>
  <rect height="40.625" rx="10" ry="10" width="57" x="85" y="51" name="participantshape"></rect>
  <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="96" y="76.8516">Alice</text>
  <polygon points="101.5,127.7578,111.5,131.7578,101.5,135.7578,105.5,131.7578"></polygon>
  <line x1="30.5" x2="107.5" y1="131.7578" y2="131.7578"></line>
  <circle r="12" cx="46.3" cy="116.6919" name="label" class="label"></circle>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="121.6919" class="labelText">1</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="122.6919">hello</text>
  <polygon points="41.5,164.8906,31.5,168.8906,41.5,172.8906,37.5,168.8906"></polygon>
  <line x1="35.5" x2="112.5" y1="168.8906" y2="168.8906"></line>
  <circle r="12" cx="56.3" cy="153.8247" name="label" class="label"></circle>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="51.5" y="158.8247" class="labelText">2</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="72.5" y="159.8247">hello</text>
  <polygon points="101.5,238.0234,111.5,242.0234,101.5,246.0234,105.5,242.0234"></polygon>
  <line x1="30.5" x2="107.5" y1="242.0234" y2="242.0234"></line>
  <circle r="12" cx="46.3" cy="226.9575" name="label" class="label"></circle>
  <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="231.9575" class="labelText">3</text>
  <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="232.9575">hello</text>
  </g>
  </svg>`;
  const oParser = new DOMParser();

  it('should be created', () => {
    const service: StylingService = TestBed.get(StylingService);
    expect(service).toBeTruthy();
  });

  it('should set squiggly', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" 
    contentscripttype="application/ecmascript" contentstyletype="text/css" height="224px" preserveAspectRatio="none" 
    style="width: 157px; height: 224px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" 
    version="1.1" viewBox="0 0 157 224" width="157px" zoomAndPan="magnify">
    <g>
    <line x1="30" x2="30" y1="92.625" y2="176.8906"></line>
    <path d="M30 176.8906 L10 188.8906 L50 200.8906 L30 212.8906" class="squiggly"></path>
    <line x1="30" x2="30" y1="212.8906" y2="260.0234"></line>
    <line x1="113" x2="113" y1="92.625" y2="176.8906"></line>
    <path d="M113 176.8906 L93 188.8906 L133 200.8906 L113 212.8906" class="squiggly"></path>
    <line x1="113" x2="113" y1="212.8906" y2="260.0234"></line>
    <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="12" y="84.8516">Bob</text>
    <ellipse cx="30.5" cy="13" rx="8" ry="8" name="participantshape" class="null actorshape"></ellipse>
    <path d="M30.5,21 L30.5,48 M17.5,29 L43.5,29 M30.5,48 L17.5,63 M30.5,48 L43.5,63 " class="actor transparent"></path>
    <rect height="40.625" rx="10" ry="10" width="57" x="85" y="51" name="participantshape"></rect>
    <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="96" y="76.8516">Alice</text>
    <polygon points="101.5,127.7578,111.5,131.7578,101.5,135.7578,105.5,131.7578"></polygon>
    <line x1="30.5" x2="107.5" y1="131.7578" y2="131.7578"></line>
    <circle r="12" cx="46.3" cy="116.6919" name="label" class="label"></circle>
    <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="121.6919" class="labelText">1</text>
    <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="122.6919">hello</text>
    <polygon points="41.5,164.8906,31.5,168.8906,41.5,172.8906,37.5,168.8906"></polygon>
    <line x1="35.5" x2="112.5" y1="168.8906" y2="168.8906"></line>
    <circle r="12" cx="56.3" cy="153.8247" name="label" class="label"></circle>
    <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="51.5" y="158.8247" class="labelText">2</text>
    <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="72.5" y="159.8247">hello</text>
    <polygon points="101.5,238.0234,111.5,242.0234,101.5,246.0234,105.5,242.0234"></polygon>
    <line x1="30.5" x2="107.5" y1="242.0234" y2="242.0234"></line>
    <circle r="12" cx="46.3" cy="226.9575" name="label" class="label"></circle>
    <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="231.9575" class="labelText">3</text>
    <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="232.9575">hello</text>
    </g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: StylingService = TestBed.get(StylingService);
    service.setSquiggly(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("squiggly"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("squiggly"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    done();
  });

  it('should set male actor', (done) => {
    const oDOM = oParser.parseFromString(svg, 'image/svg+xml');
    const expectSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svgTag" 
    contentscripttype="application/ecmascript" contentstyletype="text/css" height="224px" preserveAspectRatio="none" 
    style="width: 157px; height: 224px; 
    --primary-color:#cccccc; --secondary-color:#ffffff; --tertiary-color:#fbf9eb; --quaternary-color:#cccccc; 
    --text-color:#333333; --line-color:#009ddc; --label-border-color:#cccccc; --label-background-color:#ffffff; 
    --label-text-color:#009ddc; --box-back-color:#f5f5f5; --box-stroke-color:#f5f5f5; --font-stack:Open Sans; 
    --participant-stroke-width:2; --border-thickness:1; --font-size:14;" 
    version="1.1" viewBox="0 0 157 224" width="157px" zoomAndPan="magnify">
    <g>
      <line x1="30" x2="30" y1="92.625" y2="176.8906"></line>
      <line x1="30" x2="30" y1="176.8906" y2="212.8906" class="null skipped"></line>
      <line x1="30" x2="30" y1="212.8906" y2="260.0234"></line>
      <line x1="113" x2="113" y1="92.625" y2="176.8906"></line>
      <line x1="113" x2="113" y1="176.8906" y2="212.8906" class="null skipped"></line>
      <line x1="113" x2="113" y1="212.8906" y2="260.0234"></line>
        <svg x="5.5" y="18" width="45px" height="45px" viewBox="0 -1 45 45" version="1.1">
          <g id="surface1">
            <path class="actorClass" name="participantshape" d="M 44.972656 43.835938 L 43.847656 39.335938 
            C 43.3125 37.152344 41.695312 35.398438 39.5625 34.6875 L 31.3125 31.9375 C 29.300781 31.101562 28.378906 27.859375 28.179688 26.628906 
            C 29.714844 25.355469 30.699219 23.542969 30.9375 21.5625 
            C 30.902344 21.222656 30.984375 20.882812 31.164062 20.597656 
            C 31.457031 20.523438 31.695312 20.3125 31.808594 20.035156 
            C 32.347656 18.726562 32.6875 17.347656 32.8125 15.9375 C 32.8125 15.859375 32.804688 15.785156 32.785156 15.710938 
            C 32.648438 15.164062 32.328125 14.679688 31.875 14.34375 L 31.875 9.375 
            C 31.875 6.355469 30.953125 5.113281 29.980469 4.398438 C 29.796875 2.941406 28.238281 0 22.5 0 
            C 17.410156 0.203125 13.328125 4.285156 13.125 9.375 L 13.125 14.34375 
            C 12.671875 14.679688 12.347656 15.164062 12.214844 15.710938 C 12.195312 15.785156 12.1875 15.859375 12.1875 15.9375 
            C 12.3125 17.347656 12.652344 18.730469 13.191406 20.035156 C 13.273438 20.300781 13.484375 20.503906 13.753906 20.574219 
            C 13.859375 20.628906 14.054688 20.898438 14.054688 21.5625 C 14.292969 23.546875 15.285156 25.367188 16.828125 26.640625 
            C 16.632812 27.867188 15.714844 31.105469 13.761719 31.925781 L 5.4375 34.6875 
            C 3.304688 35.398438 1.6875 37.152344 1.15625 39.332031 L 0.03125 43.832031 
            C -0.0976562 44.332031 0.207031 44.84375 0.707031 44.972656 C 0.78125 44.992188 0.859375 45 0.9375 45 
            L 44.0625 45 C 44.578125 45 45 44.582031 45 44.0625 C 45 43.984375 44.988281 43.910156 44.972656 43.835938 Z 
            M 44.972656 43.835938 "></path>
          </g>
        </svg>
      <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="31" x="12" y="84.8516">Bob</text>
      <rect height="40.625" rx="10" ry="10" width="57" x="85" y="51" name="participantshape"></rect>
      <text font-family="sans-serif" font-size="16" lengthAdjust="spacingAndGlyphs" textLength="35" x="96" y="76.8516">Alice</text>
      <polygon points="101.5,127.7578,111.5,131.7578,101.5,135.7578,105.5,131.7578"></polygon>
      <line x1="30.5" x2="107.5" y1="131.7578" y2="131.7578"></line>
      <circle r="12" cx="46.3" cy="116.6919" name="label" class="label"></circle>
      <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="121.6919" class="labelText">1</text>
      <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="122.6919">hello</text>
      <polygon points="41.5,164.8906,31.5,168.8906,41.5,172.8906,37.5,168.8906"></polygon>
      <line x1="35.5" x2="112.5" y1="168.8906" y2="168.8906"></line><circle r="12" cx="56.3" cy="153.8247" name="label" class="label"></circle>
      <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="51.5" y="158.8247" class="labelText">2</text>
      <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="72.5" y="159.8247">hello</text>
      <polygon points="101.5,238.0234,111.5,242.0234,101.5,246.0234,105.5,242.0234"></polygon>
      <line x1="30.5" x2="107.5" y1="242.0234" y2="242.0234"></line>
      <circle r="12" cx="46.3" cy="226.9575" name="label" class="label"></circle>
      <text font-family="sans-serif" font-size="13" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="9" x="41.5" y="231.9575" class="labelText">3</text>
      <text font-family="sans-serif" font-size="13" lengthAdjust="spacingAndGlyphs" textLength="30" x="62.5" y="232.9575">hello</text>
    </g>
    </svg>`;
    const oDOMexpect = oParser.parseFromString(expectSvg, 'image/svg+xml');
    const service: StylingService = TestBed.get(StylingService);
    console.log('dom', oDOM);
    console.log('expect', oDOMexpect);

    service.setMaleActor(oDOM);
    let oDomArray = Array.from(oDOM.getElementsByClassName("participantshape"));
    let oDomExArray = Array.from(oDOMexpect.getElementsByClassName("participantshape"));
    for (let index = 0; index < oDomArray.length; index++) {
      expect(oDomArray[index]).toEqual(oDomExArray[index])
    }
    done();
  });
});
