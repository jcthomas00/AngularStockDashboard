export interface Stocks { 
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

export interface UserData {
    favorites: string[],
    leftBar: number[],
    rightBar: number[]
}