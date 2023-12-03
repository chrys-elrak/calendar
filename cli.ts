// This is a CLI tool to generate a calendar for a given month and year.
import {Calendar} from "./index.ts";
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

if ("d" in parser.args || "date" in parser.args) {
  const date = parser.get("d") as string || parser.get("date") as string;
  const dateInstance = new Date(date);
  if (isNaN(dateInstance.getTime())) {
    console.log("Invalid date provided. See --help for more information.");
    Deno.exit(1);
  }
  Calendar.new({
    initialDate: dateInstance,
  });
} else {
  Calendar.new({});
}

Deno.exit(0);