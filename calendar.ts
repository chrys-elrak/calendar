// This is a CLI tool to generate a calendar for a given month and year.
import Calendar from "./index.ts";
import ArgsParser from "./lib/args-parser.ts";

const parser = new ArgsParser();

if (parser.isEmpty()) {
    console.log("No arguments provided. See --help for more information.");
    Deno.exit(1);
}

if ("help" in parser.args) {
    console.log(parser.help());
    Deno.exit(0);
}

Calendar.new({});
Deno.exit(0);