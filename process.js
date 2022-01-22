const wordArray=[["open",["tab","window","incognito"]],["close",["tab","window"]],["scroll",["up","down"]],["search",["for"]],["google",[]],["print",["page"]],["add",["to","bookmarks"]]];
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
            if(words[index+1].localeCompare(wordArray[i][0])==0){
                found=i;
                break;
            }
        }
    }else{
        return false;
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
    }else if(found==2){/*Action:scroll */
        //Scroll up
        if(found2==0){

        }else{/*Scroll down */

        }
    }else if(found==3){/*Search for*/

    }else if(found==4){/*Google*/

    }else if(found==5){/*Print page*/

    }else{/*Add to bookmarks*/

    }
}