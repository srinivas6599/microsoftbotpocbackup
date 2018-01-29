var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var apiai = require('apiai');
var app = apiai("70a3b3c6e8f9405a91376dcbc57b2633");
var a = [];
// var init = 0;
var name = '';
var color;
var notSolve = 0; // after adaptive card view, this variable should be set
var Solve = 0; // after adaptive card view, this variable should be set

//a[0] = 0; // Name
//a[1] = 0; // Email
//a[2] = 0; // Error Code not found

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service

var connector = new builder.ChatConnector({
    appId: 'a7ad22e5-a8a8-48e0-be05-234950bafbcd',
    appPassword: 'BR615_-vxmdkaqCWYDL73}['
});
//https://microsoftsp.herokuapp.com/api/messages
// Listen for messages from users
server.post('/api/messages', connector.listen());

// Add global LUIS recognizer to bot
var bot = new builder.UniversalBot(connector);

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/c2278084-9c41-46d8-a85d-02642346142c?subscription-key=25fa7f3b9eca4024a7587217a81fb0fa&spellCheck=true&bing-spell-check-subscription-key=2f16f48a76ef473d855aeab8377854ca&verbose=true&timezoneOffset=0&q=';

var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//    intents.onDefault(prioritizer());

intents.matches('OnBoarding', [
    function (session, args) {
        if (session.userData.color == 1) {
            session.userData.color = 0;
            session.send("This does not match our records. Let's get started anyway. How may I help you? ");
        }
        else {
            if (builder.EntityRecognizer.findEntity(args.entities, 'Communication.ContactName')) {
                a[1] = 1;
                console.log("Args " + args.entities[0].entity);
                name = args.entities[0].entity;
                name = " " + name.charAt(0).toUpperCase() + name.slice(1);
                session.send("Hello" + name + "!"); //changed
                setTimeout(function () {
                    session.send("Can you share your e-mail ID" + name + ", so I can check for any previous conversation we may have had? If not, just say no.");
                }, 1500);
            }
            else if (builder.EntityRecognizer.findEntity(args.entities, 'builtin.email')) {
                console.log(session.userData.name)
                a[1] = 1;
                session.send("Let me check. I’ll be back in a moment. ");
                setTimeout(function () {
                    session.send("Great, I found your records. Please answer your security question before we proceed ahead.");
                    setTimeout(function () {
                        session.userData.color = 1;
                        session.send("What is your favourite colour?");
                    }, 1000);
                }, 5000);
            }
        }
    }
]);

intents.matches('MainFlow', [
    function (session, args) {
        if (session.userData.color == 1) {
            session.userData.color = 0;
            session.send("This does not match our records. Let's get started anyway. How may I help you? ");
        } else {
            if (builder.EntityRecognizer.findEntity(args.entities, 'No')) {
                apiCall(session, args);
            } else if (builder.EntityRecognizer.findEntity(args.entities, 'Ent_1_Problem')) {
                // session.send("Ok, previously we talked about (last solution recommendation…XXX).");
                session.send("Let me know the type of error code you see on the screen");
                adaptiveCard(session, args);
            } else if (((builder.EntityRecognizer.findEntity(args.entities, 'NotSolved')) && (builder.EntityRecognizer.findEntity(args.entities, 'Problem'))) ||
                (builder.EntityRecognizer.findEntity(args.entities, 'NotSolved'))) {
                if (notSolve == 1) {
                    session.send("Give me some time. Our expert assistant will reach out to you on call in 1 hour. Alternatively, you can call in this number +1 415 555 2671");
                } else {
                    apiCall(session, args);
                }
            } else if (((builder.EntityRecognizer.findEntity(args.entities, 'Solved')) && (builder.EntityRecognizer.findEntity(args.entities, 'Problem'))) ||
                (builder.EntityRecognizer.findEntity(args.entities, 'Solved'))) {
                if (Solve == 1) {
                    session.send("Fine.<br/> Thanks for chatting with me.<br/>Bye for now. ");
                } else {
                    apiCall(session, args);
                }
            }
            // else if (builder.EntityRecognizer.findEntity(args.entities, 'Error')) {
            //     session.send("Fine. I can help. What version of the Windows are you currently using?");
            // }
            // else if (builder.EntityRecognizer.findEntity(args.entities, 'Windows')) {
            //     session.send("Fine. I can help. What version of the Windows are you currently using?");
            // }
        }
    }
]);

intents.matches('Security', [
    function (session, args) {
        if (session.userData.color == 1) {
            if (builder.EntityRecognizer.findEntity(args.entities, 'Color')) {
                session.userData.color = 0;
                session.send("Thanks for answering that! Great to hear from you again " + name + ". How may I help?");
            }
        } else {
            apiCall(session, args);
        }
    }
]);

intents.matches('None', [
    function (session, args) {
        if (session.userData.color == 1) {
            session.userData.color = 0;
            session.send("This does not match our records. Let's get started anyway. How may I help you? ");
        }
        else {
            apiCall(session, args);
        }
    }
]
);

