
export default class ArgsParser {

    public args: { [key: string]: string } =  {};
    constructor() {
        this.parseArgs(Deno.args);
    }

    parseArgs(args: string[]) {
        const parsedArgs: { [key: string]: string } = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith("--")) {
                const [key, value] = arg.split("=");
                parsedArgs[key] = value;
            }
        }
        this.args = parsedArgs;
    }

    get argKeys() {
        return Object.keys(this.args);
    }

    getArg(key: string) {
        return this.args[key];
    }
}
