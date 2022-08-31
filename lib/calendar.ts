import { colors } from "../deps.ts";
import { BLANK_SPACE, NEW_LINE } from "./const.ts";
import { checkLength, createArrayOfDate, dayPerWeek, formatNumber } from "./helpers.ts";

export class Calendar {

    private _renderIt = true;
    private _previousDate: Date;
    private _nDays: number;
    private _currentMonth: number;
    private _currentYear: number;
    private _currentDay: number;
    private _days: number[][] = [];
    private _lastPreviousWeeks: number[] = [];
    private _weeks: Array<string> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    private _months: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(initialDate: Date = new Date()) {
        this._currentMonth = initialDate.getMonth() + 1; // Current month is 0-indexed so add 1
        this._currentYear = initialDate.getFullYear();
        this._currentDay = initialDate.getDate();
        this._previousDate = new Date(this._currentYear, this._currentMonth - 1, 0);
        this._nDays = new Date(this._currentYear, this._currentMonth, 0).getDate();

        const previousWeeks = Array.from({ length: this._previousDate.getDate() - 27 }, (_, i) => 29 + i);
        console.log('Previous month', this._previousDate.toDateString());
        const missingDays = Array.from({ length: 7 - previousWeeks.length }, () => 0);
        this._lastPreviousWeeks = [...previousWeeks, ...missingDays];
        const t = createArrayOfDate(this._nDays);
        t.unshift(...previousWeeks);
        this._days = dayPerWeek(t);
        
        this.setLocale('fr');
        try {
            checkLength(this._weeks);
        } catch {
            this._print(colors.bgRed('Error:'), 'Failed to create calendar, because of wrong length of weekdays.');
            this._renderIt = false;
        }
    }

    setLocale(locale: 'en' | 'fr') {
        this._weeks = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }

    render() {
        if (!this._renderIt) {
            return;
        }
        let text = this._createHeader();
        this._days.forEach((week, i) => {
            week.forEach((day, j) => {
                let t = formatNumber(day, this._weeks[i].length, BLANK_SPACE);
                // Today
                if (day === this._currentDay) {
                    t = colors.bgGreen(t);
                }
                // Weekend
                if (j > 4) {
                    t = colors.red(t);
                }
                // Previous date of month
                if (day > 1 && week.indexOf(1) > j) {
                    t = colors.gray(t);
                }
                text += t + BLANK_SPACE;
            });
            text += NEW_LINE;
        });
        this._print(text);
    }
    private _createHeader() {
        return this._months[this._currentMonth - 1] + NEW_LINE + colors.bgBlue(this._weeks.join(' ')) + NEW_LINE;
    }

    private _print(...args: any[]) {
        console.log(...args);
    }
}