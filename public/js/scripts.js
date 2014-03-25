$(document).ready(function() {
    var speech = new SpeechSynthesisUtterance('hi');
    var loop = 0;

    var sitBool = false;
    var typeBool = false;
    var linkedinBool = false;
    var smile1Bool = false;
    
    var user = {
        firstname: null,
        lastname: null,
        schoolname: null,
        jobtitle: null
    }
    
    var scenes = [
        { 
            scene: {
                script: "0",
                interaction: "sit",
                visible: ""
            }
        },
        {
            scene: {
                script: "1",
                interaction: "type",
                visible: ".block_fieldInput"
            }
        },
        {
            scene: {
                script: "2",
                interaction: "linkedin",
                visible: ""
            }
        },
        {
            scene: {
                script: "3",
                interaction: "smile1",
                visible: "#content"
            }
        }
        
    ];
    
    
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
        displayVisible(loop);
       
        
        if(interaction == "sit") {            
            socket.on("userSitting", function(userSitting) {
                if (userSitting >= 800 && userSitting <= 1023 && sitBool == false) {
                    console.log("user sitting down");
                    botSpeak(1);
                    sitBool = true;
                }
            });
        } else if(interaction == "type") {
            console.log("the user needs to type");
            
            $('#form_submit').on('click', function() {
                storeFormVals();                
                hideVisible(loop);
                botSpeak(2);
            });
            
        } else if(interaction == "linkedin" && linkedinBool == false) {
            console.log(linkedinBool);
            linkedinBool = true;
            console.log('crawl linkedin');
            //onLinkedInLoad(); 
            //onLinkedInAuth(); 
            botSpeak(3);
        } else if(interaction == "smile1" && smile1Bool == false) {
            console.log('check smile');
            smile1Bool = true; 
        }
    }
    
    function botSpeak(loop) {
      //  console.log('loop: ' + loop);
        
        speech.text = scenes[loop].scene.script;
        speech.text = speech.text.replace(/firstname/g, user.firstname);
        //speech.text = speech.text.replace(/jobtitle/g, user.jobtitle);
        
        /*
        // this is one more convoluted option
        speech.text = speech.text.replace(/firstname/g, getFormVals().firstname);
        */
        
        speechSynthesis.speak(speech);
                
       // speech.onend = function(event) {
           // console.log('stopped speaking: ' + loop); // HERE
        checkInteraction(loop);
        //};
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
    
    
    /*
    // this is one more convoluted option
    
    function storeFormVals() {
        var firstname = $('#form_firstName').val();
            firstname = JSON.stringify(firstname);
        localStorage.firstname = firstname;
        
        var lastname = $('#form_lastName').val();
            lastname = JSON.stringify(lastname);
        localStorage.lastname = lastname;
        
        var schoolname = $('#form_schoolName').val();
            schoolname = JSON.stringify(schoolname);
        localStorage.schoolname = schoolname;
    }
    
    function getFormVals() {
        var firstname = localStorage.firstname;
            firstname = JSON.parse(firstname);
                    
        var lastname = localStorage.lastname;
            lastname = JSON.parse(lastname);
                    
        var schoolname = localStorage.schoolname;
            schoolname = JSON.parse(schoolname);
        
        return {
            firstname: firstname,
            lastname: lastname,
            schoolname: schoolname
        }

    }
    */
    
    ////////////////////////////////////// Linkedin API
    
    
    // 2. Runs when the JavaScript framework is loaded
    function onLinkedInLoad() {
        IN.Event.on(IN, "auth", onLinkedInAuth);
    }
    
    // 2. Runs when the viewer has authenticated
    function onLinkedInAuth() {
        IN.API.PeopleSearch()
          .fields("firstName", "lastName", "positions", "educations")
          .params({"first-name": user.firstname, "last-name": user.lastname, "school-name": user.schoolname })
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
       //   console.log(members[member].firstName + " " + members[member].lastName + " is a " + members[member].positions.values[0].title);
          user.jobtitle = members[member].positions.values[0].title;
          //console.log(user.jobtitle);
          
          //linkedInJobTitle = members[member].positions.values[0].title;
         // speech.text = speech.text.replace(/jobtitle/g, linkedInJobTitle);          
  
          /*
          // in case we need to store the job title info:
          linkedInJobTitle = JSON.stringify(members[member].positions.values[0].title);
          localStorage.linkedInJobTitle = linkedInJobTitle;
          */
          
        }     
    }
    
    function displayPeopleSearchErrors(error) { /* do nothing */ }

});