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
        firstname: null,
        lastname: null,
        schoolname: null,
        pictureUrl: null,
        jobtitle: backup_jobtitle,
        jobcompany: backup_jobcompany,
        standing: false,
        passInitSmilingTest: null,
        initSmilingScoreArray: [],
        initSmilingScore: null,
        doubleInitSmilingScore: null,
        getUserPulse: false,
        BPM: null
    }

    var doLinkedIn = false;

    var highVal = 800;

    var audioElem = $('#audioplay').get(0);
    if (audioElem) audioElem.volume = 0.1;

    var sc_dialogue = [];
    var sc_promo = [];

    var transEnd = "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd";

    for (i = 0; i < s_dialogue.length; i++) {
        sc_dialogue[i] = new SpeechSynthesisUtterance(s_dialogue[i].scene.script);
    }

    for (i = 0; i < s_promo.length; i++) {
        sc_promo[i] = new SpeechSynthesisUtterance(s_promo[i].scene.script);
    }

    /* Animation between screens */
    var b = $('.promo .block').length;

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

        botSpeak(sc_dialogue[0]);
        setTimeout(function() {
            loopPromo(count);
        }, 500);

       $('#submission_form').submit(function(e){
           e.preventDefault();
           user.firstname = $('#form_firstName').val();
           user.lastname = $('#form_lastName').val();
           console.log(user.firstname + user.lastname);
           //if(doLinkedIn == false) {
             //       doLinkedIn = true;
                    onLinkedInLoad();
                    onLinkedInAuth();
               // }
           
        });

        console.log("found user");
    }

    function waitingForUser() {
        console.log("waiting");
    }


    function loopPromo(count) {
        if (count < (s_promo.length)-1) {
            count++;
            botSpeak(sc_promo[count]);
            sc_promo[count].onend = function(event) {
                if (count < (s_promo.length)-1) {
                    $(".promo .block").eq(count).addClass('slide').css('-webkit-transform', 'translateX(-100%)');
                    $(".promo .block").eq(count + 1).addClass('slide').css('-webkit-transform', 'translateX(0%)');
                }

            }
            $(".promo .block").eq(count).on(transEnd, function(e) {
                // on the last slide, autofocus the firstname field
                if(count == 5) {
                    $('input#form_firstName').replaceWith('<input type="text" id="form_firstName" placeholder="First name" value="" autofocus/>');

                }
                $(".promo .block").eq(count).off(transEnd);
                    loopPromo(count);

            });
        }


    }

    var b = $('.block').length;
    var count = -1;

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
        switch(count) {
            case 0:
                hide($('.promo'));
                show($('.sidebar'));
                show($('.dashboard-screen'));
                show($('.fei_voice_visualizer'));

                


                for (i = 1; i < 12; i++) {
                    botSpeak(sc_dialogue[i]);
                }

                sc_dialogue[0].onend = function(event) {
                    $('.dashboard, .sidebar').removeClass('hide').addClass('show');
                    voice_visualizer();

                }

                sc_dialogue[3].onend = function(event) {
                    displayUser();
                }

                sc_dialogue[4].onend = function(event) {
                   // resetAllUsers();
                    $('.block_emotion').removeClass('inactive').addClass('show');
                }

                sc_dialogue[6].onstart = function(event) {
                    $('.block_emotion').removeClass('show').addClass('inactive');
                  //  $('.dashboard_bottom, .sidebar, .profile').removeClass('show').addClass('hide');
                }

                sc_dialogue[11].onstart = function(event) {
                    $('.block_inquiry').removeClass('inactive').addClass('show');
                  //  $('.dashboard_bottom, .sidebar, .profile').removeClass('hide').addClass('show');
                   checkInteraction(1);
                }
                break;
            case 1:
                socket.on("userHeartRate", function(BPM) {
                    if (BPM == "\r") {
                        console.log("!= BPM reading");
                    } else {
                        BPM = BPM.replace("B", "");

                            if(BPM > 50 && BPM < 105 && user.getUserPulse == false) {
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
                startVideoTracking();
                setTimeout(function() {
                    checkInteraction(4);
                }, 10000);
                break;
            case 4:
                console.log(user.initSmilingScoreArray);
                var initSmileArray = user.initSmilingScoreArray;
                user.initSmilingScore = Math.max.apply(Math, initSmileArray);
                user.initSmilingScore = user.initSmilingScore * 100;
                user.doubleInitSmilingScore = user.initSmilingScore * 2;
                console.log(user.initSmilingScore + " double: " + user.initSmilingScore);

                botSpeak(sc_dialogue[13]);
                sc_dialogue[13].onstart = function() {
                    checkInteraction(5);
                }
                break;
            case 5:
                for (i = 14; i < sc_dialogue.length; i++) {
                    botSpeak(sc_dialogue[i]);
                }

                sc_dialogue[14].onend = function() {
                    $('.block_fitness').removeClass('inactive').addClass('show');
                }

                // when the browsercize game starts
                sc_dialogue[20].onstart = function() {
                    $('.block_fitness').replaceWith('<img src="img/stretch-blur2.gif"/>');
                }

                break;
            }
    }

    function displayUser() {

        $('.profile_photo').html('<img src="' + user.pictureUrl + '"/>');
        $('.profile_title .name').html(user.firstname + " " + user.lastname);
        $('.profile_title .title').text(user.jobtitle + " at " + user.jobcompany);

    }

    function hide(elem) {
        $(elem).removeClass('show').addClass('hide').css('display','none');
    }

    function show(elem) {
        $(elem).removeClass('hide').addClass('show').css('display','block');;
    }

    function botSpeak(str) {

        str.voice = speechSynthesis.getVoices().filter(function(voice) {
            return voice.name == "Google UK English Female";
        })[0];

        console.log(user.jobtitle);

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
              //"school-name": user.schoolname,
              "picture-url": "",
              "count" : 1
          }).result(displayPeopleSearch).error(displayPeopleSearchErrors);


      }
      function displayPeopleSearch(peopleSearch) {
          var peopleSearchDiv = document.getElementById("peoplesearch");
          var members = peopleSearch.people.values;
          console.log(members[member]);

          for (var member in members) {

              console.log(members[member].pictureUrl);

              if (members[member].positions._total != 0) {
                  user.jobcompany = members[member].positions.values[0].company.name;
                  user.jobtitle = members[member].positions.values[0].title;

              } else {
                  console.log("no position data");
                  user.jobcompany = backup_jobcompany;
                  user.jobtitle = backup_jobtitle;
              }

              console.log(user.jobtitle);


              if (members[member].pictureUrl != undefined) {
                  user.pictureUrl = members[member].pictureUrl;
              } else {
                  user.pictureUrl = "http://31.media.tumblr.com/tumblr_m20paq9CjN1qbkdcro1_500.png";
              }

              checkInteraction(0);

            }
    }


    function displayPeopleSearchErrors(error) {
        console.log("error, let's move on");
    }



    /* Rainbow Worm via http://mbostock.github.io/protovis/ex/segmented.html */

    function voice_visualizer() {
        var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100
        },
            width = 700 - margin.left - margin.right, // 600 - 200
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
        })
        /* .style("stroke", "#EC6052"); */
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

    //Text labels for emotion values
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

        var smileScore = data[3].value;

        analyzeSmileInitialData(smileScore);

        // enter
        rects.enter().append("svg:rect");
        texts.enter().append("svg:text");
        // exit
        rects.exit().remove();
        texts.exit().remove();
    }

    function analyzeSmileInitialData(smileScore) {
        user.initSmilingScoreArray.push(smileScore);
        /*
if (user.initSmilingScore > 0.2 && user.passInitSmilingTest == false) {
                user.passInitSmilingTest = true;
                checkInteraction(4);
        }
*/

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


});
