'use strict';
const wheel=document.querySelector('#wheel');
const button=document.querySelector('#spin');
const result=document.querySelector('#result');
const resultText=document.querySelector('#resultText');
const hint=document.querySelector('#hint');
const reveal=document.querySelector('#reveal');
const revealImage=document.querySelector('#revealImage');
const revealName=document.querySelector('#revealName');
document.querySelector('#revealClose').addEventListener('click',()=>reveal.close());
let currentAngle=0,spinning=false;
function randomUnit(){const values=new Uint32Array(1);crypto.getRandomValues(values);return values[0]/4294967296}
button.addEventListener('click',async()=>{
  if(spinning)return;
  spinning=true;button.disabled=true;button.firstChild.textContent='Girando... ';result.classList.remove('won');resultText.textContent='Boa sorte!';hint.textContent='A roleta está girando...';
  const winner=randomUnit()<.5?0:1;
  // The pointer is at the top. Pick an interior point in the chosen half.
  const fraction=(winner+0.15+randomUnit()*0.7)/2;
  const target=(360-fraction*360)%360;
  const delta=(target-currentAngle+360)%360;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const destination=currentAngle+360*(reduced?1:8)+delta;
  const animation=wheel.animate([{transform:`rotate(${currentAngle}deg)`},{transform:`rotate(${destination}deg)`}],{duration:12000,easing:'cubic-bezier(.14,.55,.16,1)',fill:'forwards'});
  try{await animation.finished;currentAngle=target;wheel.style.transform=`rotate(${currentAngle}deg)`;animation.cancel();resultText.textContent=winner===0?'Chaveiro trena Enaex':'Lanterna chaveiro Enaex';result.classList.add('won');revealName.textContent=resultText.textContent;revealImage.src=winner===0?'assets/trena.png':'assets/lanterna.png';revealImage.alt=resultText.textContent;reveal.showModal();hint.textContent='Clique para sortear novamente.'}catch{hint.textContent='Não foi possível concluir o giro. Tente novamente.'}finally{spinning=false;button.disabled=false;button.firstChild.textContent='Girar a roleta '}
});
