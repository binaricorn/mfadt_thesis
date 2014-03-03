$(document).ready(function() {
    // Loops though the blocks
    var count = 0;
    // Loops through the amount of script lines in each system script block
    var s_slc = 0;
    // Amount of lines in each system script block
    var s_sl = 0;
    // Loops through the amount of audio files in each system script block
    var s_alc = 0;
    // Amount of lines in each system audio block
    var s_al = 0;
    // Speech recognition
    var username = "";
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    var current_style;
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    var first_char = /\S/;
    var lostUser = 0;
    var userHere = false;
    // Send name to socket, have socket store the name
    var socket = io.connect("/");
    var voices = [];
    voices = window.speechSynthesis.getVoices();
    
    $("#startbutton").on('click', function() {
        startVideo();
    });
    
    var u = new SpeechSynthesisUtterance("hi");
    speechSynthesis.speak(u);
    
    socket.on('script', function(script) {
                
        // Get range finder data from Arduino
        socket.on("arduino", function(arduino) {
            // If the rangefinder is not "out of range" (giving a reading of -1)
            if (arduino > 0) {
                haveUser();
            } else {
                bouncingLogo();
                waitingForUser();
            }
            // When we've got the user

            function haveUser() {
                $('.screen').removeClass('screen-dark').addClass('screen-gradient');
                $('.logo').css('display', 'none');
                lostUser = 0;
                initSystem(s_slc);
                initSound(s_alc);
                console.log("have user");
            }
            
            function bouncingLogo() {
                var winW = $(window).width();
                var winH = $(window).height();
                var x = 0;
                var y = 0;
            }

            function waitingForUser() {
                // Waiting for a count of 10
                if (arduino < 0 && lostUser <= 9) {
                    lostUser++;
                } else if (arduino < 0 && lostUser >= 10) {
                    nobodyAround();
                }
            }

            function nobodyAround() {
                $('.screen').removeClass('screen-gradient').addClass('screen-dark');
                $('.logo').css('display', 'block');
                $('.script').css('display', 'none');
            }
        });

        function initSystem(s_slc) {
            s_sl = Object.keys(script[count].system).length;
            getName(username);
            $('.script').css('display', 'block');
            $('.script').text(script[count].system[s_slc]);
        }

        function initSound(s_alc) {
        }

        function getName(username) {
            username = localStorage.username;
            username = JSON.parse(username);
            // Look for 'username' from the incoming text and replace it with the username sent in from the speech to text
            script[count].system[s_slc] = script[count].system[s_slc].replace(/username/g, username);
        }

        function recordName() {
            $('.record').css('display', 'block');
        }
    });
    
    ////////////////////////// Google Speech to Text API
    
    showInfo('info_start');
    if ('webkitSpeechRecognition' in window) {
        start_button.style.display = 'inline-block';
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function() {
            recognizing = true;
            showInfo('info_speak_now');
            start_img.src = 'img/mic-animate.gif';
        };
        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                start_img.src = 'img/mic.gif';
                showInfo('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.src = 'img/mic.gif';
                showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };
        recognition.onend = function() {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            start_img.src = 'img/mic.gif';
            if (!final_transcript) {
                showInfo('info_start');
                return;
            }
            showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                window.getSelection().addRange(range);
            }
        };
        recognition.onresult = function(event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                    username = final_transcript;
                    username = JSON.stringify(username);
                    localStorage.username = username;
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
        };
    }

    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    function capitalize(s) {
        return s.replace(first_char, function(m) {
            return m.toUpperCase();
        });
    }

    function startButton(event) {
        if (recognizing) {
            recognition.stop();
            return;
        }
        final_transcript = '';
        recognition.lang = 'en-US';
        recognition.start();
        ignore_onend = false;
        final_span.innerHTML = '';
        interim_span.innerHTML = '';
        start_img.src = 'mic-slash.gif';
        showInfo('info_allow');
        showButtons('none');
        start_timestamp = event.timeStamp;
    }

    function showInfo(s) {
        if (s) {
            for (var child = info.firstChild; child; child = child.nextSibling) {
                if (child.style) {
                    child.style.display = child.id == s ? 'inline' : 'none';
                }
            }
            info.style.visibility = 'visible';
        } else {
            info.style.visibility = 'hidden';
        }
    }

    function showButtons(style) {
        if (style == current_style) {
            return;
        }
        current_style = style;
    }
    
    
    ////////////////////////// HTML5 Text to speech API
    
    var vid = document.getElementById('videoel');
    var overlay = document.getElementById('overlay');
    var overlayCC = overlay.getContext('2d'); /********** check and set up video/webcam **********/

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
    vid.addEventListener('canplay', enablestart, false); /*********** setup of emotion detection *************/
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
    var emotionData = ec.getBlank(); /************ d3 code for barchart *****************/
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
    } /******** stats ********/
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.getElementById('container').appendChild(stats.domElement);
    // update stats on every iteration
    document.addEventListener('clmtrackrIteration', function(event) {
        stats.update();
    }, false);
});