function adaptiveCard(session, args) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Hardware Resource Requirement")
            .subtitle("Windows Installation Error")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0xC1900101-0x20004", "0xC1900101-0x20004")
            ]),
        new builder.HeroCard(session)
            .title("Compatibility Issue")
            .subtitle("Windows Installation Error")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0xC1900101-0x20005", "0xC1900101-0x20005")
            ]),
        new builder.HeroCard(session)
            .title("License Fee")
            .subtitle("Windows Installation Error")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0x803f7001-0x800704cF", "0x803f7001-0x800704cF")
            ]),

        new builder.HeroCard(session)
            .title("Driver Issue")
            .subtitle("Windows Installation Hangs")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0xC1900101-0x20017", "0xC1900101-0x20017")
            ]),

        new builder.HeroCard(session)
            .title("External Device Issue")
            .subtitle("Windows Installation Hangs")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0xC1900101-0x30018", "0xC1900101-0x30018")
            ]),

        new builder.HeroCard(session)
            .title("Security Issue")
            .subtitle("Windows Installation Hangs")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0x80070005-0x90002", "0x80070005-0x90002")
            ]),

        new builder.HeroCard(session)
            .title("Device Manager Errors")
            .subtitle("Windows Installation Error")
            .text("XYZ")
            .images([builder.CardImage.create(session, '')])
            .buttons([
                builder.CardAction.imBack(session, "0xC1900101-0x3000D", "0xC1900101-0x3000D")
            ])
    ]);

    setTimeout(function () {
        session.send(msg).endDialog();
    }, 5500);

    // if (session.message.source === "webchat") {
    //     setTimeout(function () {
    //         session.send(msg).endDialog();
    //     }, 5500);
    // }

    // else if (session.message.source === "directline") {
    //     // session.send("My job is to help you in booking a car service. You can say service to get started"); 
    //     session.send("AdaptiveCardStarts---Routine Service---Body Repair---AirConditioning System---Wheel Care---AdaptiveCardEnds");
    // }
}

bot.dialog('hardware', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!")
        setTimeout(function () {
            session.send("Have you checked on the following hardware requirements?<br/>a) Processor: 1 GHz (gigahertz) or faster processor<br/>b) RAM: 1 GB (gigabyte) for 32-bit or 2 GB for 64-bit<br/>c) Available Hard disk space: 16 GB for 32-bit OS and 20 GB for 64-bit OS<br/>d) Display: with min resolution of 800x600")
        }, 1000);
        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0xC1900101-0x20004/i });

bot.dialog('compatibility', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("Kindly make sure of the following:<br/><br/> Upgrade to 32-bit OS if you have 32-bit version of OS currently installed or upgrade to 64-bit OS if you have 64-bit version of OS currently installed.<br/><br/> You cannot move from a 32-bit installation of Windows 7 or 8.1 to a 64-bit installation of Windows 10 even if your PC supports it.");
        }, 1000);
        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0xC1900101-0x20005/i });

bot.dialog('license', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("Kindly open the payment link below to continue to enjoy your upgraded version of Windows.<br/> https://www.microsoft.com/en-us/store/d/windows-10-home/d76qx4bznwk4/1NT3");
        }, 1000);
        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0x803f7001-0x800704cF/i });

bot.dialog('3rd party drivers', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("If you are using any external 3rd party drivers like Blue Ray, Disks, Floppy and drivers, kindly remove all the above and try installing it again.");
        }, 1000);

        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0xC1900101-0x20017/i });

bot.dialog('External storage devices', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("If you are using any external storage devices or other hardware like CD’s, Disks and Floppy, kindly remove them and try installing it again.");
            session.send("Make sure to unplug hard drives, other than in C drive, extra monitors, and keyboard or smart card readers.");
        }, 1000);

        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0xC1900101-0x30018/i });

bot.dialog('Security', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("It seems like a firewall issue.");
            session.send("Kindly disable all the antivirus and firewall.<br/>Yes even microsoft’s. Run the windows installer again");
        }, 1000);

        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0x80070005-0x90002/i });

bot.dialog('Device Manager Errors ', [
    function (session, args, next) {
        notSolve = 1;
        Solve = 1;
        session.send("Ok got it!");
        setTimeout(function () {
            session.send("It seems like a device manager issue.");
            session.send("Select the Start button, then in the search box on the taskbar, type device manager");
        }, 1000);
        setTimeout(function () {
            session.send("Choose Device Manager from the results. In the window that pops up, look for any device with a yellow exclamation mark beside it (you may have to select each category to switch to the list of devices). Press and hold (or right-click) the device name and select either Update Driver Software or Uninstall to correct the errors");
        }, 1500);
        setTimeout(function () {
            session.send("Hope this was helpful. Have a great day!").endDialog();
        }, 5000);
    }
]).triggerAction({ matches: /0xC1900101-0x3000D/i });

function apiCall(session, args) {
    var a = session.message.text;
    var request = app.textRequest(a, {
        sessionId: '1234567891'
    });
    request.on('response', function (response) {
        var a = response;
        if (a["result"]["metadata"]["intentName"] == "Intro") {
            a[0] = 1;
            console.log(a[0]);
        }
        session.send(a["result"]["fulfillment"]["speech"]);
    });
    request.on('error', function (error) {
        console.log(error);
    });
    request.end();
    return;
}