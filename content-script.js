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

const wordArray=[["open",["tub","window","incognito"]],["close",["tub","window"]],["scroll",["up","down"]],["search",["for"]],["google",[]],["print",["page"]],["add",["to","bookmarks"]]];


function processSentence(sentence){
    const words = sentence.split(" ");
    index=words.indexOf("chrome");
    if((index==(words.length-1))||(index==(words.length-2))||(index==undefined)){
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
    found2=-1
    for(let i=0;i<wordArray.length;i++){
        if(found==i){
            for(let j=0;j<wordArray[i][1].length;j++){
                if((found==6)&&(words.length-index<3)){
                    return false;
                }else if(found==6 && (index<=(words.length-3))){
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
    //Action:open
    if(found==0){
        if(found2==0){
            chrome.tabs.create({});
        }else if(found2==1){
            chrome.windows.create({});
        }else{
            chrome.windows.create({incognito: true});
        }
    }else if(found==1){/*Action:close*/

        if(found2==0){
            tabID = chrome.tabs.query({currentWindow: true, active: true}, function(tabs){chrome.tabs.remove(tabs[0].id)});
        }else{/*close window */
            chrome.windows.getCurrent({}, function(win){chrome.windows.remove(win.id)});
        }
    }else if(found==2){/*Action:scroll up*/
        if(found2==0){

            document.body.scrollTop = 0;
        }else{/*Scroll down */

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
        str+=words[words.length-1];
    }else if(found==4){/*Google (things from index+2)*/
        str=""
        for (let i = index+2; i < words.length; i++) {
            str+=words[i];
            str+=" " 
        }
        str+=words[words.length-1];
    }else if(found==5){/*Print page*/

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
