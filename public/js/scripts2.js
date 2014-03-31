$(document).ready(function() {
    var speech = new SpeechSynthesisUtterance('hi');
    var loop = 0;
    var sitBool = false;
    var typeBool = false;
    var linkedinBool = false;
    var smile1Bool = false;
    var listen1Bool = false;
    var smile1AnalysisBool = false;
    
    var user = {
        firstname: null,
        lastname: null,
        schoolname: null,
        jobtitle: null,
        initialSmileScore: null
    }
    var scenes = [{
        scene: {
            script: "Have a seat?",
            interaction: "sit",
            visible: ""
        }
    }, {
        scene: {
            script: "type your name",
            interaction: "type",
            visible: ".block_fieldInput"
        }
    }, {
        scene: {
            script: "Oh yes. firstname, its so great to meet you.",
            interaction: "linkedin",
            visible: "#content"
        }
    }, {
        scene: {
            script: "Your experience as a jobtitle will be great for this position. Show me that smile again?",
            interaction: "smile1",
            visible: ""
        }
    }, {
        scene: {
            script: "Wonderful, that smile will come in handy.",
            interaction: "listen1",
            visible: ""
        }
        
    }];
    var socket = io.connect("/");
    // scene 0
    socket.on("userPresence", function(userPresence) {
        if (userPresence == "1") {
            haveUser();
            botSpeak(0);
        } else if (userPresence == "0") {
            waitingForUser();
        }
    });
    enableCamera();

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

    function checkInteraction(loop) {
        console.log(loop);
        interaction = scenes[loop].scene.interaction;
        if (interaction == "sit") {
            socket.on("userSitting", function(userSitting) {
                if (userSitting >= 800 && userSitting <= 1023 && sitBool == false) {
                    console.log("user sitting down");
                    nextScene(loop)
                    sitBool = true;
                }
            });
        } else if (interaction == "type") {
            console.log("the user needs to type");
            $('#form_submit').on('click', function() {
                storeFormVals();
                hideVisible(loop);
                nextScene(loop)
            });
        } else if (interaction == "linkedin" && linkedinBool == false) {
            linkedinBool = true;
            console.log('crawl linkedin');
            onLinkedInLoad();
            onLinkedInAuth();
            nextScene(loop);
        } else if (interaction == "smile1" && smile1Bool == false) {
            smile1Bool = true;
            console.log('check smile');
            startVideo();
            localStorage.initialSmileScore = user.initialSmileScore;
            console.log(user.initialSmileScore);
/*             console.log(user.initialSmileScore); */
            //nextScene(loop); 
        } else if (interaction == "listen1" && listen1Bool == false) {
            listen1Bool = true;
            console.log(user.initialSmileScore)
            console.log('just listen');
        }
    }

    function nextScene(loop) {
        loop++;
        botSpeak(loop);
    }

    function botSpeak(loop) {
        //  console.log('loop: ' + loop);
        speech.text = scenes[loop].scene.script;
        speech.text = speech.text.replace(/firstname/g, user.firstname);
        speechSynthesis.speak(speech);
        checkInteraction(loop);
        speech.onend = function(event) {
            // console.log("finished speaking");
            displayVisible(loop);
        }
    }

    function displayVisible(loop) {
        visible = scenes[loop].scene.visible;
        $(visible).css('display', 'block');
    }

    function hideVisible(loop) {
        visible = scenes[loop].scene.visible;
        $(visible).css('display', 'none');
    }

    function storeFormVals() {
        user.firstname = $('#form_firstName').val();
        user.lastname = $('#form_lastName').val();
        user.schoolname = $('#form_schoolName').val();
    }
    ////////////////////////////////////// Linkedin API

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
        var members = peopleSearch.people.values; // people are stored in a different spot than earlier example
        for (var member in members) {
            //   console.log(members[member].firstName + " " + members[member].lastName + " is a " + members[member].positions.values[0].title);
            user.jobtitle = members[member].positions.values[0].title;
            speech.text = speech.text.replace(/jobtitle/g, user.jobtitle);
        }
    }
    function displayPeopleSearchErrors(error) { /* do nothing */}
    
    ////////////////////////////////////// Emotion detection
    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d'); //check and set up video/webcam

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
                //insertAltVideo(vid);
                alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
            });
        } else {
            //insertAltVideo(vid);
            alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
        }
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
        
        var initialSmileScore = data[3].value;
        
        storeSmileData(initialSmileScore);
        // enter 
        rects.enter().append("svg:rect");
        texts.enter().append("svg:text");
        // exit
        rects.exit().remove();
        texts.exit().remove();
    }

    function storeSmileData(initialSmileScore) {
        localStorage.initialSmileScore = initialSmileScore;
            
/*             smile1AnalysisBool = true; */
          /*
  speech.text = "Okay good now show me more teeth.";
            speechSynthesis.speak(speech);
*/
        
        
        /*
if (initialSmileScore > 0.20 && initialSmileScore < 0.40) {
            console.log("try harder"); //console.log(data[3].value);  
        } else if (initialSmileScore > 0.41 && initialSmileScore < 0.60) {
            // if they're smiling for longer than x seconds, then proceed to the next line
            // can still track smile even if the user is talking
            console.log("okay");
        }
*/
    }
    // stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('container').appendChild(stats.domElement);
    // update stats on every iteration
    document.addEventListener('clmtrackrIteration', function(event) {
        stats.update();
    }, false);
    //}
});