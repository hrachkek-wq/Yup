let sum=0; // make something called sum and set it to 0, this will be used to add the numbers from 1 to 10 together
for (let i=1; i<=10; i++) { // loop from 1 to 10 adding one each time
    if (i === 2 || i === 7) { //  If i ever turns out to be 2 or 7, it will move on and continute with the loop without them, || means "or"
        continue; // this states that if I is 2 or 7, it will skip the rest of the code and move on to the next part of the loop
    }
    sum = sum + i; // sum is equal to itself plus + going gradually up by 1
}
console.log(sum);