$(document).ready(function() {
    var sitting = false;
    
    var userSittingBool = false;
    var userGotName = false;
    
    var loop = 0;
    
    // Google Speech to Text
    var username = "";
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var current_style;
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    var first_char = /\S/;
    
    var interaction;
    
    // Google Text to Speech
    var speech = new SpeechSynthesisUtterance('hi');
     
    var scenes = {
        0 : {
            script: "Thanks for applying to NetNastics Workplace Wellness Solutions! Eyem Judy and eyel be conducting your interview today. Itll only take a few minutes, why doent you have a seat?",
            interaction: "sit",
            visible: ""
            
        },
        
        1 : {
            script: "Haay sorry about this but I cant find you in my schedule. There is a microphone on the desk. Type your first and last name so I can pull up your records.",
            interaction: "type",
            visible: ".block_nameInput"
        },
        
        2 : {
            script: "Oh yes. username, its so great to meet you. Too bad you never met the original Judy. She passed away five years ago but luckily the team was able to have her uploaded to the system before she expired. Or else I woodent be here right now! Hah hah hah.",
            interaction: "repeat",
            visible: "base"
        },
        
        3 : {
            script: "Eyem Judy and eyel be training you. Too bad you never met the original Judy. She passed away 5 years ago but luckily the team was able to have her uploaded to the system before she expired. Or else I woodent be here right now! Hah hah hah.",
            interaction: "none",
            visible: "base"
        },
        
        4 : {
            script: "What can you tell me about your time studying design at ",
            interaction: "none",
            visible: "base"
        },
        
        5 : {
            script: "HALtech is a great place for designers fresh out of college not only because we are leaders in the creative industry, but also because we take pride in our employees’ happiness. Happy employees equal happy customers. No brainer right?",
            interaction: "none",
            visible: "base"
        },  
        
        6 : {
            script: "Your probably wondering how we plan to live up to that promise. Your work day is long, and you get distracted. Trust me, we understand. Weave all been there. Thats why we’ve come up with an exciting set of games to keep you motivated and feeling positive. Just so you know, we expect every member of the HALtech family to play these games. Wheell let you know how well your stacking up and give you a cumulative score at the end of this training session.",
            interaction: "none",
            visible: "base"
        },  
        
        7 : {
            script: "The first activity is to sing the company anthem at the beginning and the end of each day. We like to think of this as a mini break from your usual workload. Let’s give this a run through. Repeat after me.",
            interaction: "none",
            visible: "base"
        },
        
        8 : {
            script: "We are the best at what we do. Because HALtech’s love is strong and true",
            interaction: "none",
            visible: "base"
        },  
    }
    

    var socket = io.connect("/");

    // scene 0
    socket.on("userPresence", function(userPresence) {
        
        if(userPresence == "1") {
            haveUser();
            initSystem(loop);
        } else if(userPresence == "0") {
            waitingForUser();
        }       
    });
    
    
    function haveUser() {
        $('.screen').removeClass('screen-dark').addClass('screen-gradient');
        
        
        setInterval(function() {
            var hue = Math.floor(Math.random() * 5) * 12;
            $('.screen-gradient').css('background-color','hsl(20,'+ hue + '%,50%)').css('-webkit-transition','all 0.3s');
        }, 300);
        
        
        $('.logo').css('display', 'none');
    }
    
    function waitingForUser() {
        $('.screen').removeClass('screen-gradient').addClass('screen-dark');
        $('.logo').css('display', 'block');
        $('.script').css('display', 'none');
    }

    
    function initSystem(loop) {

        speech.text = scenes[loop].script;
        
        // Look for 'username' from the incoming text and replace it with the username sent in from the speech to text
        speech.text = speech.text.replace(/username/g, username);
        speechSynthesis.speak(speech);
        
        checkInteraction(loop);   
    }
    
    
    function checkInteraction(loop) {
        console.log("loop: " + loop);
        interaction = scenes[loop].interaction;
        visible = scenes[loop].visible;
        
        $(visible).css('display','block');
        
        if(interaction == 'sit') {
            socket.on("userSitting", function(userSitting) {
                // if the user is sitting now
                if(userSitting >= 800 && userSitting <= 1023 && userSittingBool == false) {
                    console.log("sitting down now");
                    nextScene(loop);
                    userSittingBool = true; 
                }
            });
        } else if(interaction == 'type') {
            
            $('#form_nameInputSubmit').on('click', function() {
                if(userGotName == false) {
                    storeName(username);
                    // retriving username...need to write in a function
                    username = localStorage.username;
                    username = JSON.parse(username);
                    nextScene(loop);
                    
                    userGotName = true;
                } 
            });
            
        } else if(interaction == 'repeat') {
            console.log('repeat');
        }
        
    }
    
    function nextScene(loop) {
        loop++;
        console.log("loop++: " + loop);
        initSystem(loop);
    }

    function storeName(username) {
        username = $('#form_nameInput').val();
        username = JSON.stringify(username);
        localStorage.username = username;
    }
    

        
    ////////////////////////// Emotion detection
    /*

    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d'); // check and set up video/webcam 

    $('#start_button').on('click', function() {
        startButton(event);
    });
    
    function enablestart() {
        var startbutton = document.getElementById('startbutton');
        startbutton.value = "start";
        startbutton.disabled = null;
    }
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
            //insertAltVideo(vid);
            alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
        });
    } else {
        //insertAltVideo(vid);
        alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
    }
    vid.addEventListener('canplay', enablestart, false); // setup of emotion detection
    var ctrack = new clm.tracker({
        useWebGL: true
    });
    ctrack.init(pModel);
    

    function startVideo() {
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
        //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
        if (ctrack.getCurrentPosition()) {
            ctrack.draw(overlay);
        }
        var cp = ctrack.getCurrentParameters();
        var er = ec.meanPredict(cp);
        if (er) {
            updateData(er);
            for (var i = 0; i < er.length; i++) {
                if (er[i].value > 0.4) {
                    document.getElementById('icon' + (i + 1)).style.visibility = 'visible';
                } else {
                    document.getElementById('icon' + (i + 1)).style.visibility = 'hidden';
                }
            }
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
    var svg = d3.select("#emotion_chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
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

    function updateData(data) {
        // update
        var rects = svg.selectAll("rect").data(data).attr("y", function(datum) {
            return height - y(datum.value);
        }).attr("height", function(datum) {
            return y(datum.value);
        });
        var texts = svg.selectAll("text.labels").data(data).attr("y", function(datum) {
            return height - y(datum.value);
        }).text(function(datum) {
            return datum.value.toFixed(1);
        });
        // enter 
        rects.enter().append("svg:rect");
        texts.enter().append("svg:text");
        // exit
        rects.exit().remove();
        texts.exit().remove();
    } // stats 
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('container').appendChild(stats.domElement);
    // update stats on every iteration
    document.addEventListener('clmtrackrIteration', function(event) {
        stats.update();
    }, false);
*/
        
});


