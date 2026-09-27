const $ = (id) => document.getElementById(id);

function scrollToId(id){
  document.getElementById(id)?.scrollIntoView({behavior:"smooth", block:"start"});
}

let seconds = 18 * 60 + 42;
let cameraMode = "RGB";

function pad(n){ return String(n).padStart(2,"0"); }

function updateMissionTime(){
  seconds++;
  const h = Math.floor(seconds/3600);
  const m = Math.floor((seconds%3600)/60);
  const s = seconds%60;
  $("missionTime").textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function randomWalk(value, min, max, step){
  const next = value + (Math.random()*2-1)*step;
  return Math.min(max, Math.max(min, next));
}

let values = {ch4:1.18,o2:20.3,temp:31.8,humidity:72,battery:87,signal:94};

function updateTelemetry(){
  values.ch4 = randomWalk(values.ch4, 1.02, 1.34, .035);
  values.o2 = randomWalk(values.o2, 19.9, 20.6, .06);
  values.temp = randomWalk(values.temp, 30.5, 33.5, .22);
  values.humidity = randomWalk(values.humidity, 68, 76, .5);
  values.battery = Math.max(70, values.battery - 0.01);
  values.signal = randomWalk(values.signal, 88, 98, .7);

  $("ch4").textContent = values.ch4.toFixed(2) + "%";
  $("o2").textContent = values.o2.toFixed(1) + "%";
  $("temp").textContent = values.temp.toFixed(1) + "°";
  $("humidity").textContent = Math.round(values.humidity) + "%";
  $("batteryTop").textContent = Math.round(values.battery) + "%";
  $("signalTop").textContent = Math.round(values.signal) + "%";

  const risk = Math.max(8, Math.min(35, Math.round(
    (values.ch4-1)*28 + (20.6-values.o2)*15 + Math.max(0,values.temp-30)*2
  )));
  $("riskScore").textContent = risk;
}

function toggleCamera(){
  cameraMode = cameraMode === "RGB" ? "THERMAL" : "RGB";
  document.querySelector(".camera-overlay.top").textContent = `CAM-01 · ${cameraMode} VIEW`;
  showToast(`${cameraMode} view selected (demo)`);
}

let toastTimer;
function showToast(message){
  const t = $("toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove("show"),2200);
}

setInterval(updateMissionTime, 1000);
setInterval(updateTelemetry, 1800);
updateTelemetry();
