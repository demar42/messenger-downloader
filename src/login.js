const fs = require("fs");
const login = require("facebook-chat-api");

login({email: process.argv[2], password: process.argv[3]}, (err, api) => {
    if (err) return console.err(err);

    console.log(process.argv[2]);
    console.log(process.argv[3]);

    fs.writeFileSync('loginFile.json', JSON.stringify(api.getAppState()));
})
