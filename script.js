const alleNamen = ["Jasper",   "Jeppe", "Jessie",   "Kevin",   "Laura",  "Lowijs", "Milan",  "Nasi",  "Senne",  "Sharon",  "Steen",  
   "Toto", "Zoë", "Jasper","Jeppe","Jessie","Kevin","Laura","Lowijs","Milan","Nasi","Senne","Sharon","Steen","Toto","Zoë"]
let names = [...alleNamen];
let numlist = [];
let extraNamen = [];
let enableDraaien;
const canvas = document.getElementById("radjeCanvas");
const ctx = canvas.getContext("2d");


function show(id) {
   document.getElementById(id).style = 'display: block'
}

function hide(id){
   document.getElementById(id).style = 'display: none'
}

function showInline(id) {
   document.getElementById(id).style = 'display: inline-block'
}

function addCheckbox(formId, name, suffix) {
   const form = document.getElementById(formId);
   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.id = `${name}${suffix}`;
   checkbox.value = name;
 
   const label = document.createElement("label");
   label.htmlFor = checkbox.id;
   label.innerHTML = name;
 
   form.appendChild(document.createElement("br"));
   form.appendChild(checkbox);
   form.appendChild(label);
 }
 

function voegNaamToe(){
   let naam = document.getElementById('naamToevoegen').value;
   if (names.includes(naam) || extraNamen.includes(naam)){
      alert('Deze naam staat al in de lijst: ' + naam);
   } else {
      extraNamen.push(naam);   
      addCheckbox('boodschappenForm', naam, '1');
      addCheckbox('gekooktForm', naam, '2')
   }
   document.getElementById('naamToevoegen').value = ''
}

function removeName(name, times=1){
   for (let i = 0; i < times; i++) {
      let idx = names.indexOf(name);
      if (idx !== -1) {
        names.splice(idx, 1);
      } else {
        alert('Een naam is te vaak weggehaald: ${name}');
        break;
      }
    }
}

function validateForm() {
  let afwezig = Array.from(document.querySelectorAll('input[name="afwezig"]:checked')).map(cb => cb.value);
  let boodschap = Array.from(document.querySelectorAll('input[name="boodschappen"]:checked')).map(cb => cb.value);
  let gekookt = Array.from(document.querySelectorAll('input[name="koken"]:checked')).map(cb => cb.value);
  names = [...alleNamen];

   if (extraNamen.length > 0) {
      for (let naam of extraNamen) {
         names.push(naam);
         names.push(naam);
      } 
   }

   afwezig.forEach(name => removeName(name, 2));
   boodschap.forEach(name => removeName(name));
   gekookt.forEach(name => removeName(name));

  if (gekookt.length > 3) {
     alert("Te veel mensen hebben gekookt");
  }
  document.getElementById('display2').innerHTML = names
  show('gedraaidenamen');
  hide('namenkiezen');
  show('terugniet');
  show('terugwel');
  hide('nugedraaiddiv');
  
  show('disp2button');
  show('nugedraaid');
  document.getElementById('nugedraaid').innerHTML = '';
  show('buttons');

  show('radjeCanvas');
  nuDraaien = false;
  stopDraai();
  tekenRadje(0);
  enableDraaien = true;
  show('klikDraaienText');
  
}

function random_int() {
   if (enableDraaien) {
      naam_gedraaid = names[Math.floor((Math.random() * names.length))];
      enableDraaien = false;
      hide('klikDraaienText');
      nuDraaien = true;
      draaiAnimate(names.indexOf(naam_gedraaid)/names.length)
   }
}


function netGedraaid() {
   numlist.push(naam_gedraaid + '<br>')
   document.getElementById('nugedraaid').innerHTML = naam_gedraaid;
   document.getElementById('display').innerHTML = numlist.join('')
   showInline('afwasbakdiv');
   if (naam_gedraaid == 'Jasper') {
      hide('afwas');
   } else {
      showInline('afwas');
   }
   show('nugedraaiddiv');
}

function afwas() {
  names.splice(names.indexOf(naam_gedraaid),1)
  document.getElementById('display2').innerHTML = names
  hide('afwasbakdiv');
  hide('nugedraaiddiv');
  hide('klikDraaienText');
   tekenRadje(finishedAngle)
   enableDraaien = true;
}

function bak() {
  hide('afwasbakdiv');
  hide('nugedraaiddiv');
  show('klikDraaienText');
  tekenRadje(finishedAngle);
  enableDraaien = true;
}

function terugNietReset() {
  show('namenkiezen');
  hide('buttons');
  hide('afwasbakdiv');
  hide('radjeCanvas');
  naam_gedraaid = null;
  stopDraai();
  ctx.clearRect(0, 0, 963, 963);
}

function terugWelReset(){
   resetGedraaideNamen()
  show('namenkiezen');
  hide('buttons');
  hide('afwasbakdiv');
  hide('radjeCanvas');
  naam_gedraaid = null;
  stopDraai();
  ctx.clearRect(0, 0, 963, 963);
  names = [...alleNamen];
}

function displ2() {
  let element = document.getElementById('display2');
  if (element.style.display === 'none') {
      element.style.display = 'block';
  } else {
      element.style.display = 'none';
  }
}

function resetGedraaideNamen(){
   numlist = [];
   naam_gedraaid = ''

  document.getElementById('display').innerHTML = naam_gedraaid;
}

var radcomp;
let center = [442,442];
const radius = 440;
ctx.textAlign = 'end';
let radjeColors = ['#0b031a', '#38228e', '#5b45a7' , '#8792c0', '#031e41']
let draaiInterval = null;

