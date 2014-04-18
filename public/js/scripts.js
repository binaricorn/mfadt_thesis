$(document).ready(function() {
    Parse.initialize("vqKbr74yCvrCSE4a0hoJt8jaSqiMGZFf6YRd9aF1", "lebReTB7uP9mYCxSinxoajrP0skGE4dsmqlFGJcc");
    
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
        show($('.ambient_vis_container'));
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
                botSpeak(sc_dialogue[0]);
                sc_dialogue[0].onstart = function(event) {
                    $('body').addClass(s_dialogue[0].scene.changeMood).removeClass('middle');
                }
                botSpeak(sc_dialogue[1]);
                sc_dialogue[1].onstart = function(event) {
                    $('body').removeClass(s_dialogue[0].scene.changeMood).addClass(s_dialogue[1].scene.changeMood);
                }
                botSpeak(sc_dialogue[2]);
                sc_dialogue[2].onstart = function(event) {
                    $('body').removeClass(s_dialogue[1].scene.changeMood).addClass(s_dialogue[2].scene.changeMood);
                }
                botSpeak(sc_dialogue[3]);
                sc_dialogue[3].onstart = function(event) {
                    $('body').removeClass(s_dialogue[2].scene.changeMood).addClass(s_dialogue[3].scene.changeMood);
                }
                botSpeak(sc_dialogue[4]);
                sc_dialogue[4].onstart = function(event) {
                    $('body').removeClass(s_dialogue[3].scene.changeMood).addClass(s_dialogue[4].scene.changeMood);
                }
                botSpeak(sc_dialogue[5]);
                sc_dialogue[5].onstart = function(event) {
                    $('body').removeClass(s_dialogue[4].scene.changeMood).addClass(s_dialogue[5].scene.changeMood);
                }
                
                sc_dialogue[5].onend = function(event) {
                    checkInteraction(1);    
                    console.log("Stopped speaking");
                    
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
            
                botSpeak(sc_dialogue[6]);
                sc_dialogue[6].onstart = function(event) {
                    $('body').removeClass(s_dialogue[5].scene.changeMood).addClass(s_dialogue[6].scene.changeMood);
                }
                botSpeak(sc_dialogue[7]);
                sc_dialogue[7].onstart = function(event) {
                    $('body').removeClass(s_dialogue[6].scene.changeMood).addClass(s_dialogue[7].scene.changeMood);
                }
                botSpeak(sc_dialogue[8]);
                sc_dialogue[8].onstart = function(event) {
                    $('body').removeClass(s_dialogue[7].scene.changeMood).addClass(s_dialogue[8].scene.changeMood);
                }
                botSpeak(sc_dialogue[9]);
                sc_dialogue[9].onstart = function(event) {
                    $('body').removeClass(s_dialogue[8].scene.changeMood).addClass(s_dialogue[9].scene.changeMood);
                }
                botSpeak(sc_dialogue[10]);
                sc_dialogue[10].onstart = function(event) {
                    $('body').removeClass(s_dialogue[9].scene.changeMood).addClass(s_dialogue[10].scene.changeMood);
                }
                botSpeak(sc_dialogue[11]);
                sc_dialogue[11].onstart = function(event) {
                    $('body').removeClass(s_dialogue[10].scene.changeMood).addClass(s_dialogue[11].scene.changeMood);
                }
                botSpeak(sc_dialogue[12]);
                sc_dialogue[12].onstart = function(event) {
                    $('body').removeClass(s_dialogue[11].scene.changeMood).addClass(s_dialogue[12].scene.changeMood);
                }
                botSpeak(sc_dialogue[13]);
                sc_dialogue[13].onstart = function(event) {
                    $('body').removeClass(s_dialogue[12].scene.changeMood).addClass(s_dialogue[13].scene.changeMood);
                }

                break;
                
        }
    }
    
    /*
    // This is too automated, I don't think it'll work for what I want it to? 
function loopVisuals(count) {
        if (count < (s_dialogue.length)-2) {
            count++;
            botSpeak(sc_dialogue[count]);
            sc_dialogue[count].onstart = function(event) {
                if (count < (s_dialogue.length)-2) {
                    //hide(s_dialogue[count].scene.show);
                    show(s_dialogue[count].scene.show);
                }
            }            
            sc_dialogue[count].onend = function(event) {
                hide(s_dialogue[count].scene.show);
            }
            $(s_dialogue[count].scene.show).on(transEnd, function(e) {
                $(s_dialogue[count].scene.show).off(transEnd);
                loopVisuals(count);
            });
        }
    }
*/
    
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
        
        str.text = str.text.replace(/username/g, user.firstname);
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
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
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
    var svg = d3.select(".ambient_vis").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var path = svg.selectAll("path").data(quad(points)).enter().append("path").style("fill", function(d) {
        // control mood by changing color and speed
        return d3.hsl(z(d[1].value), 1, 0.8);
    })
    /* .style("stroke", "#EC6052"); */
    var t0 = Date.now();
    d3.timer(function() {
        var dt = (Date.now() - t0) * .0001;
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