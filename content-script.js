overallTranscript="";
//Asks for access to the user's voice recording device and stores it in a MediaRecorder object
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'})
    //Creates a websocket to connect to the DeepGram API
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', 
        ['token', globalThis.KEY])
    //Sends real-time recorded data every 500 ms to the API 
    socket.onopen = () => {
        mediaRecorder.addEventListener('dataavailable', event => {
            socket.send(event.data);
        })

        mediaRecorder.start(250);
    }
    //When the API sends back a message
    socket.onmessage = message => {
        const data = JSON.parse(message.data)
        const transcript = data.channel.alternatives[0].transcript
        //Prints transcript and passes it to the processing function
        if (transcript && data.is_final) {
            document.querySelector('p').textContent += ' ' + transcript;
            //processSentence(transcript);
            overallTranscript+=transcript +' ';
            
        }else if(data.is_final && overallTranscript.localeCompare("")!=0){
            processSentence(overallTranscript);
            overallTranscript="";
        } 
    }
})
//3 dimensional array storing commands
const wordArray=[["open",["tub", "tab","window", "incognito", "facebook", "github", "instagram", "netflix"]],["close",["tub", "tab","window"]],["closed",["tub", "tab","window"]],["search",["for"]],["google",[]],["add",["to","bookmarks"]]];

//Function which processes the transcript provided by the DeepGram API
function processSentence(sentence){
    //Splits sentence into words
    const words = sentence.split(" ");
    index=words.indexOf("chrome");
    //Checks if chrome is in the transcript so there is a possibility that a command was given by the user
    if((index==(words.length-1))||(index==(words.length-2))||(index<0)){
        return false;
    }
    found=-1;
    //Checks for the first word of the command (directly after chrome)
    for (let i = 0; i < wordArray.length;i++){
        console.log(words[index+1]);
        if(words[index+1].localeCompare(wordArray[i][0])==0){
            found=i;
            break;
        }
    }
    if(found<0){
        return false;
    }
    //Checks for the second (and possibly third word) of the command (starting with the second word after chrome)
    found2=-1
    for(let i=0;i<wordArray.length;i++){
        if(found==i){
            for(let j=0;j<wordArray[i][1].length;j++){
                if((found==5)&&(words.length-index<3)){
                    return false;
                }else if(found==5 && (index<=(words.length-3))){
                    if((words[index+2].localeCompare(wordArray[i][1][0])!=0)||(words[index+3].localeCompare(wordArray[i][1][1])!=0)){
                        return false;
                    }
                }
                if(words[index+2].localeCompare(wordArray[i][1][j])==0){
                    found2=j;
                    break;
                }
            }
            if((found2<0)&&(found!=4)){
                return false;
            }
        }
    }
    //Start of different functions being executed depending on the input
    if(found==0){                                                           //Hears phrase 'open': restricts possible functions accordingly
        if(found2==0 || found2==1){
            chrome.tabs.create({});                                         //New tab
        }else if(found2==2){
            chrome.windows.create({});                                      //New window
        }
        else if(found2==3){
            chrome.windows.create({incognito: true});                       //New incognito window
        }
        else if(found2==4){
            chrome.tabs.create({url: 'https://en-gb.facebook.com/'});       //Go to Facebook
        }
        else if(found2==5){
            chrome.tabs.create({url: 'https://github.com/'});               //Go to Github
        }
        else if(found2==6){
            chrome.tabs.create({url: 'https://www.instagram.com/'});        //Go to Instagram
        }
        else{
            chrome.tabs.create({url: 'https://www.netflix.com/gb/'});       //Go to Netflix
        }
    }else if(found==1 || found==2){                                         //Hears phrase 'close': restricts possible functions accordingly

        if(found2==0 || found2==1){
            tabID = chrome.tabs.query({currentWindow: true, active: true}, function(tabs){chrome.tabs.remove(tabs[0].id)}); //Close tab
        }else{
            chrome.windows.getCurrent({}, function(win){chrome.windows.remove(win.id)});                                    //Close window
        }
    }else if(found==3){
        str="" //Rebuild string after command to enable searching for it
        for (let i = index+3; i < words.length; i++) {
            str+=words[i];
            str+=" " ;
        }
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + str});                                                //Search phrase
    }else if(found==4){//Rebuild string after command to enable searching for it
        str=""
        for (let i = index+2; i < words.length; i++) {
            str+=words[i];
            str+=" " 
        }
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + str});                                                //Search phrase
    }else{
        chrome.tabs.query(
            {currentWindow: true, active: true}, 
            function(tabs) {
                chrome.bookmarks.create({'title': tabs[0].title, 'url': tabs[0].url})                                       //Add currrent URL
            }                                                                                                               //to bookmarks
        )
    }
    return true;
}
