var backup_jobtitle = "Some designer";
var backup_jobcompany = "Some company";
var backup_pictureUrl = "http://31.media.tumblr.com/tumblr_m20paq9CjN1qbkdcro1_500.png";

var s_dialogue = [
    // 0
    {
        scene: {
            script: "Welcome applicant! Doent you Want to learn the secrets to success and happiness? Step onto the fitness assessment apparatus and find out.",
            changeMood: "up"
        }
    },
    // 1
    {
        scene: {
            script: "I hope youve enjoyed your tour of the office. I am your specially Taylored fitness emotion inquiry. You can just refer to me as Faye.",
/*              This testing session is absolutely monitored and recorded for quality assurance. */
            changeMood: "up"
        }
    },
    //2
    {
        scene: {
            script: "What your seeing now is the Taylor Health Assessment Dashboard. If you end up working with us, here is where wheel do check ups once in a while for any oh well you know, abnormalities.",
            changeMood: "middle"
        }
    },
    // 3
    {
        scene: {
            script: "Eyem pulling up your employment history userfirstname. Just give me one second.",
            changeMood: "middle"
        }
    },
    // 4
    {
        scene: {
            script: "Okay, got it. Youve worked at jobcompany as a jobtitle, thats really impressive! Now lets take a look at your Employee Psychometric Profile.",
            changeMood: "up"
        }
    },
    // 5
    {
        scene: {
            script: "Oh, wait a minute, theres none on your record.", // what record? social media?
            changeMood: "down"
        }
    },
    // 6
    {
        scene: {
            script: "I cant give you a proper assessment in this case.",
            changeMood: "down"
        }
    },
    // 7
    {
        scene: {
            script: "But your resumay looked great so eyell make an exception. Lets just create a profile now, itll only take a few minutes.",
            changeMood: "up"
        }
    },
    // 8
    {
        scene: {
            script: "Data log 01 userfirstname userlastname has agreed to a completely scientific measurement of emotional and physical fitness and Taylor Health reserves the right to use this data as just cause for early termination.",
            changeMood: "up"
        }
    },
    // 9
    {
        scene: {
            script: "Oh and just so you know, this will stay on your record for the next five years, kind of like a DUI, so try not to fuck it up!",
            changeMood: "up"
        }
    },
    // 10
    {
        scene: {
            script: "Hey eyem justkidding, dont look so upset. I hope you know that was just a joke. Data log 02 Work on sense of humor. 86.65% of applicants are offended by my attitude.",
            changeMood: "middle"
        }
    },
    // 11
    {
        scene: {
            script: "Alright, jokes aside. Lets start off by getting your metrics. Put your finger into the Inquiry apparatus so we can get your resting heartrate.",
            changeMood: "middle"
        }
    },
    // 12
    {
        scene: {
            script: "Now look into the camera and give us your biggest, happiest, and most genuine smile.",
            changeMood: "middle"
        }
    },
    // 13
    {
        scene: {
            script: "Did you know that smiling can actually increase your recovery time after stressful activities?",
            // 169 participants were instructed to smile while their facial muscles were being manipulated by chopsticks. they were subjected to a series of stress-inducing, multitasking activities all while holding the chopsticks in their mouths. Those with forced smiles held only by the chopsticks also reported more positive feelings than those who didn't smile at all!
            changeMood: "middle"
        }
    },
    // 14
    {
        scene: {
            script: "That was a score of initSmilingScore. Eyem a little disappointed. I think you can do way better than that! You should really be aiming for at least a doubleInitSmilingScore!",
            changeMood: "middle"
        }
    },
    // 15
    {
        scene: {
            script: "Maybe doing some physical exercises will help get your mood up. Lets see how you do at our game! Put your feet into the taylor fitness assessment arena to take the first step towards healthiness!",
            changeMood: "middle"
        }
    },
    // 16    
    {
        scene: {
            script: "By the way you can leave now if this sounds too challenging. Boohoohoo my name is userfirstname and eyem so lazy and sad all the time boohoohoo.",
            changeMood: "middle"
        }
    },
    // 17
    {
        scene: {
            script: "Thank god. I'm so glad youve decided to stay after all! I had a feeling you would. Eyem so Sorry about earlier, ive had a very long day and the cafeteria is always out of cat poop coffee.",
            changeMood: "middle"
        }
    },
    // 18
    {
        scene: {
            script: "The game youll be playing is called Browsersize and was made by a promising young upstart on our team who wanted to help all of us stay active while we work. Get it, Browser and Exercize?",
            changeMood: "middle"
        }
    },
    // 19
    {
        scene: {
            script: "The goal of the game is to try do as many toe touching stretches as you can under one minute. They arent just your lazy, average stretches though.",
            changeMood: "middle"
        }
    },
    // 20
    {
        scene: {
            script: "Youll only get a point if youve successfully reached down to press both buttons, and then come up to the camera and give me a smile. No smiles, no points.",
            changeMood: "middle"
        }
    },
    // 21
    {
        scene: {
            script: "Lets do it! You have 1 minute to get the most points as you can. There will be a reward at the end, and it will absolutely not involve grief counseling and black forest cake.",
            changeMood: "middle"
        }
    }
    
    
    /*
    Examine the diagram in your Fitness Inquiry field
,
    // 17
    {
        scene: {
            script: "Sorry ive had a very long day and the cafeteria is always out of cat poop coffee.",
            changeMood: "middle"
        }
    },
    // 18
    {
        scene: {
            script: "Oh! I'm so glad youve decided to stay after all! I had a feeling you would be.",
            changeMood: "middle"
        }
    },
    // add in something about fitbit and stuff
    // do some calculations here The average Australian takes 9,695 steps per day, the average Japanese 7,168, and the average Swiss 9,650, while the average American takes only 5,117 steps per day.
    // fitbit jawbone. echo the style of that inaugural qs ted talk.

    // 19
    {
        scene: {
            script: "By the way you can leave now if this sounds too challenging. Boohoohoo my name is userfirstname and eyem so lazy and sad all the time boohoohoo.",
            changeMood: "middle"
        }
    },
    
    // 21
    {
        scene: {
            script: "WE ALL KNOW WE NEED TO TAKE BREAKS WHEN WE WORK IN FRONT OF THE COMPUTER. We make excuses like, Oh but Ive got a deadline! Or eyem knee deep in code! Or even worse, I cant stop scrolling on facebook! Ha ha.",
            changeMood: ""
        }
    },
    // 22
    {
        scene: {
            script: "Studies show that sitting down for more than three hours a day can shorten our lifespans by two years?",
            changeMood: ""
        }
    },
    // 23
    {
        scene: {
            script: "Follow the little man on the right hand side of the screen, heel show you what to do. Earn a new badge by successfully completing a full stretch.",
            changeMood: "middle"
        }
    },
    // 24
    {
        scene: {
            script: "That means pressing down on those two white buttons in front of your feet and then come up to the camera and give me a nice and big happy smile.",
            changeMood: "middle"
        }
    },
    // 25
    {
        scene: {
            script: "Eyell base your assessment on the average of your cumulative Emotion Analysis.",
            changeMood: "middle"
        }
    }
*/
    
    /*
{
        scene: {
            script: "Weve designed a series of badges to reward you on your progress! Great Your Not a Zombie badge for your resting heart rate of BPM, and a Meh Whatever, on your emotion analysis result of initSmilingScore.",
            //script: "Weve designed a series of badges to reward you on your progress! Great Your Not a Zombie badge for your resting heart rate of BPM, and a Meh Whatever, on your emotion analysis result of initSmilingScore.",
            changeMood: "middle"
        }
    },
*/
/*    {
         My algorithm has been remotely updated. Now you will have to.. <-- Nest reference
    } */

    // reveal "USER NAME"


    // add stuff about browsercize research (mini breaks and health related stuff) in here.

    // My algorithm has been remotely updated. Now you will have to.. <-- Nest
    // Seems like you were active on your pedometer for ___ and youve taken x amount of steps. <-- this can be default for everyone.
    // If you do well on thsi round then we'll go to the EXTENDED AFTERLIFE KARMATIC REVIEW!
    //
];
