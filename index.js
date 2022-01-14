const textForm = document.querySelector("form");
const textInput = document.querySelector("#textInput");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue= document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Initializing SpeechSynth API
const synth = window.speechSynthesis;

// Initializing the voices array

let voices = [];

const getVoices = () =>
{
    voices = synth.getVoices();

    // Creating select
    voices.map((item)=>{
        const option = document.createElement("option");
        // Fill options with voices and languages
        option.textContent=item.name + '(' + item.lang + ')';
        // Set needed option attributes 
        option.setAttribute("data-lang", item.lang);
        option.setAttribute("data-name", item.name);
        voiceSelect.appendChild(option);
    });
}

getVoices();
if(synth.onvoiceschanged !== undefined)
{
    synth.onvoiceschanged = getVoices;
}

const speak = ()=>{

    // Check if already speaking
    if(synth.speaking)
    {
        console.error("Already Speaking...");
        return;
    }
    if(textInput.value!== "")
    {
                
        // Start the animation    

        body.style.background= '#141414 url(./images/wave.gif)';
        body.style.backgroundRepeat = "repeat-x";
        body.style.backgroundSize = "100% 100%";

        // Get the speaking started
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        // Speak end 
        speakText.onend = e=>{
            body.style.background = "#141414";
            console.log("Done Speaking...");
        };
        // Speak error
        speakText.onerror = e=>{
            console.error("Something went wrong...");
        };
        // Select voice 
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute("data-name");
        // Loop through voices and find
        voices.map((item)=>{
            if(item.name == selectedVoice)
            {
                speakText.voice = item;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);
        
        speakText.onpause = function(event) 
        {
            var char = event.utterance.text.charAt(event.charIndex);
            console.log('Speech paused at character ' + event.charIndex + ' of "' +
            event.utterance.text + '", which is "' + char + '".');
        };
    }
};

// Event Listners
// Submit button
textForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    speak();
    textInput.blur();
});

// Rate and Pitch value cahnges

rate.addEventListener("change", () => {
    rateValue.textContent = rate.value
} );

pitch.addEventListener("change", () => {
    pitchValue.textContent = pitch.value
} );

// Voice Select change

voiceSelect.addEventListener("change" ,()=>{
    speak();
});
