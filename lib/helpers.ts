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


export function createArrayOfDate(n: number): number[] {
    return Array.from({ length: n }, (_, k) => k + 1);
}

export function dayPerWeek(arrayOfDate: number[]): number[][] {
    return arrayOfDate.reduce((acc: number[][], curr: number, i: number) => {
        if (i % 7 === 0) {
            acc.push([curr]);
        }
        else {
            acc[acc.length - 1].push(curr);
        }
        return acc;
    }, []);
}

export function addNumberPrefix(n: number, prefix = '0'): string {
    if (n < 10 && n > -1) return `${prefix}${n}`;
        return n.toString();
}

export function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}