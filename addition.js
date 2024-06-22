
const {createServer} = require('node:http');

const hostname = '127.0.0.1';
const port = 5000;


function totalAverage(numbers) {
    const sum = numbers.reduce((accumulator, currentValue) => {
        return accumulator+currentValue;
    });

    const average = sum/numbers.length;
    return average;
}

const server = createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const numbers = [10,20,30,40,50];
    const total = totalAverage(numbers);
    res.end( `The average value is : ${total}`);
});


server.listen( port, hostname, () => {
    console.log(`The server is listening on the http://${hostname}:${port}`);
    // console.log(`${total}`);
})


