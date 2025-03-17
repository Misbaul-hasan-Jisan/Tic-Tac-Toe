let boxes = document.querySelectorAll(".box");
let msg_container=document.querySelector(".msg-container")
let reset_btn = document.querySelector("#reset-btn");
let new_btn=document.querySelector("#new")
let msg=document.querySelector("#msg")


let player0 = true;

const winpattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const reset=()=>{
    player0=true;
    enabledboxes();
    msg_container.classList.add("hide")
}
let disabledboxes=()=>{
    for(box of boxes){
        box.disabled=true;
    }
}
let enabledboxes=()=>{
    for(box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
       if(player0===true){
        box.innerText="O"
        player0=false;
       }else{
        box.innerText="X"
        player0=true;
       }
       box.disabled=true;
       checkWinner();
    });
});

let checkWinner=()=>{
    for(let pattern of winpattern){
        let pos1=boxes[pattern[0]].innerText
        let pos2=boxes[pattern[1]].innerText
        let pos3=boxes[pattern[2]].innerText
        if(pos1!=""&&pos2!=""&&pos3!=""){
            if(pos1==pos2 && pos2==pos3){
                console.log("winner", pos1)
                showWinner(pos1);
                disabledboxes();

            }
        }
    }
}
showWinner=(winner)=>{
    msg.innerText=`The winner is ${winner}`
    msg_container.classList.remove("hide")
}

new_btn.addEventListener("click", reset)
reset_btn.addEventListener("click", reset)