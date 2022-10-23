import { Locale } from './locale.ts';
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
    private _weeks: Array<string> = [];
    private _months: Array<string> = [];

    constructor(initialDate: Date = new Date()) {
        this._currentMonth = initialDate.getMonth() + 1; // Current month is 0-indexed so add 1
        this._currentYear = initialDate.getFullYear();
        this._currentDay = initialDate.getDate();
        this._previousDate = new Date(this._currentYear, this._currentMonth - 1, 0);
        this._nDays = new Date(this._currentYear, this._currentMonth, 0).getDate();
        this._lastPreviousWeeks = Array.from({ length: this._previousDate.getDay() }, (_, k: number) => this._previousDate.getDate() - k);
        const t = createArrayOfDate(this._nDays);
        t.unshift(...this._lastPreviousWeeks);
        this._days = dayPerWeek(t);
        try {
            this.setLocale('en');
            checkLength(this._weeks);
        } catch {
            this._print(colors.bgRed('Error:'), 'Failed to create calendar');
            this._renderIt = false;
        }
    }

    setLocale(locale: Locale) {
        const data = Deno.readTextFileSync("./locale/" + locale + ".json")
        const config = JSON.parse(data);
        this._weeks = config.weeks;
        this._months = config.months;
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
                    t.split('').filter(s => s !== BLANK_SPACE)
                        .forEach((s) => {
                            t = t.replace(s, colors.bgGreen(s));
                        });
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
        return NEW_LINE + this._months[this._currentMonth - 1] + BLANK_SPACE + this._currentYear + NEW_LINE + colors.bgBlue(this._weeks.join(' ')) + NEW_LINE;
    }

    private _print<T>(...args: T[]) {
        console.log(...args);
    }
}