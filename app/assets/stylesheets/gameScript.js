    function loadGames(){
        if(window.localStorage.getItem("rubies") != undefined){
            updateRubies(0);
        }else{
            updateRubies(500);
        }
        window.localStorage.setItem("playingDefuse","false");
        //whenever we wanna open the 'between' game we'll call this, right now it just gets called on start
        beginBetweenGame();
        //Whenever we wanna open the 'defuse' game we'll call this, right now it just gets called on start
        setupDefuseGame();

    }
    function getRandomNumber() {
        return Math.floor(Math.random() * 2) + 1;
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    //slot machine
    function spin() {
        if(parseInt(window.localStorage.getItem("rubies")) >= 50){
            const item1 = getElement('item1');
            const item2 = getElement('item2');
            const item3 = getElement('item3');

            const num1 = getRandomNumber();
            const num2 = getRandomNumber();
            const num3 = getRandomNumber();

            item1.innerHTML = `${num1}`;
            item2.innerHTML = `${num2}`;
            item3.innerHTML = `${num3}`;

            if (num1 === num2 && num1 === num3) {
                playWin();
                showMessage();
                updateRubies(350);
            } else {
                hideMessage();
                updateRubies(-50);
            }
        }else{
            alert("Not enough rubies, this game requires at least 50 rubies");
        }
    }

    //between game
    function beginBetweenGame(){
        const item1 = getElement('betweenItem1');
        const item2 = getElement('betweenItem2');
        const item3 = getElement('betweenItem3');
        const item4 = getElement('betweenItem4');
        const item5 = getElement('betweenItem5');
        const bet = getElement('betweenBet');

        const leftNum = Math.floor(Math.random() * 100);
        let leftNumString = leftNum.toString();

        item1.innerHTML = `${leftNumString.charAt(0)}`;
        item2.innerHTML = `${leftNumString.charAt(1)}`;
        item3.innerHTML = `${leftNumString.charAt(2)}`;
        item4.innerHTML = item5.innerHTML = "-";
        item4.style.color = item5.style.color = 'black';
        getElement('betweenSpin').disabled = false;
        const msg = document.getElementById("betweenWinMessage");
        msg.style.display = "none";
        bet.value = 0;
        console.log("Left Number is " + leftNumString);
    }

    function spinBetween(){
        const item1 = getElement('betweenItem1');
        const item2 = getElement('betweenItem2');
        const item3 = getElement('betweenItem3');
        const item4 = getElement('betweenItem4');
        const item5 = getElement('betweenItem5');
        const bet = getElement('betweenBet');

        const currentRubies = parseInt(window.localStorage.getItem("rubies"));

        if(parseInt(bet.value) <= currentRubies && currentRubies > 0 && parseInt(bet.value) > 0){

            const leftNum = parseInt(item1.innerHTML + item2.innerHTML + item3.innerHTML);
            
            const middleNum = Math.floor(Math.random() * 100);
            let middleNumString = middleNum.toString();

            item4.innerHTML = `${middleNumString.charAt(0)}`;
            item5.innerHTML = `${middleNumString.charAt(1)}`;

            console.log("Middle Number is " + middleNumString);

            var win = middleNum >= leftNum;
            if(win){
                item4.style.color = item5.style.color = 'green';
                playWin();
                const msg = document.getElementById("betweenWinMessage");
                msg.style.display = "block"; 
                console.log("Between game won with bet of " + bet.value);
                updateRubies(parseInt(bet.value));
            }else{
                item4.style.color = item5.style.color = 'red';
                console.log("Between game lost with bet of " + bet.value);
                updateRubies(-parseInt(bet.value));
            }
            getElement('betweenSpin').disabled = true;
            setTimeout(function(){
                beginBetweenGame();
            }, 3000);
        }else{
            alert("Invalid bet");
        }
    }

    //defuse game
    function setupDefuseGame(){
        const spin = getElement('defuseSpin');
        const item1 = getElement('defuseItem1');
        const bet = getElement('defuseBet');

        spin.innerHTML = "Start";
        bet.value = 0;
        item1.innerHTML = "_";
        item1.style.color = "black";
        spin.disabled = false;
    }

    function spinDefuse(){
        const spin = getElement('defuseSpin');
        const bet = getElement('defuseBet');

        const currentRubies = parseInt(window.localStorage.getItem("rubies"));

        if(spin.innerHTML == "Start"){
            if(parseInt(bet.value) <= currentRubies && currentRubies > 0 && parseInt(bet.value) > 0){
                window.localStorage.setItem("playingDefuse","true");
                spin.innerHTML = "Stop";
                startDefuseGame();
            }else{
                alert("Invalid bet");
            }
        }else{
            window.localStorage.setItem("playingDefuse","false");
        }
    }

    function resolveAfter2Seconds() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            },2000);
        });
    }

    async function startDefuseGame() {
        const spin = getElement('defuseSpin');
        const item1 = getElement('defuseItem1');
        const bet = getElement('defuseBet');
        const bombpic = document.getElementById("defuseBomb");
        const boompic = document.getElementById("defuseBoom");
        boompic.style.display = "none";
        bombpic.style.display = "block";

        var mult = 0;
        var bomb = false;
        while(mult < 10 && bomb == false && window.localStorage.getItem("playingDefuse") == "true"){
            const result = await resolveAfter2Seconds();
            if(window.localStorage.getItem("playingDefuse") == "true"){
                item1.innerHTML = mult.toString();
                const rdNum = Math.floor(Math.random() * 101);
                mult++;
                if(rdNum <= 20){
                    bomb = true;
                    bombpic.style.display = "none";
                    boompic.style.display = "block";
                    spin.disabled = true;
                    item1.innerHTML = -mult.toString();
                    item1.style.color = 'red';
                    const msg = document.getElementById("defuseWinMessage");
                    msg.style.display = "none";
                    updateRubies(-parseInt(bet.value) * mult);
                    setTimeout(function(){
                        setupDefuseGame();
                    }, 4000);
                    return;
                }else{
                    item1.innerHTML = mult.toString();
                    item1.style.color = "green";
                }
            }
        }
        spin.disabled = true;
        const msg = document.getElementById("defuseWinMessage");
        msg.style.display = "block";
        playWin();
        updateRubies(parseInt(bet.value) * mult);
        setTimeout(function(){
            setupDefuseGame();
        },4000);
    }

    function updateRubies(amt){
        let currentRubies;
        if(parseInt(window.localStorage.getItem("rubies")) != undefined){
            currentRubies = parseInt(window.localStorage.getItem("rubies"));
            currentRubies += amt;
        }else{
            currentRubies = amt;
        }
        console.log("Ruby count updated to " + currentRubies);
        if(currentRubies <= 0){
            currentRubies = 0;
            alert("OH NO! ....... Your Rubies! ...... Their Gone! \nReset rubies to start over :(");
        }
        getElement('currentRubies').innerHTML = `${currentRubies}`;
        window.localStorage.setItem("rubies",currentRubies);
    }

    function resetRubies(){
        window.localStorage.setItem("rubies",500);
        updateRubies(0);
    }

    function playWin() {
        const boing = document.getElementById("win");
       //NOT A FUNCTION
       // win.play();
    }

    function showMessage() {
        const msg = document.getElementById("message");
        msg.style.display = "block";
    }

    function hideMessage() {
        const msg = document.getElementById("message");
        msg.style.display = "none";
    }