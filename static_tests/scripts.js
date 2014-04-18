$(document).ready(function() {
    Parse.initialize("vqKbr74yCvrCSE4a0hoJt8jaSqiMGZFf6YRd9aF1", "lebReTB7uP9mYCxSinxoajrP0skGE4dsmqlFGJcc");
    
    var Person = Parse.Object.extend("Person");
    var person = new Person();

    var b = $('.block').length;
    var count = -1;
    // Get the voice select element.
    var voiceSelect = document.getElementById('voice'); 
    
    /* Really hacky way to get the voice selection to work on here. Via http://blog.teamtreehouse.com/getting-started-speech-synthesis-api */
    // Fetch the list of voices and populate the voice options.

    function loadVoices() {
        var voices = speechSynthesis.getVoices();
        voices.forEach(function(voice, i) {
            var option = document.createElement('option');
            option.value = "Google UK English Female";
            option.value = voice.name;
            voiceSelect.appendChild(option);
        });
    }
    // Chrome loads voices asynchronously.
    window.speechSynthesis.onvoiceschanged = function(e) {
        loadVoices();
    };
    
    var audioElem = $('#audioplay').get(0);
    if (audioElem) audioElem.volume = 0.4;
    
    
    var s_promo = []
    var sc_promo = [];
    
    
    var transEnd = "transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd";
    
    for (i = 0; i < b; i++) {
        s_promo[i] =  $(".promo .block .centered .script").eq(i).text();
        console.log(s_promo[i]);
    }
    
    for (i = 0; i < b; i++) {
        $(".promo .block").eq(i).css('-webkit-transform', 'translateX(' + i * 100 + '%)');
    }
    for (i = 0; i < s_promo.length; i++) {
        sc_promo[i] = new SpeechSynthesisUtterance(s_promo[i]);
    }
    
    
    setTimeout(function() {
        loopPromo(count);
        
       
        $('#form_submit').on('click', function() {
            person.set("firstname", $('#form_firstName').val());
            person.set("lastname", $('#form_lastName').val());
            person.set("schoolname", $('#form_schoolName').val());
              
            person.save(null, {
              success: function(person) {
              },
              error: function(person, error) {
                console.log('Failed to create new object, with error code: ' + error.description);
              }
            });
        });
    }, 500);
    
    
    // This is too automated, I don't think it'll work for what I want it to? 
    function loopVisuals(count) {
        if (count < (s_dialogue.length)) {
            count++;
            botSpeak(sc_dialogue[count]);
            sc_dialogue[count].onstart = function(event) {
                if (count < (s_dialogue.length)) {
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

    
    function hide(elem) {
        $(elem).removeClass('show').addClass('hide');
    }
    
    function show(elem) {
        $(elem).removeClass('hide').addClass('show');
    }

    function loopPromo(count) {
        // could this be written in a for loop??
        
        if (count < (s_promo.length)-2) {
            count++;
            botSpeak(sc_promo[count]);
            sc_promo[count].onend = function(event) {
                if (count < (s_promo.length)-2) {
                    $(".promo .block").eq(count).addClass('slide').css('-webkit-transform', 'translateX(-100%)');
                    $(".promo .block").eq(count + 1).addClass('slide').css('-webkit-transform', 'translateX(0%)');    
                }
                
            }
            $(".promo .block").eq(count).on(transEnd, function(e) {
                $(".promo .block").eq(count).off(transEnd);
                    loopPromo(count);    
                    
            });
        }
    }
    
    function botSpeak(str) {
        str.voice = speechSynthesis.getVoices().filter(function(voice) {
            return voice.name == "Google UK English Female";
        })[0];
        speechSynthesis.speak(str);
    } 
});