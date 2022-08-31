import { colors } from "../deps.ts";
import { BLANK_SPACE, NEW_LINE } from "./const.ts";
import { checkLength, formatNumber } from "./helpers.ts";

export class Calendar {

    private _renderIt = true;
    private _numberOfDates: number;
    private _month: number;
    private _year: number;
    private _todayDate: number;
    private _weeks: Array<string> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    private _months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(initialDate: Date = new Date()) {
        this._month = initialDate.getMonth();
        this._year = initialDate.getFullYear();
        this._todayDate = initialDate.getDate();
        this.setLocale('fr');
        try {
            checkLength(this._weeks);
        } catch {
            this._print(colors.bgRed('Error:'), 'Failed to create calendar, because of wrong length of weekdays.');
            this._renderIt = false;
        }
        this._numberOfDates = new Date(this._year, this._month, 0).getDate();
    }

    setLocale(locale: 'en' | 'fr') {
        this._weeks = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }

    private _createArrayOfDate(): Array<number> {
        const arrayOfDate = Array.from({ length: this._numberOfDates }, (_, k) => k + 1);
        return arrayOfDate;
    }

    render() {
        if (!this._renderIt) {
            return;
        }
        let text = '';
        let weekCounter = 0;
        const arrayOfDate = this._createArrayOfDate();
        arrayOfDate.forEach((date, i) => {
            const count = this._weeks[weekCounter].length;
            let dateString = formatNumber(date, count);
            if (date === this._todayDate) {
               dateString = colors.bgGreen(dateString);
            }
            if (i % 7 === 0) {
                text += `${NEW_LINE}${dateString}`;
                weekCounter = 0;
            } else {
                text += `${BLANK_SPACE}${dateString}`;
                weekCounter++;
            }
        });
        text = colors.bgBlue(this._weeks.join(' ')) + text;
        this._print(this._months[this._month - 1], this._year.toString(), NEW_LINE + text + NEW_LINE);
    }

    private _print(...args: any[]) {
        console.log(...args);
    }
}