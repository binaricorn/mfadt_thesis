$(document).ready(function() {
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
    if (audioElem) audioElem.volume = 0.35;
    
    
    var s_promo = []
    var sc_promo = [];
    var s_dialogue = [
    {
        scene: {
            script: "Hi colleen, I hope your tour of our office has been a pleasant one."    
        }
    },
    {
        scene: {
            script: "Lets get down to business."    
        }
    },
    {
        scene: {
            script: "You worked at Local number 12 as a Designer, thats super cool!"    
        }
    },
    {
        scene: {
            script: "Sigh, theres no Smile Point record on your file. Oh well, thats fine. We can record a new one today."    
        }
    },
    {
        scene: {
            script: "This one will stay on your record for the next three years, so try not to screw it up!"    
        }
    },
    {
        scene: {
            script: "Just kidding. I hope you know that was just a joke. I think I need to work on my sense of humor, I get told quite often that eyem not very funny."    
        }
    },
    {
        scene: {
            script: "Anyway, you know what Smile Points are, doent you?"    
        }
    },
    {
        scene: {
            script: "No? Wow okay. Theyre a scientifically determined measurement of your emotional health and your ability to handle stressful situations."    
        }
    },
    {
        scene: {
            script: "Think of them as a gauge whether or not youll be able to handle the awe some ness of working with us, because we will challenge you!"    
        }
    },
    {
        scene: {
            script: "There once was a man named Frederick Taylor, who said, In the past the man has been first."    
        }
    },
    {
        scene: {
            script: "In the future the system must be first, and that the first object of any good system must be that of developing first class men."    
        }
    },
    {
        scene: {
            script: "Oh crap, which reminds me, I forgot to introduce myself."    
        }
    },
    {
        scene: {
            script: "Fitness Emotion Inquiry, nice to meet you."    
        }
    },
    {
        scene: {
            script: "You can just call me Faye."    
        }
    }
    
    ];
    var sc_dialogue = [];
    
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
    
    console.log(s_dialogue.length);
    
    for (i = 0; i < s_dialogue.length; i++) {
        sc_dialogue[i] = new SpeechSynthesisUtterance(s_dialogue[i].scene.script);
        
    }

    
    setTimeout(function() {
        loopPromo(count);
        $('#form_submit').on('click', function() {
            if (audioElem) audioElem.volume = 0.15;
            
            $('.block_fieldInput').css('display','none');
            $('.ambient_vis_container').css('display','block');
            
            for (i = 0; i < s_dialogue.length; i++) {
                botSpeak(sc_dialogue[i]);
            }
        });
        
        
    }, 500);

    function loopPromo(count) {
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
    }).style("stroke", "#EC6052");
    var t0 = Date.now();
    d3.timer(function() {
        var dt = (Date.now() - t0) * .0007;
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