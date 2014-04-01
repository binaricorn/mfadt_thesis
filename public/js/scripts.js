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
    
    var counter;
    var speech = new SpeechSynthesisUtterance('hi');
    var smiling1Level1Counter = 0;
    
    var scenes = [
        "Thanks for applying to NetNastics Workplace Wellness Solutions! My name is Judy. Your interview will only take a few minutes. Place your feet on the platform and we can get started.",
        "Fill out the form so I can pull up your records.",
        "Hello username its nice to meet you.",
        "Your experience as a jobtitle at jobcompany is perfect for this position. I saw a great smile on your file. Lets see that smile for one minute.",
        "that was only a initSmilingScore out of 100, youll have to do better than that!"
    ]
    
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
            botSpeak(scenes[0]);            
            speech.onend = function(event) {
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
    
    function checkInteraction(counter) {
        switch(counter) {
            case 0:
                socket.on("userStanding", function(userLeftFoot, userRightFoot) {
                    if(userLeftFoot >= 600 && userRightFoot >= 600 && user.standing == false) {
                        user.standing = true;   
                        console.log("user is standing at the rihgt place");    
                        checkInteraction(1);    
                    } 
                });
                break;
            case 1:
                botSpeak(scenes[1]); 
                displayElements('.block_fieldInput');
                $('#form_submit').on('click', function() {
                    storeFormVals();
                    checkInteraction(2);        
                });
                break;
            case 2:
                botSpeak(scenes[2]); 
                onLinkedInLoad();
                onLinkedInAuth();
                console.log("crawl linkedin");
                break;
            case 3:
                user.jobtitle = localStorage.jobtitle;
                user.jobtitle = JSON.parse(user.jobtitle);
                user.jobcompany = localStorage.jobcompany;
                user.jobcompany = JSON.parse(user.jobcompany);
                
                botSpeak(scenes[3]); 
                checkInteraction(4);
                break;
            case 4: 
                console.log("check smile");
                hideElements('.block_fieldInput');
                startVideoTracking();
                break;
            case 5:
                hideElements('#content');
                user.initSmilingScore = localStorage.initSmilingScore;
                //user.initSmilingScore = user.initSmilingScore.toFixed(2);
                console.log(user.initSmilingScore);
                botSpeak(scenes[4]); 
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
    
    function botSpeak(str) {
        speech.text = str;
        speech.text = speech.text.replace(/username/g, user.firstname);
        speech.text = speech.text.replace(/jobtitle/g, user.jobtitle);
        speech.text = speech.text.replace(/jobcompany/g, user.jobcompany);
        
        speech.text = speech.text.replace(/initSmilingScore/g, user.initSmilingScore);
        speechSynthesis.speak(speech);
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
            
            //   console.log(members[member].firstName + " " + members[member].lastName + " is a " + members[member].positions.values[0].title);
            console.log(members[member].positions.values[0].company.name);
            user.jobcompany = members[member].positions.values[0].company.name;
            user.jobcompany = JSON.stringify(user.jobcompany);
            localStorage.jobcompany = user.jobcompany;
            user.jobtitle = members[member].positions.values[0].title;
            user.jobtitle = JSON.stringify(user.jobtitle);
            localStorage.jobtitle = user.jobtitle;
            checkInteraction(3); 
        }
    }
    function displayPeopleSearchErrors(error) { /* do nothing */}
    
    
    
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
        //console.log(user.passInitSmilingTest);
        
        if (smileScore > 0.02 && smileScore < 0.60 && user.passInitSmilingTest == false) {
            
            smiling1Level1Counter++;
            console.log(smiling1Level1Counter);
            if (smiling1Level1Counter > 145) { // smiling for 30 seconds
               user.passInitSmilingTest = true;
               localStorage.initSmilingScore = smileScore;
               checkInteraction(5);
            }
        } 
        
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

    
});