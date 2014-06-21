var backup_jobtitle = "Some designer";
var backup_jobcompany = "Some company";
var backup_pictureUrl = "https://media.licdn.com/mpr/mpr/wc_200_200/p/4/000/184/315/067481e.jpg";

// self monitoring..

var s_dialogue = [
    // 0
    {
        scene: {
            script: "Are you unhappy at work? Do you wish your job was more fun? We are Taylor Health and we want to make your happiness our number one priority, Step onto the platform to learn more!",
            changeMood: "up"
        }
    },
    // 1
    {
        scene: {
            script: "I am your fitness emotion inquiry. You can call me Faye.",
            changeMood: "up"
        }
    },
    // 2
    {
        scene: {
            script: "Eyem pulling up your employment history, userfirstname. Just give me one second.",
            changeMood: "middle"
        }
    },
    // 3
    {
        scene: {
            script: "Okay, got it. Youve worked at jobcompany as a jobtitle, thats really impressive!",
            changeMood: "middle"
        }
    },
    // 4
    {
        scene: {
            script: "Eyem going to import your Employee Stress Profile into the Health Assessment Dashboard so we can go through your pain threshold together.",
            changeMood: "middle"
        }
    },
    // 5
    {
        scene: {
            script: "Oh, wait a minute, theres none on your record. However your resumay looked great so eyell make an exception.", 
            changeMood: "down"
        }
    },
    // 6
    {
        scene: {
            script: "Lets just create a profile now, itll only take a few minutes. Note, userfirstname userlastname agrees to let the F E I use his or her emotional and physical performance results to build an employment profile.",
            changeMood: "up"
        }
    },
    // 7
    {
        scene: {
            script: "Oh and just so you know, this will stay on your record for the next five years, kind of like a DUI, so try not to fuck it up! Haha justkidding, wheres your sense of humor!",
            changeMood: "up"
        }
    },
    // acquired applicent's consent.
    // Show the camera your eye. pupil dilation of
    // blow one breath of air into that tube. internal moisture level of
    // 
    // 8
    {
        scene: {
            script: "Put your index finger into the Inquiry apparatus. I need to measure your resting heart rate.",
            changeMood: "middle"
        }
    }, 
    // 9
    {
        scene: {
            script: "Ok, you can take your finger out now. Step back and look into the camera. Give me your biggest, happiest, and most genuine smile. ",
            changeMood: "middle"
        }
    },
    // 10
    {
        scene: {
            script: "An average of initSmilingScore? Honestly eyem disappointed. I thought you could do better than that! You should really be aiming for at least a doubleInitSmilingScore! nevermind a room, your smile couldent even light up an l e d.",
            changeMood: "middle"
        }
    },
    // 11
    {
        scene: {
            script: "But I think theres still a place for you at Taylor. Lets see if you can do better at the next part of the assessment.", // in case you can't find it, it's the blinky thing thats shaped like feet
            changeMood: "middle"
        }
    },
    // 12 
    {
        scene: {
            script: "Match up your feet with the illustrations on the fitness apparatus to get started, unless your too scared of change.",
            changeMood: "middle"
        }
    },
    // 13
    {
        scene: {
            script: "Thank god. I'm so glad youve decided to stay after all! I had a feeling you would. I measured your endorphin levels earlier and they are dangerously low! This could really do you some good.",
            changeMood: "middle"
        }
    },
    // 14
    {
        scene: {
            script: "Look down on the mat and find the two white buttons. I know you want to press them, but please wait until i explain the rules first.",
            changeMood: "middle"
        }
    },
    //  agree that regular exercise is associated with improved mental well-being and a lower incidence of depression.
    //The first is to increase 
    // {
    //     scene: {
    //         script: "The game is called Browsersize and was made by a promising young upstart on our team who wanted to help all of us stay active while we work. Get it, Browser and Exercize?",
    //         changeMood: "middle"
    //     }
    // },
    //  

    // 15
    {
        scene: {
            script: "The goal of this game is to do as many stretches as you can under one minute. the game is really easy, eyem sure someone of your intelligence can understand the simple instructions.",
            changeMood: "middle"
        }
    },
    // 16
    {
        scene: {
            script: "Press down both buttons, and then come up to the camera and give me a really big smile. Look at the bar beneath your video feed, youll only get a point when a yellow box appears there.",
            changeMood: "middle"
        }
    },
    // 17
    {
        scene: {
            script: "Remember, no smiles, no points. You like really fast, panic inducing music, doent you? Ready, set, go! Goodluck!",
            changeMood: "middle"
        }
    },
    // 18
    {
        scene: {
            script: "Wasent that fun! Wonder how that Google Employee got a sore face from smiling? Imagine doing this twenty four seven, 356 days a year!",
            changeMood: "middle"
        }
    },
    // 19
    {
        scene: {
            script: "Running fitness emotion inquiry diagnosis for user first name.",
            changeMood: "middle"
        }
    },
    // 20
    {
        scene: {
            script: "Oh my god, did I just say user first name? I didn't mean that. I think I meant userfirstname. Your name is userfirstname right? Yes. Yes it is, I have it right here in my database.",
            changeMood: "middle"
        }
    },
    // 21
    {
        scene: {
            script: "Aha here we go. I'm sorry to say that with scores this low, I cannot offer you the digital unicorn position at our company. ",
            changeMood: "middle"
        }
    },
    // 22
    {
        scene: {
            script: "Thank you for applying. I urge you to try again at a later date after your attitude adjustment.",
            changeMood: "middle"
        }
    },

    

    // add stuff about browsercize research (mini breaks and health related stuff) in here?

    // My algorithm has been remotely updated. Now you will have to.. <-- Nest
    // Seems like you were active on your pedometer for ___ and youve taken x amount of steps. <-- this can be default for everyone.
    // If you do well on thsi round then we'll go to the EXTENDED AFTERLIFE KARMATIC REVIEW!
    //
];