class component {
   constructor() {
      this.angle = 0;
      this.update = function () {
         ctx.beginPath();
         ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
         ctx.strokeStyle = "white";
         ctx.stroke();
         ctx.save();
         ctx.translate(center[0], center[1]);
         ctx.rotate(this.angle);
         fontsize = 140-3.5*names.length
         ctx.font = fontsize + 'px sans serif'
         for (let i = 0; i < names.length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, i*((2*Math.PI)/names.length), (i+1)*((2*Math.PI)/names.length));
            ctx.fillStyle = radjeColors[i%radjeColors.length];
            ctx.fill();;

            ctx.save()
            ctx.translate(0,0)
            let angle = i/names.length * 2* Math.PI + (1/names.length * 2* Math.PI)/2
            ctx.rotate(angle + 0.0009 * fontsize)
            ctx.fillStyle = 'white'
            ctx.fillText(names[i],426,0)
            ctx.restore()
         }
         for (let i = 0; i < names.length; i++) {
            ctx.beginPath();
            let x = Math.cos(i*((2*Math.PI)/names.length)) * (radius-5) 
            let y = Math.sin(i*((2*Math.PI)/names.length))  * (radius-5)
            ctx.moveTo(x, y)
            ctx.arc(x, y, 5, 0, Math.PI * 2)
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fill();  
         }
         ctx.restore();
      };
   }
}

class Wijzer {
   constructor() {
      this.angle = 0;
      this.update = function () {
         ctx.save();
         ctx.translate(890,center[1]);      
         ctx.rotate(this.angle);
         ctx.beginPath();
         ctx.moveTo(0,17);
         ctx.lineTo(-50, 0);
         ctx.lineTo(0, -17);
         ctx.fillStyle = 'blue';
         ctx.fill();
         ctx.stroke();
         ctx.beginPath();
         ctx.arc(0,0, 17, 1.5*Math.PI, 0.5*Math.PI)
         ctx.fill()
         ctx.stroke();
         ctx.restore();
      }
   }
}

let dotlist = []

function draaiAnimate(angleStop) {
  if (draaiInterval !== null) return;

  dotlist = []

   for (let i = 0; i < names.length; i++) {
      dotlist.push(i*((2*Math.PI)/names.length))
      dotlist.push(i*((2*Math.PI)/names.length)  + 2 * Math.PI)
   }


  radcomp = new component();
  wijzercomp = new Wijzer();
  ctx.frameNo = 0;
  lowerBound = ((1-angleStop) - 1/(names.length)) * 2 * Math.PI + 2 * Math.PI + 0.01
  upperBound = ((1-angleStop) * 2 * Math.PI + 2 * Math.PI) - 0.01
   angleFinish = Math.random() * (upperBound - lowerBound) + lowerBound
  draaiInterval = setInterval(function () {
     updateGameArea(angleFinish);
  }, 20);
}

function stopDraai() {
   if (draaiInterval !== null) {
       clearInterval(draaiInterval);
       draaiInterval = null;
   }
}

function tekenRadje(drawingAngle) {
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "white";
  ctx.stroke();

  ctx.save();
  ctx.translate(center[0], center[1]);
  ctx.rotate(drawingAngle);

  fontsize = 140-3.2*names.length

   ctx.font = fontsize + 'px sans serif'
  for (let i = 0; i < names.length; i++) {
   ctx.beginPath();
   ctx.moveTo(0,0);
   ctx.arc(0, 0, radius, i*((2*Math.PI)/names.length), (i+1)*((2*Math.PI)/names.length));
   ctx.fillStyle = radjeColors[i%radjeColors.length];
   ctx.fill();;

   ctx.save()
   ctx.translate(0, 0)
   angle = i/names.length * 2* Math.PI + (1/names.length * 2* Math.PI)/2
   ctx.rotate(angle + 0.0009 * fontsize)
   ctx.fillStyle = 'white';
   ctx.fillText(names[i],426,0)
   ctx.restore()
  }
  for (let i = 0; i < names.length; i++) {
   ctx.beginPath();
   let x = Math.cos(i*((2*Math.PI)/names.length)) * (radius-5) 
   let y = Math.sin(i*((2*Math.PI)/names.length))  * (radius-5)
   ctx.moveTo(x, y)
   ctx.arc(x, y, 5, 0, Math.PI * 2)
   ctx.stroke();
   ctx.fillStyle = 'white';
   ctx.fill();  
}


  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(890, center[1]+17);
  ctx.lineTo(840, center[1]);
  ctx.lineTo(890, center[1]-17);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(890,center[1], 17, 1.5*Math.PI, 0.5*Math.PI)
  ctx.fill()
  
  ctx.stroke();
}




function updateGameArea(angleFinish) {
   if (nuDraaien) {
      ctx.clearRect(0, 0, 963, 963);

      for (let dot of dotlist) {
         if ((radcomp.angle - dot) > -0.07 && ((radcomp.angle - dot) < 0 )) {
            wijzercomp.angle -= 0.3
            break
         } 
         if ((radcomp.angle - dot) > 0.1 || ((radcomp.angle - dot) < -0.07 )) {
         wijzercomp.angle = 0
         }
      }

      if (radcomp.angle < (angleFinish-0.01)) {
         radcomp.angle += (angleFinish-radcomp.angle) * Math.PI / 180;
      } else {
         finishedAngle = radcomp.angle;
         clearInterval(ctx.interval);
         wijzercomp.angle = 0
         netGedraaid();
         stopDraai()

      }   
      radcomp.update();
      wijzercomp.update();
   }
}

