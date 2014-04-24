$(document).ready(function() {
    Parse.initialize("vqKbr74yCvrCSE4a0hoJt8jaSqiMGZFf6YRd9aF1", "lebReTB7uP9mYCxSinxoajrP0skGE4dsmqlFGJcc");
    
    var user = {
        firstname: null,
        lastname: null,
        schoolname: null,
        pictureUrl: null,
        jobtitle: null,
        jobcompany: null,
        standing: false,
        passInitSmilingTest: false,
        initSmilingScore: null,
        getUserPulse: false            
    }
    
    var highVal = 0;
    
    var audioElem = $('#audioplay').get(0);
    if (audioElem) audioElem.volume = 0.1;

    
    var socket = io.connect("/");
    
    socket.on("userPresence", function(userPresence) {
          if (userPresence == "1") {
            haveUser();
              //enableCamera();
              
            setTimeout(function() {
                findCurrentUser();
            }, 50);
              
          } else if (userPresence == "0") {
              waitingForUser();
          }
      });
    
    function haveUser() {
        //show($('.afei_voice_visualizer'));
        console.log("found user");          
    }
  
    function waitingForUser() {
        console.log("waiting");      
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
    
    

    
    var sc_dialogue = [];
    
    var transEnd = "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd";
    
    for (i = 0; i < s_dialogue.length; i++) {
        sc_dialogue[i] = new SpeechSynthesisUtterance(s_dialogue[i].scene.script);
        
    }
    
    /*

        
        show($('.ambient_vis_container'));        
        loadUser(findCurrent, callback);
        checkInteraction(0);
    }, 500);
*/
    
      
    function findCurrentUser() {
        var Person = Parse.Object.extend("Person");
        var query = new Parse.Query(Person);
        
        query.equalTo("current_user", true);
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    user.firstname = object.get('firstname');
                    user.lastname = object.get('lastname'); 
                    user.schoolname = object.get('schoolname');  
                    onLinkedInLoad();   
                    onLinkedInAuth();
                    
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
              }
        });        
    }


    /*
findCurrentUser(user.firstname, user.lastname, user.schoolname, checkCurrentUser);
    
    function findCurrentUser(fname, lname, sname, callback) {
        var Person = Parse.Object.extend("Person");
        var query = new Parse.Query(Person);
        
        query.equalTo("current_user", true);
        query.find({
            success: function(results) {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    user.firstname = object.get('firstname');
                    user.lastname = object.get('lastname'); 
                    user.schoolname = object.get('schoolname');  
                    callback(user.firstname, user.lastname, user.schoolname);
                }
            },
            error: function(error) {
                console.log("Error: " + error.code + " " + error.message);
              }
        });        
    }
    
    function checkCurrentUser(fname, lname, sname) {
        user.firstname = fname;
        user.lastname = lname;
        user.schoolname = sname;
        console.log(user.firstname);
        checkInteraction(0);

        //onLinkedInLoad();
        //onLinkedInAuth();

    }
*/
    
    function checkInteraction(count) {
        switch(count) {
            case 0:
                console.log("Total lines of script: " + sc_dialogue.length);
                $('.dashboard, .sidebar').removeClass('hide').addClass('show');
                
                for (i = 0; i < 8; i++) {
                    botSpeak(sc_dialogue[i]);  
                    sc_dialogue[i].onstart = function(event) {
                       // $('body').addClass(s_dialogue[i-1].scene.changeMood).removeClass(s_dialogue[i].scene.changeMood);
                    }  
                }
                
                sc_dialogue[3].onend = function(event) {
                    displayUser();  
                }
                
                sc_dialogue[4].onend = function(event) {
                    $('.block_emotion').removeClass('inactive').addClass('show');
                }
                
                sc_dialogue[6].onstart = function(event) {
                    $('.block_emotion').removeClass('show').addClass('inactive');
                  //  $('.dashboard_bottom, .sidebar, .profile').removeClass('show').addClass('hide');
                }
                
                sc_dialogue[7].onstart = function(event) {
                  //  $('.dashboard_bottom, .sidebar, .profile').removeClass('hide').addClass('show');
                    //checkInteraction(1);    
                }
                break;
            case 1:
                console.log("get feet");
                socket.on("userStanding", function(userLeftFoot, userRightFoot) {
                     if(userLeftFoot >= highVal && userRightFoot >= highVal && user.standing == false) {
                          user.standing = true;
                          console.log("user is standing at the rihgt place");
                          checkInteraction(2);
                      }
                });
                break;                
            case 2:
                for (i = 6; i < 17; i++) {
                    botSpeak(sc_dialogue[i]);  
                    sc_dialogue[i].onstart = function(event) {
                     //   $('body').addClass(s_dialogue[i-1].scene.changeMood).removeClass(s_dialogue[i].scene.changeMood);
                    }  
                }
                sc_dialogue[16].onend = function(event) {
                    checkInteraction(3);    
                }
                
                break;
            case 3: 
                console.log("get BPM");
                socket.on("userHeartRate", function(BPM) {
                    if (BPM == "\r") {
                        console.log("!= BPM reading");
                    } else {
                        BPM = BPM.replace("B", ""); 
                        
                        if(BPM > 50 && BPM < 170 && user.getUserPulse == false) {
                       // if(user.getUserPulse == false) {
                        setTimeout(function() {
                            user.getUserPulse = true;
                            console.log("use this BPM: " + BPM); 
                            checkInteraction(4);   
                        }, 10000);
                        
                       }   
                    }
                    
                });
                break;
            case 4:
                console.log("next line after BPM");
                botSpeak(sc_dialogue[17]);
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
        
        str.text = str.text.replace(/userfirstname/g, user.firstname);
        str.text = str.text.replace(/userlastname/g, user.lastname);
        str.text = str.text.replace(/jobtitle/g, user.jobtitle);
        str.text = str.text.replace(/jobcompany/g, user.jobcompany);
        str.text = str.text.replace(/initSmilingScore/g, user.initSmilingScore);
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
              "school-name": user.schoolname,
              "picture-url": ""
          }).result(displayPeopleSearch).error(displayPeopleSearchErrors);
          
          //IN.API.Profile("me").result(displayProfiles);
          
      }
      function displayPeopleSearch(peopleSearch) {
          var peopleSearchDiv = document.getElementById("peoplesearch");
          var members = peopleSearch.people.values;
          for (var member in members) {
              
              console.log(members[member]);
              //console.log(members[member].positions.values[0].company.name + " " + members[member].profilespictureUrl);
              user.pictureUrl = members[member].pictureUrl;
              user.jobcompany = members[member].positions.values[0].company.name;
              user.jobtitle = members[member].positions.values[0].title;
              checkInteraction(0);
            }
    }
    
    
    function displayPeopleSearchErrors(error) { /* do nothing */}
    
    /* Rainbow Worm via http://mbostock.github.io/protovis/ex/segmented.html */
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
});