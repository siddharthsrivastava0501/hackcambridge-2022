const wordArray=[["open",["tab","window","incognito"]],["close",["tab","window"]],["scroll",["up","down"]],["search",["for"]],["google",[]],["print",["page"]],["add",["bookmarks"]]];
const wordArrayO=[["tab",["open","close"]],["window",["open","close","incognito"]],["scroll",["up","down"]],["search",["for"]],["google",[]],["print",["page"]],["add",["bookmarks"]]];

function processSentence(sentece){
    const words = sentece.split(" ");
    index=words.find("chrome");
    if(index==(words.length-1)){
        return false;
    }
    found=-1;
    if(index!=undefined){
        for (let i = 0; i < wordArray.length;i++){
            if(words[index+1].localeCompare(wordArray[i][0])){
                found=i;
                break;
            }
        }
    }
    if(found<0){
        return false;
    }
    found2=-1
    for(let i=0;i<wordArray.length;i++){
        if(found==i){
            for(let j=0;j<wordArray[i][1].length;j++){
                if(words[index+2].localeCompare(wordArray[i][1][j])){
                    found2=j;
                    break;
                }
            }
            if(found2<0){
                return false;
            }
        }
    }
    //Action:open
    if(found==0){
        //open tab
        if(found2==0){

        }else if(found2==1){/*close tab*/

        }else{/*open icognito */

        }
    }else if(found==1){/*Action:close*/
        //close tab
        if(found2==0){

        }else{/*close window */

        }
    }else if(found==2){
        
    }
}