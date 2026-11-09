'use strict';
const wheel=document.querySelector('#wheel');
const button=document.querySelector('#spin');
const result=document.querySelector('#result');
const resultText=document.querySelector('#resultText');
const hint=document.querySelector('#hint');
const reveal=document.querySelector('#reveal');
const revealImage=document.querySelector('#revealImage');
const revealName=document.querySelector('#revealName');
const revealTitle=document.querySelector('#revealTitle');
const revealEyebrow=document.querySelector('.reveal-eyebrow');
const revealLabel=document.querySelector('.reveal-label');
document.querySelector('#revealClose').addEventListener('click',()=>reveal.close());
let currentAngle=0,spinning=false;
function randomUnit(){const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]/4294967296}
button.addEventListener('click',async()=>{
  if(spinning)return;
  spinning=true;button.disabled=true;button.firstChild.textContent='Girando... ';result.classList.remove('won');resultText.textContent='Boa sorte!';hint.textContent='A roleta está girando...';
  const roll=randomUnit();
  const winner=roll<0.15?0:roll<0.30?1:2;
  // Pick the result by its configured probability, then land inside its matching slice.
  const slice=winner===0?0:winner===1?2:(randomUnit()<0.5?1:3);
  const fraction=(slice+0.15+randomUnit()*0.7)/4;
  const target=(360-fraction*360)%360;
  const delta=(target-currentAngle+360)%360;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const destination=currentAngle+360*(reduced?1:8)+delta;
  const animation=wheel.animate([{transform:`rotate(${currentAngle}deg)`},{transform:`rotate(${destination}deg)`}],{duration:12000,easing:'cubic-bezier(.14,.55,.16,1)',fill:'forwards'});
  try{await animation.finished;currentAngle=target;wheel.style.transform=`rotate(${currentAngle}deg)`;animation.cancel();const names=['Chaveirinho - Mini Trena','Chaveirinho - Mini Lanterna','Não foi dessa vez'];const images=['assets/trena.png','assets/lanterna.png','assets/xbooster-animado.svg'];const noPrize=winner===2;resultText.textContent=names[winner];result.classList.add('won');reveal.classList.toggle('no-prize',noPrize);revealEyebrow.textContent=noPrize?'QUASE LÁ!':'TEMOS UM BRINDE!';revealTitle.textContent=noPrize?'Não foi dessa vez':'Parabéns!';revealLabel.textContent=noPrize?'BOA SORTE NA PRÓXIMA':'VOCÊ GANHOU';revealName.textContent=noPrize?'Obrigado por participar!':names[winner];revealImage.src=images[winner];revealImage.alt=names[winner];reveal.showModal();hint.textContent='Clique para sortear novamente.'}catch{hint.textContent='Não foi possível concluir o giro. Tente novamente.'}finally{spinning=false;button.disabled=false;button.firstChild.textContent='Girar a roleta '}
});
