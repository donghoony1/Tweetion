const fs = require('fs');
if(!fs.existsSync('./_environment.json')) {
    console.log('Can\'t find _environment.json.');
    process.exit();
}
process.env = JSON.parse(fs.readFileSync('_environment.json', 'utf-8'));

if(process.argv.length !== 4) {
    console.log('Arguments is not valid.');
    process.exit();
}
const Event = {
    id: process.argv[2],
    count: process.argv[3]
};

const index = require('./index.js');

index.handler(Event, {}, (error, data) => {
    if(error) console.log(error);
    else console.log(data);
});