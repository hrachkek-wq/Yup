let bazm = 1n; // you use n to declare a big integer, instead of like e+157 (rounded) you get all ur desired digits
for (let h=1n; h<=100n; h++) { 
    bazm = bazm * h; // multiplies to 1n every time, so it will be 1n*1n then 1n*2n then 2n*3n and so on until it reaches 100n
}
console.log(bazm);

