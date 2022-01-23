navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'})
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', 
        ['token', globalThis.KEY])

    socket.onopen = () => {
        mediaRecorder.addEventListener('dataavailable', event => {
            socket.send(event.data)
        })

        mediaRecorder.start(500)
    }

    socket.onmessage = message => {
        const data = JSON.parse(message.data)
        const transcript = data.channel.alternatives[0].transcript
        if (transcript && data.is_final) {
            document.querySelector('p').textContent += ' ' + transcript;
            processSentence(transcript);
        } 
    }
})

const wordArray=[["open",["tub", "tab","window", "incognito", "facebook", "github", "instagram", "netflix"]],["close",["tub", "tab","window"]],["closed",["tub", "tab","window"]],["search",["for"]],["google",[]],["add",["to","bookmarks"]]];


function processSentence(sentence){
    const words = sentence.split(" ");
    index=words.indexOf("chrome");
    console.log("index");
    console.log(index);
    if((index==(words.length-1))||(index==(words.length-2))||(index<0)){
        return false;
    }
    found=-1;
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
    console.log(found);
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
    console.log(found);
    //Action:open
    if(found==0){
        if(found2==0 || found2==1){
            chrome.tabs.create({});
        }else if(found2==2){
            chrome.windows.create({});
        }
        else if(found2==3){
            chrome.windows.create({incognito: true});
        }
        else if(found2==4){
            chrome.tabs.create({url: 'https://en-gb.facebook.com/'});
        }
        else if(found2==5){
            chrome.tabs.create({url: 'https://github.com/'});
        }
        else if(found2==6){
            chrome.tabs.create({url: 'https://www.instagram.com/'});
        }
        else{
            chrome.tabs.create({url: 'https://www.netflix.com/gb/'});
        }
    }else if(found==1 || found==2){/*Action:close*/

        if(found2==0 || found2==1){
            tabID = chrome.tabs.query({currentWindow: true, active: true}, function(tabs){chrome.tabs.remove(tabs[0].id)});
        }else{/*close window */
            chrome.windows.getCurrent({}, function(win){chrome.windows.remove(win.id)});
        }
    }else if(found==3){/*Search for (things from index+3)*/
        str=""
        for (let i = index+3; i < words.length; i++) {
            str+=words[i];
            str+=" " ;
        }
        console.log(str);
        //chrome.search.query({disposition: "NEW_TAB", text: str}, function(){console.log("aaaaaaaaaaa")});

        chrome.tabs.create({url: 'https://www.google.com/search?q=' + str});
    }else if(found==4){/*Google (things from index+2)*/
        str=""
        for (let i = index+2; i < words.length; i++) {
            str+=words[i];
            str+=" " 
        }
        chrome.tabs.create({url: 'https://www.google.com/search?q=' + str});
    }else{/*Add to bookmarks*/
        chrome.tabs.query(
            {currentWindow: true, active: true}, 
            function(tabs) {
                chrome.bookmarks.create({'title': tabs[0].title, 'url': tabs[0].url})
            }
        )
    }
    return true;
}
