  

function taskOne() { // taskOne, and it will run the code inside of it when called
    for (let h = 1; h <= 1000; h++) { // You make h a number that starts at 1 then goes up by 1 until it reaches 1000.
        console.log(h); // prints it out
    }
}
 
 
// Task 2: Sum of numbers from 1 to 1000
function taskTwo() {
    let gumar = 0; // This is gumar and it will determine the summary of the numbers from 1 to 1000, it starts at 0 because we will be adding the numbers to it
    for (let h = 1; h <= 1000; h++) { // starts from 1 and goes up by 1 until it reaches 1000 like in task one
        gumar = gumar + h; // this means the value of h (which are the numbers going from 1 to 1000) will be added to "gumar" each time so 0+1 then 1+2 then 3+3 and so on
    }
    console.log(gumar);
}
 
 
// Task 3: Factorial of 100 using BigInt
function taskThree() {
    let bazm = 1n; // you use n to declare a big integer, instead of like e+157 (rounded) you get all your desired digits
    for (let h = 1n; h <= 100n; h++) {
        bazm = bazm * h; // multiplies to 1n every time, so it will be 1n*1n then 1n*2n then 2n*3n and so on until it reaches 100n
    }
    console.log(bazm);
}
 
 
// Task 4: Sum of 1 to 10, skipping 2 and 7
function taskFour() {
    let sum = 0; // make something called sum and set it to 0, this will be used to add the numbers from 1 to 10 together
    for (let i = 1; i <= 10; i++) { // loop from 1 to 10 adding one each time
        if (i === 2 || i === 7) { // If i ever turns out to be 2 or 7, it will move on and continue with the loop without them, || means "or"
            continue; // this states that if i is 2 or 7, it will skip the rest of the code and move on to the next part of the loop
        }
        sum = sum + i; // sum is equal to itself plus i, going gradually up by 1
    }
    console.log(sum);
}
 
 
// taskOne(); Remove the "//" and it will run Task one
// taskTwo(); Remove the "//" and it will run Task two
// taskThree(); Remove the "//" and it will run Task three
// taskFour(); Remove the "//" and it will run Task four