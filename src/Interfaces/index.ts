export interface Stocks { 
    symbol: string,
    x: string[],
    close: number[],
    high:   number[],
    low:    number[],
    open:   number[],
    decreasing: {}, 
    increasing: {}, 
    line: {}, 
    type: string, 
    xaxis: string, 
    yaxis: string 
}; 

export interface LineChart { 
    x: string[],
    y: number[],
    decreasing: {}, 
    increasing: {}, 
    line: {}, 
    type: string, 
    xaxis: string, 
    yaxis: string,
    mode: string,
    connectgaps: boolean,
    name: string
}; 

export interface UserData {
    favorites: string[],
    leftBar: number[],
    rightBar: number[]
}