$(document).ready(function() {
    var sitting = false;
    var userSittingBool = false;
    var userNameBool = false;
    var userLinkedInBool = false;
    var listen1 = false;
    var loop = 0;
    var username = "";
    var userlastname = "";
    var schoolname = "";
    var linkedInJobTitle = "";

    var interaction;
    var speech = new SpeechSynthesisUtterance('hi');
    
    var scenes = [
        { 
            scene: {
                script: "Thanks for applying to NetNastics Workplace Wellness Solutions! Eyem Judy and eyel be conducting your interview today. Itll only take a few minutes, why doent you have a seat?",
                interaction: "sit",
                visible: ""
            }
        },
        {
            scene: {
                script: "Haay sorry about this but I cant find you in my schedule. Fill out the form on my screen so I can pull up your records.",
                interaction: "type",
                visible: ".block_fieldInput"
            }
        },
        {
            scene: {
                script: "Oh yes. username, its so great to meet you. Eyem Judy. too bad you never met the original. She passed away five years ago but luckily the team was able to have her uploaded to the system before she expired. Or else I woodent be here right now! Hah hah hah.",
                interaction: "linkedin",
                visible: ""
            }
        },
        {
            scene: {
                script: "I just took a quick glance at your resume and everything looks pretty good. Your experience as a jobtitle will be great for this position. We also saw from your application that yoov got a great smile. Can you show me that smile again?",
                interaction: "listen1",
                visible: ""
            }
        }
    ];
    
    
    
    var socket = io.connect("/");
    // scene 0
    socket.on("userPresence", function(userPresence) {
        if (userPresence == "1") {
            haveUser();
            initSystem(loop);
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
    
    function initSystem(loop) {
        speech.text = scenes[loop].scene.script;
                    
        // Look for 'username' from the incoming text and replace it with the username sent in from the speech to text
        speech.text = speech.text.replace(/username/g, username);


        speechSynthesis.speak(speech);
        checkInteraction(loop);
    }
    
    function debug(loop) {
        console.log("loop: " + loop);
    }
    
    function displayVisible(loop) {
        visible = scenes[loop].scene.visible;
        $(visible).css('display', 'block');
    }
    
    function checkInteraction(loop) {
        debug(loop);
        interaction = scenes[loop].scene.interaction;
        displayVisible(loop);        
        
        if (interaction == 'sit') {
            socket.on("userSitting", function(userSitting) {
                // if the user is sitting now
                if (userSitting >= 800 && userSitting <= 1023 && userSittingBool == false) {
                    nextScene(loop);
                    userSittingBool = true;
                }
            });
        } else if (interaction == 'type') {
            $('#form_submit').on('click', function() {
                if (userNameBool == false) {
                    storeValues(username, userlastname, schoolname);
                    // retriving username...need to write in a function
                    username = localStorage.username;
                    username = JSON.parse(username);
                    
                    userlastname = localStorage.userlastname;
                    userlastname = JSON.parse(userlastname);
                    
                    schoolname = localStorage.schoolname;
                    schoolname = JSON.parse(schoolname);
                    
                    
                    nextScene(loop);
                    console.log('type name: ' + username + userlastname + schoolname);
                    userNameBool = true;
                }
            });
        } else if (interaction == 'linkedin') {
            if (userLinkedInBool == false) {
                onLinkedInLoad();                  
                onLinkedInAuth(username, userlastname, schoolname);    
                nextScene(loop);
                
                userLinkedInBool = true;
            }    
        } else if (interaction == 'listen1') {
            if (listen1 == false) {
                console.log('just listen');
                nextScene(loop);
                listen1 = true;
/*             startVideoStuff(); */    
            }
            
        }
    }

    function nextScene(loop) {
        loop++;
        initSystem(loop);
    }

    function storeValues(username, userlastname, schoolname) {
        username = $('#form_firstName').val();
        username = JSON.stringify(username);
        localStorage.username = username;
        
        userlastname = $('#form_lastName').val();
        userlastname = JSON.stringify(userlastname);
        localStorage.userlastname = userlastname;
        
        schoolname = $('#form_schoolName').val();
        schoolname = JSON.stringify(schoolname);
        localStorage.schoolname = schoolname;
    
    }
    

    
    ////////////////////////////////////// Linkedin API
    
    
    // 2. Runs when the JavaScript framework is loaded
      function onLinkedInLoad() {
        IN.Event.on(IN, "auth", onLinkedInAuth);
        console.log('crawl linkedin');
      }
    
    // 2. Runs when the viewer has authenticated
      function onLinkedInAuth(username, userlastname, schoolname) {
        IN.API.PeopleSearch()
          .fields("firstName", "lastName", "positions", "educations")
          .params({"first-name": username, "last-name": userlastname, "school-name": schoolname })
          .result(displayPeopleSearch)
          .error(displayPeopleSearchErrors);
      }
    
      // 2. Runs when the PeopleSearch() API call returns successfully
      function displayPeopleSearch(peopleSearch) {
        var peopleSearchDiv = document.getElementById("peoplesearch");
         
        var members = peopleSearch.people.values; // people are stored in a different spot than earlier example
        for (var member in members) {
          // but inside the loop, everything is the same
          // extract the title from the members first position
          console.log(members[member].firstName + " " + members[member].lastName + " is a " + members[member].positions.values[0].title);
          
          linkedInJobTitle = members[member].positions.values[0].title;
          speech.text = speech.text.replace(/jobtitle/g, linkedInJobTitle);          
  
          /*
          // in case we need to store the job title info:
          linkedInJobTitle = JSON.stringify(members[member].positions.values[0].title);
          localStorage.linkedInJobTitle = linkedInJobTitle;
          */
          
        }     
      }
    
      function displayPeopleSearchErrors(error) { /* do nothing */ }


    ////////////////////////////////////// Emotion detection
    
    function startVideoStuff() {
        $('#startbutton').on('click', function() {
            startVideo();
        });
    
        var vid = document.getElementById('videoel');
        var overlay = document.getElementById('overlay');
        var overlayCC = overlay.getContext('2d'); //check and set up video/webcam
    
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
    }
    
});

    
    
    

