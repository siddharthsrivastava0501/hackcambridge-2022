navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'})
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', 
    '8ab30cfaef2caa33afda2dfe260d35fb86b17952'])

    socket.onopen = () => {
        mediaRecorder.addEventListener('dataavailable', event => {
            socket.send(event.data)
        })

        mediaRecorder.start(250)
    }

    socket.onmessage = message => {
        const data = JSON.parse(message.data)
        const transcript = data.channel.alternatives[0].transcript
        if (transcript && data.is_final) {
            processSentence(transcript);
        } 
    }
})

const wordArray=[["open",["tab","window","incognito"]],["close",["tab","window"]],["scroll",["up","down"]],["search",["for"]],["google",[]],["print",["page"]],["add",["to","bookmarks"]]];

function processSentence(sentence){
    const words = sentence.split(" ");
    index=words.find("chrome");
    if((index==(words.length-1))||(index==undefined)){
        return false;
    }
    found=-1;
    for (let i = 0; i < wordArray.length;i++){
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
                }else if(found==6){
                    if((words[index+2].localeCompare(wordArray[i][1][0]!=0))||(words[index+3].localeCompare(wordArray[i][1][1]!=0))){
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
        console.log("Printy boi");
        chrome.tabs.create({});
        if(found2==0){

        }else if(found2==1){/*close tab*/

        }else{/*open icognito */

        }
    }else if(found==1){/*Action:close*/
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){tabID = tabs[0].id});
        chrome.tabs.remove(tabID);
        if(found2==0){

        }else{/*close window */
            windowID = chrome.tabs.getCurrent().id;
            chrome.windows.remove(windowID);
        }
    }else if(found==2){/*Action:scroll */
        //Scroll up
        if(found2==0){

        }else{/*Scroll down */

        }
    }else if(found==3){/*Search for (things from index+3)*/

    }else if(found==4){/*Google (things from index+2)*/

    }else if(found==5){/*Print page*/

    }else{/*Add to bookmarks*/

    }
    return true;
}
