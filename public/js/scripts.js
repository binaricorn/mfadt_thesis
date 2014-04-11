$(document).ready(function() {
    var user = {
        firstname: null,
        lastname: null,
        schoolname: null,
        jobtitle: null,
        jobcompany: null,
        standing: false,
        passInitSmilingTest: false,
        initSmilingScore: null
    }
    
    var highVal = 0;
    
    var target_phrase = ["You", "Love", "Us"];
    
    var instructionsVar = [];
    
    var instructionsScript = [
        // 0
        "Thanks for applying to NetNastics Workplace Wellness Solutions! My names Fei and isle be conducting your interview today, itll only take a few minutes. Put your feet on the mat and wheel get started.",
        // 1
        "Do me a favor and fill out this form so I can pull up your records?",
        // 2
        "Hi username, the original Fei would have loved to meet you, she suffered a disruption to her system 5 years ago but luckily our team was able to have her uploaded before she expired.",
        // 3
        "Your experience as a jobtitle at jobcompany is perfect for this position. But we have no way of knowing without seeing your smile. Can you show us your smile for one minute starting now?",
        // 4
        "It is shown in scientific studies that smiling can greatly reduce stress.",
        // 5
        "Alright thats good for now. Your smile was a initSmilingScore out of 100, but I think you can do better!",   
        // 6
        "Now lets see how well you do in our fitness emotion inquiry. Read the text that appears loudly and clearly. Remember to smile while youre doing it. Try to show more teeth this time.",
        // 7
        "Touch the yellow buttons! After you do that, look at the camera, smile, and say the target phrase again.",
        // 8
        "Thats why weeve come up with an exciting set of games to keep you motivated and feeling positive. We expect every member of the NetNastics family to play these games.",
        // 9
        "We want everyone to live up to the motto and become employees who can represent the NetNastics brand with pride!",
        // 10
        "The first activity is to sing the company anthem at the beginning and the end of each day. Itll keep your eyes on the prize. Lets give this a quick run through. Repeat after me.",
        // 11
        "alright now lets try that with a smile"
    ]
    
    for(i = 0; i < instructionsScript.length; i++) {
        instructionsVar[i] = new SpeechSynthesisUtterance(instructionsScript[i]);
    }

    
    var counter;
    var smiling1Level1Counter = 0;
    var checkingPass = false;
    
    var user = {
        firstname: null,
        lastname: null,
        schoolname: null,
        jobtitle: null,
        jobcompany: null,
        standing: false,
        passInitSmilingTest: false,
        initSmilingScore: null
    }
    
    

    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d'); //check and set up video/webcam
    
    vid.addEventListener('canplay', enablestart, false); // setup of emotion detection
    var ctrack = new clm.tracker({
        useWebGL: true
    });
    ctrack.init(pModel);
    
    var socket = io.connect("/");
    // scene 0
    socket.on("userPresence", function(userPresence) {
        if (userPresence == "1") {
            haveUser();
            enableCamera();
            botSpeak(instructionsVar[0]);
            instructionsVar[0].onend = function(event) {
                checkInteraction(0);
            }
        } else if (userPresence == "0") {
            waitingForUser();
        }
    });

    function haveUser() {
        $('.screen').removeClass('screen-dark').addClass('screen-gradient');
        setInterval(function() {
            var hue = Math.floor(Math.random() * 5) * 12;
            $('.screen-gradient').css('background-color', 'hsl(20,' + hue + '%,50%)').css('-webkit-transition', 'all 0.3s');
        }, 300);
        $('.logo').css('display', 'none');
    }

    function waitingForUser() {
        $('.screen').removeClass('screen-gradient').addClass('screen-dark');
        $('.logo').css('display', 'block');
        $('.script').css('display', 'none');
    }
    
    function botSpeak(str) {
        str.text = str.text.replace(/username/g, user.firstname);
        str.text = str.text.replace(/jobtitle/g, user.jobtitle);
        str.text = str.text.replace(/jobcompany/g, user.jobcompany);
        str.text = str.text.replace(/initSmilingScore/g, user.initSmilingScore);
        speechSynthesis.speak(str);
    }
    
    function checkInteraction(counter) {
        switch(counter) {
            case 0:
                socket.on("userStanding", function(userLeftFoot, userRightFoot) {
                    if(userLeftFoot >= highVal && userRightFoot >= highVal && user.standing == false) {
                        user.standing = true;
                        console.log("user is standing at the rihgt place");
                        checkInteraction(1);
                    }
                });
                break;
            case 1:
                botSpeak(instructionsVar[1]);
                displayElements('.block_fieldInput');
                $('#form_submit').on('click', function() {
                    storeFormVals();
                    checkInteraction(2);
                });
                break;
            case 2:
                hideElements('.block_fieldInput');
                botSpeak(instructionsVar[2]);
                onLinkedInLoad();
                onLinkedInAuth();
                console.log("crawl linkedin");
                break;
            case 3:
                botSpeak(instructionsVar[3]);
                botSpeak(instructionsVar[4]); 
                instructionsVar[3].onend = function(event) {
                    console.log("stopped speaking");
                    startVideoTracking();
                }
                       
                break;
            case 4:
                hideElements('.block_fieldInput');
                user.initSmilingScore = user.initSmilingScore * 100;
                $("#percentage").text(user.initSmilingScore + " / 100");
                checkInteraction(5);
                break;
            case 5:
                hideElements('#content'); 
                console.log(user.initSmilingScore); // your smile score                
                botSpeak(instructionsVar[5]);
                instructionsVar[5].onstart = function(event) {
                    displayElements("#percentage");
                    checkInteraction(6);
                }
                break;
            case 6:
                botSpeak(instructionsVar[6]);
                instructionsVar[6].onstart = function(event) {
                    feiTest();
                }
                break;
            case 7:
                botSpeak(instructionsVar[7]);
                buttonsPressed();
                break;

            /*
            case 6:
                botSpeak(instructionsVar[5]);
                botSpeak(instructionsVar[6]);
                botSpeak(instructionsVar[7]);
                botSpeak(instructionsVar[8]);
                botSpeak(instructionsVar[9]);
                instructionsVar[9].onend = function(event) {
                    $('#target').text(target_phrase[0] + " " + target_phrase[1] + " " + target_phrase[2]);
                    startButton(event);
                    displayElements('#speech_detection');
                    hideElements("#emotion_container");
                }
                break;
            case 7:
                displayElements('#content');    
                displayElements('#emotion_container');
                botSpeak(instructionsVar[10]);
                break;
*/
        }
    }
    
    function displayElements(elem) {
        $(elem).css('display','block');
    }
    
    function hideElements(elem) {
        $(elem).css('display','none');
    }
    
    function storeFormVals() {
        user.firstname = $('#form_firstName').val();
        user.lastname = $('#form_lastName').val();
        user.schoolname = $('#form_schoolName').val();
    }
    
   
    
    //////////////////////////////////////////////////////////////// Linkedin API

    function onLinkedInLoad() {
        IN.Event.on(IN, "auth", onLinkedInAuth);
    }
    function onLinkedInAuth() {
        IN.API.PeopleSearch().fields("firstName", "lastName", "positions", "educations").params({
            "first-name": user.firstname,
            "last-name": user.lastname,
            "school-name": user.schoolname
        }).result(displayPeopleSearch).error(displayPeopleSearchErrors);
    }
    function displayPeopleSearch(peopleSearch) {
        var peopleSearchDiv = document.getElementById("peoplesearch");
        var members = peopleSearch.people.values;
        for (var member in members) {
            
            // console.log(members[member].firstName + " " + members[member].lastName + " is a " + members[member].positions.values[0].title);
            console.log(members[member].positions.values[0].company.name);
            user.jobcompany = members[member].positions.values[0].company.name;
            user.jobtitle = members[member].positions.values[0].title;
            checkInteraction(3);
        }
    }
    function displayPeopleSearchErrors(error) { /* do nothing */}
    
    
    function buttonsPressed() {
        socket.on("userButtonsPressed", function(userLeftButton, userRightButton) {
            if(userLeftButton == 1 && userRightButton == 1) {
                console.log("buttons pressed");
                startButton(event);
            }
        });
        
    }
    
    //////////////////////////////////////////////////////////////// Camera and emotion tracking
    
    function enablestart() {
        var startbutton = document.getElementById('startbutton');
        startbutton.value = "start";
        startbutton.disabled = null;
    }
    
    function enableCamera() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
        // check for camerasupport
        if (navigator.getUserMedia) {
            // set up stream
            var videoSelector = {
                video: true
            };
            if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
                var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
                if (chromeVersion < 20) {
                    videoSelector = "video";
                }
            };
            navigator.getUserMedia(videoSelector, function(stream) {
                if (vid.mozCaptureStream) {
                    vid.mozSrcObject = stream;
                } else {
                    vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                }
                vid.play();
            }, function() {
                alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
            });
        } else {
            alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
        }
    }
    
    function startVideoTracking() {
        // start video
        vid.play();
        // start tracking
        ctrack.start(vid);
        // start loop to draw face
        drawLoop();
    }

    function drawLoop() {
        requestAnimFrame(drawLoop);
        overlayCC.clearRect(0, 0, 400, 300);
        if (ctrack.getCurrentPosition()) {
            ctrack.draw(overlay);
        }
        var cp = ctrack.getCurrentParameters();
        var er = ec.meanPredict(cp);
        if (er) {
            updateData(er);
        }
    }
    var ec = new emotionClassifier();
    ec.init(emotionModel);
    var emotionData = ec.getBlank(); // d3 code for barchart
    var margin = {
        top: 20,
        right: 20,
        bottom: 10,
        left: 40
    },
        width = 400 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom;
    var barWidth = 30;
    var formatPercent = d3.format(".0%");
    var x = d3.scale.linear().domain([0, ec.getEmotions().length]).range([margin.left, width + margin.left]);
    var y = d3.scale.linear().domain([0, 1]).range([0, height]);
    var svg = d3.select("#emotion_chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    svg.selectAll("rect").
    data(emotionData).
    enter().
    append("svg:rect").
    attr("x", function(datum, index) {
        return x(index);
    }).
    attr("y", function(datum) {
        return height - y(datum.value);
    }).
    attr("height", function(datum) {
        return y(datum.value);
    }).
    attr("width", barWidth).
    attr("fill", "#2d578b");
    
    /*
Text labels for emotion values
svg.selectAll("text.labels").
data(emotionData).
enter().
append("svg:text").
attr("x", function(datum, index) {
return x(index) + barWidth;
}).
attr("y", function(datum) {
return height - y(datum.value);
}).
attr("dx", -barWidth / 2).
attr("dy", "1.2em").
attr("text-anchor", "middle").
text(function(datum) {
return datum.value;
}).
attr("fill", "white").
attr("class", "labels");
svg.selectAll("text.yAxis").
data(emotionData).
enter().append("svg:text").
attr("x", function(datum, index) {
return x(index) + barWidth;
}).
attr("y", height).
attr("dx", -barWidth / 2).
attr("text-anchor", "middle").
attr("style", "font-size: 12").
text(function(datum) {
return datum.emotion;
}).
attr("transform", "translate(0, 18)").
attr("class", "yAxis");
*/

    function updateData(data) {
        // update
        var rects = svg.selectAll("rect").data(data).attr("y", function(datum) {
            return height - y(datum.value);
        }).attr("height", function(datum) {
            return y(datum.value);
        });
       /*
var texts = svg.selectAll("text.labels").data(data).attr("y", function(datum) {
return height - y(datum.value);
}).text(function(datum) {
return datum.value.toFixed(1);
});
*/
        
        var smileScore = data[3].value;
        
        analyzeSmileInitialData(smileScore);
        
        // enter
        rects.enter().append("svg:rect");
        //texts.enter().append("svg:text");
        // exit
        rects.exit().remove();
        //texts.exit().remove();
    }
    
    function analyzeSmileInitialData(smileScore) {
        user.initSmilingScore = smileScore;
        if (user.initSmilingScore > 0.2 && user.passInitSmilingTest == false) {
                user.passInitSmilingTest = true;
                checkInteraction(4);
        }
        
        /*
if (smileScore > 0.02 && smileScore < 0.60 && user.passInitSmilingTest == false) {
            // use requestframeanimation here instead of increasing the count like that...
            smiling1Level1Counter++;
            console.log(smiling1Level1Counter);
            if (smiling1Level1Counter > 245) { // smiling for 30 seconds
               user.passInitSmilingTest = true;
               user.initSmilingScore = smileScore;
               checkInteraction(5);
            }
        }
*/
        
    }
    
    /*
// The text stats
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('container').appendChild(stats.domElement);
// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
stats.update();
}, false);
*/


    //////////////////////////////////////////////////////////////// FEI Test

function feiTest() {
    displayElements('#speech_detection');
    displayElements('#content');
    hideElements("#percentage");
    $('#target').text(target_phrase[0] + " " + target_phrase[1] + " " + target_phrase[2]);
    startButton(event);
}


    //////////////////////////////////////////////////////////////// Speech input
    
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onstart = function () {
    recognizing = true;
    start_img.src = 'img/mic-animate.gif';
};
recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        start_img.src = 'img/mic.gif';
        ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        start_img.src = 'img/mic.gif';
        ignore_onend = true;
    }
};
recognition.onend = function () {
    recognizing = false;
    if (ignore_onend) {
        return;
    }
    start_img.src = 'img/mic.gif';
    if (!final_transcript) {
        return;
    }
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
    }
};
recognition.onresult = function (event) {
    var split_final = "";
    var interim_transcript = '';
    var interim_target = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
        showButtons('inline-block');
    }
    split_final = final_transcript.split(" ");
    console.log(final_transcript + " " + split_final);
    testInterim(final_transcript);

};


function testInterim(str) {
    if (str.indexOf(target_phrase[0]) != -1 || str.indexOf(target_phrase[1]) != -1 || str.indexOf(target_phrase[2]) != -1) {
        checkingPass = true;
        recognition.stop();
        console.log(user.initSmilingScore);
        checkInteraction(7);
        //console.log("The function passed");        
    }

}

/*
function testInterim(str, split_str) {
    for (i = 0; i < split_str.length; i++) {
        if (str.indexOf(split_str[i]) != -1) {
            console.log(split_str[i] + "found a matching word");    
        }
        
        
    }
    if (str.indexOf(target_phrase[0]) != -1 || str.indexOf(target_phrase[1]) != -1 || str.indexOf(target_phrase[2]) != -1) {
        checkingPass = true;
        recognition.stop();
        console.log(user.initSmilingScore);
        //console.log("The function passed");        
    }

}
*/

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'img/mic-slash.gif';
    showButtons('none');
    start_timestamp = event.timeStamp;
}
var current_style;

function showButtons(style) {
    if (style == current_style) {
        return;
    }
    current_style = style;
}




    
});