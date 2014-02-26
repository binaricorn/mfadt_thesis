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
    
    // Send name to socket, have socket store the name
    var socket = io.connect("/");
    
    socket.on('script', function(data) {
        
        
        function initSystem(s_slc) {
            s_sl = Object.keys(data[count].system).length;
            
            getName(username);
            
            
            
            $('.script').text(data[count].system[s_slc]);
        }

        function initSound(s_alc) {
            s_al = Object.keys(data[count].audio).length; 
            /* $('.audio audio').html('<source src="audio/'+ data[count].audio[s_alc] +'.mp3" type="audio/mpeg">'); */
        }

        function getName(username) {
            username = localStorage.username;
            username = JSON.parse(username);
            data[count].system[s_slc] = data[count].system[s_slc].replace(/username/g, username);
        }
        
        function recordName() {
            $('.record').css('display', 'block');
        }
        
        initSystem(s_slc);
        initSound(s_alc);
        
        $('.btn').on('mouseup', function() {
            s_slc++;
            s_alc++;
            initSystem(s_slc);
            initSound(s_alc);
            // Reset the count
            if (s_slc == s_sl - 1 || s_alc == s_al - 1) {
                count++;
                s_slc = -1;
                s_alc = -1;
            }
            // If we reach the line where we're asking for the name
            if (count == 2 && s_slc == -1) {
                console.log(s_slc);
                console.log("record");
                $('.record').css('display', 'block');
            } else {
                $('.record').css('display', 'none');
            }
        });
    });
    
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
    
    console.log();

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
    
    $('#start_button').on('click', function() {
        startButton(event);
    });
    
});