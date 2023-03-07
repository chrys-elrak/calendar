import { Locale } from "./locale.ts";
import { colors } from "../deps.ts";
import { BLANK_SPACE, COLUMN_SEPARATOR, NEW_LINE } from "./const.ts";
import {
    checkLength,
    createArrayOfDate,
    dayPerWeek,
    formatNumber,
} from "./helpers.ts";
const DEFAULT_LOCALE = "en";

export class Calendar {
    private _previousDate: Date;
    private _startDate: Date;
    private _currentMonth: number;
    private _currentYear: number;
    private _currentDay: number;
    private _days: number[][] = [];
    private _lastPreviousWeeks: number[] = [];
    private _weeks: Array<string> = [];
    private _months: Array<string> = [];
    private buffer = "";
    private _today = new Date();

    constructor({
        initialDate = new Date(), 
        locale = DEFAULT_LOCALE as Locale
    }) {
        this._currentMonth = initialDate.getMonth() + 1; // Current month is 0-indexed so add 1
        this._currentYear = initialDate.getFullYear();
        this._currentDay = initialDate.getDate();
        this._previousDate = new Date(this._currentYear, this._currentMonth - 1, 0);
        this._startDate = new Date(this._currentYear, this._currentMonth, 0);
        this._lastPreviousWeeks = Array.from(
            { length: this._previousDate.getDay() },
            (_, k: number) => this._previousDate.getDate() - k,
        );
        const t = createArrayOfDate(this._startDate.getDate());
        t.unshift(...this._lastPreviousWeeks);
        this._days = dayPerWeek(t);
        this.setLocale(locale);
        try {
            checkLength(this._weeks);
        } catch {
            this._print(colors.bgRed("Error:"), "Failed to create calendar");
            Deno.exit(1);
        }
    }

    setLocale(locale: Locale) {
        const file = "./locale/" + locale + ".json";
        try {
            const data = Deno.readTextFileSync(file);
            const config = JSON.parse(data);
            this._weeks = config.weeks;
            this._months = config.months;
            return this;
        } catch (_) {
            this._print(
                colors.bgRed("Error: "),
                colors.red(`Locale not suported "${locale}"`),
            );
            Deno.exit(1);
        }
    }

    build(): this {
        this.buffer = this._createHeader();
        this._days.forEach((week, i) => {
            week.forEach((day, j) => {
                let text = formatNumber(day, this._weeks[i].length, BLANK_SPACE);
                // Today
                if (day === this._currentDay) {
                    text = colors.green(text);
                }
                // Weekend
                if (j > 4) {
                    text = colors.red(text);
                }
                // Previous date of month
                if (day > 1 && week.indexOf(1) > j) {
                    text = colors.gray(text);
                }
                this.buffer += text + BLANK_SPACE;
            });
            this.buffer += NEW_LINE;
        });
        return this;
    }

    render(): this {
        this.build();
        this._print(this.buffer);
        return this;
    }

    static new({
        initialDate = new Date(), 
        locale = DEFAULT_LOCALE as Locale
    }) {
        return new Calendar({initialDate, locale}).render();
    }

    private _createHeader() {
        return NEW_LINE + formatNumber(this._today.getDate(), 2, '0')
            + BLANK_SPACE + this._months[this._currentMonth - 1] 
            + BLANK_SPACE + this._currentYear
            + BLANK_SPACE + '~'
            + BLANK_SPACE + this._today.getHours() + COLUMN_SEPARATOR + this._today.getMinutes()
            + NEW_LINE + colors.bgBlue(this._weeks.join(" ")) 
            + NEW_LINE;
    }

    private _print<T>(...args: T[]) {
        console.log(...args);
    }
}
