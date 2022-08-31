export function formatNumber(number: number, numberOfSpace = 1, spaceChar = ' '): string {
    let spaceLine = '';
    for (let i = 1; i < numberOfSpace; i++) {
        spaceLine += spaceChar;
    }
    if (number < 10) {
        return spaceLine + number;
    }
    spaceLine = spaceLine.slice(0, -1);
    return spaceLine + number.toString();
}


export function checkLength(arrayOfString: string[]) {
    const regularLength = arrayOfString[0].length;
    arrayOfString.forEach((str, i) => {
        if (str.length !== regularLength) {
            throw new Error(`[${arrayOfString}]: Length of string at the position ${i} '${str}' is not equal to ${regularLength}`);
        }
    });
}