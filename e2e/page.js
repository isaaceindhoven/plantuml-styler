import { Selector } from 'testcafe';

const label = Selector('label');

class Feature {
    constructor(text) {
        this.label = label.withText(text);
        this.checkbox = this.label.find('input[type=checkbox]');
    }
}

export default class Page {
    constructor() {
        this.textArea = Selector('#tA');
        this.themes = Selector('#themesAccordion');
        this.colors = Selector('#colorsAccordion');
        this.actions = Selector('#actionsAccordion');
        this.styling = Selector('#stylingAccordion');
        this.notheme = Selector('#notheme');
        this.usetheme = Selector('#usetheme'    );
        this.selecttheme = Selector('#selecttheme');
        this.color1 = Selector('#color1input');
        this.color2 = Selector('#color2input');
        this.color3 = Selector('#color3input');
        this.color4 = Selector('#color4input');
        this.color5 = Selector('#color5input');
        this.color6 = Selector('#color6input');
        this.color7 = Selector('#color7input');
        this.color8 = Selector('#color8input');
        this.color9 = Selector('#color9input');


        this.featureList = [
            new Feature('Support for testing on remote devices'),
            new Feature('Re-using existing JavaScript code for testing'),
            new Feature('Easy embedding into a Continuous integration system')
        ];

        this.slider = {
            handle: Selector('.ui-slider-handle'),
            tick: Selector('.slider-value')
        };

        this.themeSelect = Selector('#selecttheme');
        this.interfaceSelectJohan = Selector('#Johan');
        this.interfaceSelectPlantuml = Selector('#PlantUML');

        this.numberSelect = Selector('#NumberSelect');
        this.interfaceSelectRound= Selector('#Rounded');

        this.breakSelect = Selector('#BreakSelect');
        this.interfaceSelectSquiggly= Selector('#Squiggly');
    }
}