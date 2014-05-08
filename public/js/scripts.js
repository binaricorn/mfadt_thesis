$(document).ready(function() {
    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d'); //check and set up video/webcam
    vid.addEventListener('canplay', enablestart, false); // setup of emotion detection
    var ctrack = new clm.tracker({
        useWebGL: true
    });
    ctrack.init(pModel);
    var user = {
        firstname: "Bryan",
        lastname: "Ma",
        schoolname: null,
        pictureUrl: backup_pictureUrl,
        jobtitle: backup_jobtitle,
        jobcompany: backup_jobcompany,
        standing: false,
        buttonPressed: false,
        passInitSmilingTest: false,
        initSmilingScoreArray: [],
        initSmilingScore: null,
        globalFrownScore: null,
        globalFrownScoreArray: [],
        globalSmileScore: null,
        doubleInitSmilingScore: null,
        getUserPulse: false,
        BPM: null
    }
    var doLinkedIn = false;
    var highVal = 0;
    var audioElem = $('#audioplay').get(0);
    if (audioElem) audioElem.volume = 0.3;
    var sc_dialogue = [];
    var sc_promo = [];
    var completedStretches = 1;
    var transEnd = "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd";
    var initSmileArray = [];
    var frownScoreArray = [];

    for (i = 0; i < s_dialogue.length; i++) {
        sc_dialogue[i] = new SpeechSynthesisUtterance(s_dialogue[i].scene.script);
    }
    for (i = 0; i < s_promo.length; i++) {
        sc_promo[i] = new SpeechSynthesisUtterance(s_promo[i].scene.script);
    } /* Animation between screens */
    var b = $('.promo .block').length;
    var count = -1;
    for (i = 0; i < b; i++) {
        $(".promo .block").eq(i).css('-webkit-transform', 'translateX(' + i * 100 + '%)');
    }
    var socket = io.connect("/");
    socket.on("userPresence", function(userPresence) {
        if (userPresence == "1") {
            haveUser();
        } else if (userPresence == "0") {
            waitingForUser();
        }
    });

    function haveUser() {
        //botSpeak(sc_dialogue[0]);
        setTimeout(function() { /*             
        loopPromo(count);   */
            /*
onLinkedInLoad();
            onLinkedInAuth();
*/
        checkInteraction(0);
        }, 500);
/*
$('#submission_form').submit(function(e){
           e.preventDefault();
           user.firstname = $('#form_firstName').val();
           user.lastname = $('#form_lastName').val();
           console.log(user.firstname + user.lastname);
           onLinkedInLoad();
           onLinkedInAuth();           
        });
*/
        console.log("found user");
    }

    function waitingForUser() {
        console.log("waiting");
    }

    function loopPromo(count) {
        if (count < (s_promo.length) - 1) {
            count++;
            botSpeak(sc_promo[count]);
            sc_promo[count].onend = function(event) {
                if (count < (s_promo.length) - 1) {
                    $(".promo .block").eq(count).addClass('slide').css('-webkit-transform', 'translateX(-100%)');
                    $(".promo .block").eq(count + 1).addClass('slide').css('-webkit-transform', 'translateX(0%)');
                }
            }
            $(".promo .block").eq(count).on(transEnd, function(e) {
                // on the last slide, autofocus the firstname field
                if (count == 5) {
                    $('input#form_firstName').replaceWith('<input type="text" id="form_firstName" placeholder="First name" value="" autofocus/>');
                }
                $(".promo .block").eq(count).off(transEnd);
                loopPromo(count);
            });
        }
    }
    //////////////////////////////////////////////////////////////// Voice
    var voiceSelect = document.getElementById('voice');
    var audioElem = $('#audioplay').get(0);

    function loadVoices() {
        var voices = speechSynthesis.getVoices();
        voices.forEach(function(voice, i) {
            var option = document.createElement('option');
            option.value = "Google UK English Female";
            option.value = voice.name;
            voiceSelect.appendChild(option);
        });
    }
    window.speechSynthesis.onvoiceschanged = function(e) {
        loadVoices();
    };

    function checkInteraction(count) {
        switch (count) {
        case 0:
            hide($('.promo'));
            show($('.sidebar'));
            show($('.dashboard-screen'));
            for (i = 1; i < 12; i++) {
                botSpeak(sc_dialogue[i]);
            }
            sc_dialogue[1].onstart = function(event) {
                $('.dashboard, .sidebar').removeClass('hide').addClass('show');
                voice_visualizer();
            }
            sc_dialogue[3].onend = function(event) {
                displayUser();
            }
            sc_dialogue[4].onend = function(event) {
                $('.sidebar ul li').eq(1).removeClass('highlight');
                $('.sidebar ul li').eq(2).addClass('highlight');
                $('.block_inquiry, .block_fitness, .block_emotion').removeClass('inactive').addClass('show');
            }
            sc_dialogue[6].onstart = function(event) {
                $('.block_inquiry, .block_fitness, .block_emotion').removeClass('show').addClass('inactive');
            }
            sc_dialogue[11].onstart = function(event) {
                $('.block_inquiry').removeClass('inactive').addClass('show');
                checkInteraction(2);
            }
            break;
        case 1:
            socket.on("userHeartRate", function(BPM) {
                if (BPM == "\r") {} else {
                    BPM = BPM.replace("B", "");
                    if (BPM > 50 && BPM < 105 && user.getUserPulse == false) {
                        user.getUserPulse = true;
                        console.log("use this BPM: " + BPM);
                        user.BPM = BPM;
                        checkInteraction(2);
                    }
                }
            });
            break;
        case 2:
            $('.block_emotion').removeClass('inactive').addClass('show');
            botSpeak(sc_dialogue[12]);
            sc_dialogue[12].onstart = function() {
                enableCamera();
                checkInteraction(3);
            }
            $('.resting_bpm').text('Resting BPM: ' + user.BPM);
            break;
        case 3:
            enableCamera();
            hide($('.icon-smile'));
            startVideoTracking();
            setTimeout(function() {
                checkInteraction(4);
            }, 10000);
            break;
        case 4:
            botSpeak(sc_dialogue[13]);
            sc_dialogue[13].onstart = function() {
                doSmileMath(); // passInitSmilingTest = true
                hide($('#overlay'));
                hide($('#emotion_container'));
                checkInteraction(5);
            }
            
            break;
        case 5:
            
            for (i = 14; i < 17; i++) {
                botSpeak(sc_dialogue[i]);
            }
            sc_dialogue[14].onend = function() {
                $('.block_fitness').removeClass('inactive').addClass('show');
                hide($('.overlay'));
            }
            sc_dialogue[15].onstart = function() {
                $('.block_fitness .block').replaceWith('<span class="icon centered"><img src="img/stretch-blur2.gif" class="stretch-gif"/></span>');
            }
            sc_dialogue[16].onend = function() {
                checkInteraction(6);
            }
            break;
        case 6:
            socket.on("userStanding", function(userLeftFoot, userRightFoot) {
                if (userLeftFoot > highVal && userRightFoot > highVal && user.standing == false) {
                    user.standing = true;
                    console.log("user is standing at the rihgt place");
                    checkInteraction(7);
                }
            });
            break;
        case 7:
            
            $('.sidebar ul li').eq(1).removeClass('highlight');
            $('.sidebar ul li').eq(2).removeClass('highlight');
            $('.sidebar ul li').eq(3).addClass('highlight');
            hide($('.block_inquiry'));
            hide($('.block_fitness'));
            show($('#overlay'));
            $('.block_emotion').css('position','static').removeClass('inactive').addClass('show');
            $('.initSmilingScore, .block_emotion h2').css('display','none');
            $('.block_emotion').css('background','none');
            $('.video_container').css({
                'position' : 'absolute',
                'overflow' : 'hidden',
                'top' : '2%',
                'right' : '2%',
                'width' : '400px'
                
            });
            
            show($('#emotion_container'));
            $('#emotion_container').css({
                'position' : 'absolute',
                'top' : '32%',
                'right': '132px' 
            });
            hide('.browsercize_score_container');
            hide('.emotion_graph');
            show($('.block_browsercize'));
            botSpeak(sc_dialogue[17]);
            botSpeak(sc_dialogue[18]);
            botSpeak(sc_dialogue[19]);
            botSpeak(sc_dialogue[20]);
            botSpeak(sc_dialogue[21]);
            botSpeak(sc_dialogue[22]);
            sc_dialogue[22].onend = function() {
                checkInteraction(8);
                $('#audioplay').replaceWith('<audio id="audioplay" loop="loop" autoplay="autoplay" controls="controls" ><source id="audiosrc" src="audio/clowns.mp3" /></audio>'); 
                countdown();
                show('.browsercize_score_container');
            }
        case 8:
            
            socket.on("userButtonsPressed", function(userLeftButton) {
                
                if (userLeftButton == 1) {
                    console.log("Pressed button");
                    user.buttonPressed = true;
                }
                if (user.buttonPressed == true) {
                    waitingForButtonPressSmile();
                }
            });
            break;
        case 9:
            

            doFrownMath();
            botSpeak(sc_dialogue[23]);
            sc_dialogue[23].onstart = function() {
                $('#audioplay').replaceWith('<audio id="audioplay" loop="loop" autoplay="autoplay" controls="controls" ><source id="audiosrc" src="audio/yacht2.m4a" /></audio>');      
                if (audioElem) audioElem.volume = 0.3;           
                getFrownMath();
            }
            
            sc_dialogue[23].onend = function() {
                checkInteraction(10);
            }
            break;
        case 10:
            botSpeak(sc_dialogue[24]);
            botSpeak(sc_dialogue[25]);
            sc_dialogue[25].onstart = function() {
                show($('.calculating'));
                $('.block_browsercize, .block_emotion').removeClass('show').addClass('inactive');
                $('.block_fitness').removeClass('hide').addClass('inactive');
            }
            botSpeak(sc_dialogue[26]);
            //hide($('.calculating'));
            break;
        }
    }

    function waitingForButtonPressSmile() {
        if (user.globalSmileScore > 0.4) {
            user.buttonPressed = false;
            completedStretches++;
            console.log(user.globalSmileScore);
        }
        $('.browsercize_score').text(completedStretches);
        $('.browsercize_score_container').css('height', (completedStretches*5) + '%');        
    }
    
    function countdown() {
        var seconds = 121;
        
        function tick() {
            seconds--;
            $('#countdown').text("00:" + seconds);
/*             counter.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds); */
            if( seconds > 0 ) {
                setTimeout(tick, 1000);
            } else {
                seconds = 0;
                if (seconds == 0) {
                    checkInteraction(9);    
                }
                
            }
        }
        tick();
    }



    function doSmileMath() {
        initSmileArray = user.initSmilingScoreArray;
        user.initSmilingScore = Math.max.apply(Math, initSmileArray);
        user.initSmilingScore = user.initSmilingScore * 100;
        user.initSmilingScore = Math.ceil(user.initSmilingScore * 10) / 10;
        user.doubleInitSmilingScore = user.initSmilingScore * 2;
        console.log(user.initSmilingScore + " double: " + user.doubleInitSmilingScore);
        
        $('.emotion_graph').css('width', user.initSmilingScore + 'px');
        $('.initSmilingScore').text(user.initSmilingScore);
    }
    
    function doFrownMath() {
        frownScoreArray = user.globalFrownScoreArray;
    }
    
    function getFrownMath() {
        user.globalFrownScore = Math.max.apply(Math, frownScoreArray);
        user.globalFrownScore = user.globalFrownScore * 100;
        user.globalFrownScore = Math.ceil(user.globalFrownScore * 10) / 10;
        console.log("frown score: " + user.globalFrownScore);
    }

    function displayUser() {
        $('.profile_photo').html('<img src="' + user.pictureUrl + '"/>');
        $('.profile_title .name').html(user.firstname + " " + user.lastname);
        $('.profile_title .title').text(user.jobtitle + " at " + user.jobcompany);
    }

    function hide(elem) {
        $(elem).removeClass('show').addClass('hide').css('display', 'none');
    }

    function show(elem) {
        $(elem).removeClass('hide').addClass('show').css('display', 'block');;
    }

    function botSpeak(str) {
        str.voice = speechSynthesis.getVoices().filter(function(voice) {
            return voice.name == "Google UK English Female";
        })[0];
        str.text = str.text.replace(/userfirstname/g, user.firstname);
        str.text = str.text.replace(/userlastname/g, user.lastname);
        str.text = str.text.replace(/jobtitle/g, user.jobtitle);
        str.text = str.text.replace(/jobcompany/g, user.jobcompany);
        str.text = str.text.replace(/initSmilingScore/g, user.initSmilingScore);
        str.text = str.text.replace(/doubleInitSmilingScore/g, user.doubleInitSmilingScore);
        str.text = str.text.replace(/userBPM/g, user.BPM);
        speechSynthesis.speak(str);
    }
    //////////////////////////////////////////////////////////////// Linkedin API

    function onLinkedInLoad() {
        IN.Event.on(IN, "auth", onLinkedInAuth);
    }

    function onLinkedInAuth() {
        IN.API.PeopleSearch().fields("firstName", "lastName", "positions", "pictureUrl", "educations").params({
            "first-name": user.firstname,
            "last-name": user.lastname,
            "picture-url": "",
            "count": 1
        }).result(displayPeopleSearch).error(displayPeopleSearchErrors);
    }

    function displayPeopleSearch(peopleSearch) {
        var peopleSearchDiv = document.getElementById("peoplesearch");
        var members = peopleSearch.people.values;
        if (members != null) {
            for (var member in members) {
                if (members[member].positions._total != 0) {
                    user.jobcompany = members[member].positions.values[0].company.name;
                    user.jobtitle = members[member].positions.values[0].title;
                } else {
                    console.log("no position data");
                    user.jobcompany = backup_jobcompany;
                    user.jobtitle = backup_jobtitle;
                }
                if (members[member].pictureUrl != undefined) {
                    user.pictureUrl = members[member].pictureUrl;
                } else {
                    user.pictureUrl = "http://31.media.tumblr.com/tumblr_m20paq9CjN1qbkdcro1_500.png";
                }
            }
        } else {
            console.log("cannot find person on Linkedin");
            user.jobcompany = backup_jobcompany;
            user.jobtitle = backup_jobtitle;
        }
        checkInteraction(0);
    }

    function displayPeopleSearchErrors(error) {
        console.log("error, let's move on");
        user.jobcompany = backup_jobcompany;
        user.jobtitle = backup_jobtitle;
        checkInteraction(0);
    } /* Rainbow Worm via http://mbostock.github.io/protovis/ex/segmented.html */

    function voice_visualizer() {
        var margin = {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100
        },
            width = 700 - margin.left - margin.right,
            // 600 - 200
            height = 200 - margin.top - margin.bottom; // 200 - 200
        var x = d3.scale.linear().domain([0, 5.9]).range([0, width]);
        var y = d3.scale.linear().domain([-1, 1]).range([height, 0]);
        var z = d3.scale.linear().domain([0, 5.9]).range([0, 360]);
        var points = d3.range(0, 6, .1).map(function(t) {
            return {
                value: t,
                0: x(t),
                1: y(Math.sin(t))
            };
        });
        var svg = d3.select(".fei_voice_visualizer").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var path = svg.selectAll("path").data(quad(points)).enter().append("path").style("fill", function(d) {
            // control mood by changing color and speed
            return d3.hsl(z(d[1].value), 1, 0.8);
        }) /* .style("stroke", "#EC6052"); */
        var t0 = Date.now();
        d3.timer(function() {
            var dt = (Date.now() - t0) * .0005;
            points.forEach(function(d) {
                d[1] = y(d.scale = Math.sin(d.value + dt));
            });
            path.attr("d", function(d) {
                return lineJoin(d[0], d[1], d[2], d[3], 80 * d[1].scale * d[1].scale + 10);
            }).attr("stroke-width", 5);
        });
        // Compute quads of adjacent points [p0, p1, p2, p3].

        function quad(points) {
            return d3.range(points.length - 1).map(function(i) {
                return [points[i - 1], points[i], points[i + 1], points[i + 2]];
            });
        }
        // Compute stroke outline for segment p12.

        function lineJoin(p0, p1, p2, p3, width) {
            var u12 = perp(p1, p2),
                r = width / 2,
                a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
                b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
                c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
                d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];
            if (p0) { // clip ad and dc using average of u01 and u12
                var u01 = perp(p0, p1),
                    e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
                a = lineIntersect(p1, e, a, b);
                d = lineIntersect(p1, e, d, c);
            }
            if (p3) { // clip ab and dc using average of u12 and u23
                var u23 = perp(p2, p3),
                    e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
                b = lineIntersect(p2, e, a, b);
                c = lineIntersect(p2, e, d, c);
            }
            return "M" + a + "L" + b + " " + c + " " + d + "Z";
        }
        // Compute intersection of two infinite lines ab and cd.

        function lineIntersect(a, b, c, d) {
            var x1 = c[0],
                x3 = a[0],
                x21 = d[0] - x1,
                x43 = b[0] - x3,
                y1 = c[1],
                y3 = a[1],
                y21 = d[1] - y1,
                y43 = b[1] - y3,
                ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
            return [x1 + ua * x21, y1 + ua * y21];
        }
        // Compute unit vector perpendicular to p01.

        function perp(p0, p1) {
            var u01x = p0[1] - p1[1],
                u01y = p1[0] - p0[0],
                u01d = Math.sqrt(u01x * u01x + u01y * u01y);
            return [u01x / u01d, u01y / u01d];
        }
    }

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
    
    //var videoContainerWidth = $('.video_container').width();
   // console.log("video container width: " + videoContainerWidth);
    var ec = new emotionClassifier();
    ec.init(emotionModel);
    var emotionData = ec.getBlank(); // d3 code for barchart
    var margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
        width = 300,
        height = 30;
    var barWidth = 30;
    var formatPercent = d3.format(".0%");
    
    // Limit the drawing of the X axis to only the "happy" emotion
    var x = d3.scale.linear().domain([0, 1]).range([0, width]);
    var y = d3.scale.linear().domain([3, 3]).range([margin.left, 400]);
    var svg = d3.select("#emotion_chart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    svg.selectAll("rect").
    data(emotionData).
    enter().
    append("svg:rect").
    attr("x", 0).
    attr("y", 0).
    attr("width", function(datum) {
        return x(datum.value);
    }).
    attr("height", barWidth).
    attr("fill", "#ce321e");

    function updateData(data) {
       // console.log(data[3].value);
        // update
        var rects = svg.selectAll("rect").data(data).attr("width", function(datum) {
                datum = data[3].value;
                return x(datum);
            
        });
        var smileScore = data[3].value;
        var frownScore = data[1].value;
        analyzeSmileInitialData(smileScore);
        analyzeFrownData(frownScore);
        // enter
        rects.enter().append("svg:rect");
        // exit
        rects.exit().remove();
    }

    function analyzeSmileInitialData(smileScore) {
        user.initSmilingScoreArray.push(smileScore);
        user.globalSmileScore = smileScore;
    }
    
    function analyzeFrownData(frownScore) {
        user.globalFrownScoreArray.push(frownScore);
    }
});