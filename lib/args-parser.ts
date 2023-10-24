
type TArgs = { [key: string]: string | boolean | number | undefined };
export default class ArgsParser {

    public args: TArgs =  {};
    constructor() {
        this.#parseArgs(Deno.args);
    }

    #parseArgs(args: string[]) {
        const parsedArgs:TArgs = {};
        for (let i = 0; i < args.length; i+=2) {
            const arg = args[i];
            if (arg === "--help") {
                parsedArgs[this.formatArgs(arg)] = true;
                break;
            } else if (arg.startsWith("--") || arg.startsWith("-")) {
                parsedArgs[this.formatArgs(arg)] = args[i+1];
            }
        }
        this.args = parsedArgs;
    }

    formatArgs(key: string): string {
        return key.replace(/^-*/, "");
    }

    isEmpty() {
        return Object.keys(this.args).length === 0;
    }

    help() {
        return `Usage: calendar [OPTION]... [MONTH] [YEAR]`;
    }

    get argKeys() {
        return Object.keys(this.args);
    }

    get(key: string): string | boolean | number | undefined {
        return this.args[key];
    }
}
