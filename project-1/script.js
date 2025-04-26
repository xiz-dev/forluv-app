const el = document.querySelector('.heart');
const heart = $('.heart svg');
let tl = new TimelineMax({ paused: true });
let timeline = new mojs.Timeline();

tl.add(
TweenMax.to(heart, 0.15, {
  scaleX: .4,
  scaleY: .2,
  ease: Back.easeOut.config(4) }));


tl.add(
TweenMax.to(heart, 0.25, {
  scaleX: 1,
  scaleY: 1,
  ease: Back.easeOut.config(4) }));



const burst = new mojs.Burst({
  parent: el,
  count: 10,
  radius: { 0: 80 },
  duration: 1500,
  children: {
    radius: { 15: 0 },
    easing: 'cubic.out',
    degreeShift: 'rand(-50,50)' } });



const burst2 = new mojs.Burst({
  parent: el,
  count: 15,
  radius: { 0: 60 },
  children: {
    shape: 'line',
    stroke: 'white',
    fill: 'none',
    scale: 1,
    scaleX: { 1: 0 },
    easing: 'cubic.out',
    duration: 1000,
    degreeShift: 'rand(-50, 50)' } });



const bubbles = new mojs.Burst({
  parent: el,
  radius: 50,
  count: 5,
  timeline: { delay: 200 },
  children: {
    stroke: 'white',
    fill: 'none',
    scale: 1,
    strokeWidth: { 8: 0 },
    radius: { 0: 'rand(6, 10)' },
    degreeShift: 'rand(-50, 50)',
    duration: 400,
    delay: 'rand(0, 250)' } });



const circ_opt = {
  parent: el,
  radius: { 0: 50 },
  duration: 750,
  shape: 'circle',
  fill: 'none',
  stroke: '#FF4136',
  strokeWidth: 1,
  opacity: { 1: 0 } };


const circ = new mojs.Shape({
  ...circ_opt });


const circ2 = new mojs.Shape({
  ...circ_opt,
  delay: 100 });


timeline.add(circ, circ2);

const messages = [
  "รักนะจุ๊บๆ",
  "คิดถึงจังเลย",
  "ขอกอดดหน่อย",
  "ขอจับแก้มหน่อย",
  "ทำไมน่ารักจัง",
  "อยากกอดด",
  "เค้ารักเธอน้า",
  "เค้ารักเธอมากกว่า",
  "ไปหาได้ป่ะ <3",
  "luv u",
];

let usedMessages = new Set();
let usedPositions = new Set();

function getRandomMessage() {
  let message;
  let attempts = 0;
  
  do {
    message = messages[Math.floor(Math.random() * messages.length)];
    attempts++;
  } while (usedMessages.has(message) && attempts < messages.length);

  if (attempts < messages.length) {
    usedMessages.add(message);
    setTimeout(() => {
      usedMessages.delete(message);
    }, 1500);
  }
  
  return message;
}

function getRandomPosition() {
  const safeArea = {
    top: 150,    // ใต้หัวใจ
    bottom: window.innerHeight - 100,
    left: 100,
    right: window.innerWidth - 100
  };

  let attempts = 0;
  let position;
  
  do {
    const x = Math.random() * (safeArea.right - safeArea.left) + safeArea.left;
    const y = Math.random() * (safeArea.bottom - safeArea.top) + safeArea.top;
    position = { x, y };
    attempts++;
  } while (isPositionUsed(position) && attempts < 10);

  if (attempts < 10) {
    usedPositions.add(JSON.stringify(position));
    setTimeout(() => {
      usedPositions.delete(JSON.stringify(position));
    }, 1500);
  }
  
  return position;
}

function isPositionUsed(position) {
  return Array.from(usedPositions).some(pos => {
    const { x, y } = JSON.parse(pos);
    const distance = Math.sqrt(
      Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2)
    );
    return distance < 100; // ระยะห่างขั้นต่ำระหว่างข้อความ
  });
}

function createParticles(x, y) {
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = $('<div class="particle">');
    const angle = (Math.random() * 360) * Math.PI / 180;
    const velocity = 3 + Math.random() * 4;
    const size = 2 + Math.random() * 3;
    
    particle.css({
      left: x + 'px',
      top: y + 'px',
      width: size + 'px',
      height: size + 'px',
      '--angle': angle,
      '--velocity': velocity,
      '--delay': Math.random() * 0.5
    });
    
    $('body').append(particle);
    setTimeout(() => particle.remove(), 1500);
  }
}

// when clicking the button start the timeline/animation:
$(el).on('click', function () {
  if ($(el).hasClass('active')) {
    $(el).toggleClass('active');
  } else {
    $(el).toggleClass('active');
    tl.restart();
    burst.generate().replay();
    burst2.generate().replay();
    bubbles.generate().replay();
    timeline.replay();

    // Show random message at random position
    const message = getRandomMessage();
    const position = getRandomPosition();
    const messageElement = $('<div class="message">').text(message);
    messageElement.css({
      left: position.x + 'px',
      top: position.y + 'px'
    });
    $('body').append(messageElement);
    
    // Create particles
    createParticles(position.x, position.y);
    
    // Reset after 1.5 seconds
    setTimeout(() => {
      $(el).removeClass('active');
      messageElement.remove();
    }, 1500);
  }
});
