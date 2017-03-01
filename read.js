const login = require("facebook-chat-api");
const fs = require("fs");
const prompt = require("syncprompt")

var threadIDs = [];
var threadNames = [];
var threadTimeStamps = [];
var threadPosition;
var reverseAmount;

login({
    appState: JSON.parse(fs.readFileSync('loginFile.json', 'utf8'))
}, (err, api) => {
    if (err) return console.log(err);

    api.getThreadList(0, 20, (err, threads) => {
        if (err) return console.err(err);

        console.log("-----------List of conversations------------");

        for (var i = 0; i < threads.length; i++) {
            threadNames.push(threads[i].name.toLowerCase());
            threadIDs.push(threads[i].threadID);
            threadTimeStamps.push(threads[i].timestamp);
            console.log(threadNames[i]);
        }

        console.log("Which conversation do you want to download?");
        getConversationName();

    });

    function getConversationName() {
        var conversationName = prompt("name >>");
        threadPosition = threadNames.indexOf(conversationName);
        if (threadPosition == -1) {
            console.log("Invalid Name!");
            getConversationName();
        } else {
            console.log("Enter the number of messages you would like to download");
            getNumberOfMessages();
        }
    }

    function getNumberOfMessages() {
        reverseAmount = parseInt(prompt("amount >>"));
        if (isNaN(reverseAmount)) {
            console.log("Invalid Number!");
            getNumberOfMessages();
        } else {
            getPastMessages();
        }
    }

    function getPastMessages() {
        var threadID = threadIDs[threadPosition];

        api.getThreadInfo(threadID, (err, info) => {
            if (err) return console.err(err);

            var lastmsg = info.messageCount
            var firstmsg = lastmsg - reverseAmount;

            api.getThreadHistory(threadID, firstmsg, lastmsg, threadTimeStamps[threadPosition], (err, messages) => {
                if (err) console.log(err);
                var endLength = messages.length - 1;
                addMessages(messages, 0, endLength, "");
            });
        });
    }

    function addMessages(messageArray, currentVal, endVal, text) {

        console.log(currentVal);
        var sender = messageArray[currentVal].senderID.slice(5);
        api.getUserInfo(sender, (err, person) => {
            if (err) return console.log(err);

            var body = messageArray[currentVal].body;
            var name = person[sender].firstName;
            text += name + ": " + body + "\n--------------------------------------------\n";

            if (currentVal == endVal) {
                console.log(text);
                fs.writeFile('messages.txt', text, err => {
                    console.log('All done!');
                    process.exit(0);
                });
            } else if (currentVal < endVal) {
                addMessages(messageArray, currentVal + 1, endVal, text);
            }
        });
    }
});
