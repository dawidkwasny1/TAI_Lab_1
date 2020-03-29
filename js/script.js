let preQuestions;

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let answers = document.querySelectorAll('.list-group-item');
let question = document.querySelector('.question');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let displayIndex = document.querySelector('#index');

let index = 0;
let points = 0;
let selElem = '';

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp=>resp.json())
    .then(resp=>{
        preQuestions=resp;
        setQuestion(index);
        activateAnswers();
        function doAction(event) {
            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if (event.target.innerHTML === preQuestions[index].correct_answer) {
                points++;
                pointsElem.innerText = points;
                markCorrect(event.target);
            }
            else {
                markInCorrect(event.target);
            }
            disableAnswers();
        }
        
        function setQuestion(index) {
            //clearClass();
            question.innerHTML = preQuestions[index].question;
            answers[0].innerHTML = preQuestions[index].answers[0];
            answers[1].innerHTML = preQuestions[index].answers[1];
            answers[2].innerHTML = preQuestions[index].answers[2];
            answers[3].innerHTML = preQuestions[index].answers[3];
            if (preQuestions[index].answers.length===2) {
                answers[2].style.display = 'none';
                answers[3].style.display = 'none';
            }
            else {
                answers[2].style.display = 'block';
                answers[3].style.display = 'block';
            }
        }
        
        function setIndex(index) {
            displayIndex.innerHTML = index+1;
        }
        
        function activateAnswers() { 
            for (let i=0; i<answers.length; i++) {
                answers[i].addEventListener('click', doAction);
            }
        }
        
        function disableAnswers() {
            for (let i=0; i<answers.length; i++) {
                answers[i].removeEventListener('click', doAction);
            }
            
        }
        
        function markCorrect(elem) {
            selElem = elem;
            elem.classList.add('correct');
        }
        
        function markInCorrect(elem) {
            selElem = elem;
            elem.classList.add('incorrect')
        }
        
        
        next.addEventListener('click', function() {
            if (index < preQuestions.length-1) {
                index++;
                setQuestion(index);
                setIndex(index);
                activateAnswers();
            }
            else {
                let obj;
                if(localStorage.getItem('user') === null) {
                    obj = {score: points, numberOfGames: 1, average: points};
                }
                else {
                    let saved = JSON.parse(localStorage.getItem('user'));
                    let avg = (saved.average*saved.numberOfGames+points)/(saved.numberOfGames+1);
                    obj = {score: points, numberOfGames: (saved.numberOfGames+1), average: avg};
                }
                average.innerHTML = obj.average;
                localStorage.setItem('user',JSON.stringify(obj));
                
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
            }
            selElem.classList.remove('correct');
            selElem.classList.remove('incorrect');
        });
        
        previous.addEventListener('click', function() {
            if(index > 0) {
                index--;
                setQuestion(index);
                activateAnswers();
                setIndex(index);
            }
            selElem.classList.remove('correct');
            selElem.classList.remove('incorrect');
        });
        
        restart.addEventListener('click', function (event) {
            event.preventDefault();
        
            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            setIndex(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });
    })


