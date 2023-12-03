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
    #previousDate: Date;
    #startDate: Date;
    #currentMonth: number;
    #currentYear: number;
    #currentDay: number;
    #days: number[][] = [];
    #lastPreviousWeeks: number[] = [];
    #weeks: Array<string> = [];
    #months: Array<string> = [];
    #buffer = "";
    #today = new Date();
    #clock?: string;

    constructor({
        initialDate = new Date(), 
        locale = DEFAULT_LOCALE as Locale
    }) {
        this.#currentMonth = initialDate.getMonth() + 1; // Current month is 0-indexed so add 1
        this.#currentYear = initialDate.getFullYear();
        this.#currentDay = initialDate.getDate();
        this.#previousDate = new Date(this.#currentYear, this.#currentMonth - 1, 0);
        this.#startDate = new Date(this.#currentYear, this.#currentMonth, 0);
        this.#lastPreviousWeeks = Array.from(
            { length: this.#previousDate.getDay() },
            (_, k: number) => this.#previousDate.getDate() - k,
        );
        const t = createArrayOfDate(this.#startDate.getDate());
        t.unshift(...this.#lastPreviousWeeks);
        this.#days = dayPerWeek(t);
        this.setLocale(locale);
        try {
            checkLength(this.#weeks);
        } catch {
            this.#print(colors.bgRed("Error:"), "Failed to create calendar");
            Deno.exit(1);
        }
    }

    setLocale(locale: Locale) {
        const file = "./locale/" + locale + ".json";
        try {
            const data = Deno.readTextFileSync(file);
            const config = JSON.parse(data);
            this.#weeks = config.weeks;
            this.#months = config.months;
            return this;
        } catch (_) {
            this.#print(
                colors.bgRed("Error: "),
                colors.red(`Locale not suported "${locale}"`),
            );
            Deno.exit(1);
        }
    }

    build(): this {
        this.#buffer = this.#createHeader();
        this.#days.forEach((week, i) => {
            week.forEach((day, j) => {
                let text = formatNumber(day, this.#weeks[i].length, BLANK_SPACE);
                // Today
                if (day === this.#currentDay) {
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
                this.#buffer += text + BLANK_SPACE;
            });
            this.#buffer += NEW_LINE;
        });
        return this;
    }

    render(): this {
        this.build();
        this.#print(this.#buffer);
        return this;
    }

    static new({
        initialDate = new Date(), 
        locale = DEFAULT_LOCALE as Locale
    }) {
        return new Calendar({initialDate, locale}).render();
    }

    static realtime(time: string) {
        const instance = new Calendar({ initialDate: new Date() });
        instance.#clock = time;
        return instance.render();
    }

    #createHeader() {
        return NEW_LINE + formatNumber(this.#today.getDate(), 2, '0')
            + BLANK_SPACE + this.#months[this.#currentMonth - 1] 
            + BLANK_SPACE + this.#currentYear
            + BLANK_SPACE + '~'
            + BLANK_SPACE + this.#clock
            + NEW_LINE + colors.bgBlue(this.#weeks.join(" ")) 
            + NEW_LINE;
    }

    #print<T>(...args: T[]) {
        console.log(...args);
    }
}
