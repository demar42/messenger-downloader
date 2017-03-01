# messenger-downloader
A Node.js program that downloads messages off a group chat in Facebook Messenger

##How to use:

First, you need to download files `login.js` and `read.js` to a directory on your computer. Install node.js as well as facebook-chat-api and syncprompt, using `npm install`

Navigate to the folder in which the files are stored.

When you begin, you will need to create a login appstate file. Do this by executing `node login.js "YOUREMAIL@EMAIL.COM" "YOUR PASSWORD"`. This will create a .json file which
will log you in

Next, run `node read.js` in cmd and follow the onscreen prompts.

Your messages are output to a file called `messages.txt` next to all the other js files

ENJOY!
