import { colors } from "../deps.ts";
import { Calendar } from "../index.ts";
import { addNumberPrefix, delay } from "./helpers.ts";

export class Clock {

  get date() {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `${addNumberPrefix(hour)}:${addNumberPrefix(
      minutes
    )}:${addNumberPrefix(seconds)}`;
  }

  static async print(withDate: boolean) {
    const instance = new this();
    const writer = Deno.stdout.writable.getWriter();
    const encoder = new TextEncoder();
    await writer.write(encoder.encode("\x1Bc"));
    while (true) {
      const date = colors.bgYellow(instance.date);
      if (withDate) {
        Calendar.realtime(date);
      } else {
      await writer.write(encoder.encode(date));
      }
      await delay(1000);
      await writer.write(encoder.encode("\x1Bc"));
    }
  }
}
