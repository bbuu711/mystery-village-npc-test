// --- Audio Effects System (Web Audio API) ---
class GameSound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTyping() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150 + Math.random() * 80, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playClick() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playConfirm() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Play a dual note chime
    [523.25, 659.25].forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);
      
      gain.gain.setValueAtTime(0.06, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.3);
    });
  }

  playSuccess() {
    if (this.muted || !this.ctx) return;
    this.init();
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord Arpeggio
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      
      gain.gain.setValueAtTime(0.05, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.5);
    });
  }
}

const sound = new GameSound();

// --- Ambient Particle System ---
function initParticles() {
  const container = document.getElementById('particles');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize properties
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    
    const duration = Math.random() * 10 + 10;
    particle.style.animationDuration = `${duration}s`;
    
    const delay = Math.random() * 10;
    particle.style.animationDelay = `-${delay}s`;
    
    container.appendChild(particle);
  }
}

// --- Quiz Data ---
const quizData = [
  {
    systemMessage: "[모닥불] \"반가워! 미스터리 마을로 떠나기 전에 네 성향을 동기화할게.\n평소에 어떤 스타일로 게임하는 걸 가장 좋아해?\"",
    question: "Q1. 플레이 스타일 선택",
    options: [
      { text: "🎨 1 : 고장 난 주민들의 속마음 이야기를 듣고\n치료하는 스토리 중심 플레이", scores: { emotional: 3, social: 1 }, item: "🎨" },
      { text: "⚙️ 2 : 마을이 왜 고장 났는지 원인을 분석하고\n버그를 고치는 공략 중심 플레이", scores: { rational: 3, orderly: 1 }, item: "⚙️" },
      { text: "🏡 3 : 내 방을 아기자기한 가구로 예쁘게 꾸미고\n친구들을 초대하는 힐링 중심 플레이", scores: { social: 3, emotional: 1 }, item: "🏡" },
      { text: "🏆 4 : 규칙대로 정해진 일일 퀘스트와\n도전 과제를 완벽하게 깨는 100점 플레이", scores: { orderly: 3, rational: 1 }, item: "🏆" }
    ]
  },
  {
    systemMessage: "[모닥불] \"마을에 도착하니 네 머리 위에 '스케줄 슬롯'이 켜졌어.\n네가 매일 무한 반복하고 있는 '진짜 네 현실 일정'은 어때?\"",
    question: "Q2. 나의 일상 데이터 연동",
    options: [
      { text: "📚 1 : 동아리, 팀플, 스터디, 자치 모임으로\n하루가 꽉 찬 바쁜 루틴", scores: { social: 3, emotional: 1 }, item: "🏡" },
      { text: "💼 2 : 생활비(골드)를 벌기 위해\n고정 요일마다 꼭 가야 하는 알바 루틴", scores: { orderly: 3, rational: 1 }, item: "🏆" },
      { text: "✈️ 3 : 언제든 바캉스나 번개 모임을 떠날 수 있게\n비워둔 즉흥 루틴", scores: { emotional: 3, social: 1 }, item: "🎨" },
      { text: "☕ 4 : 나를 묶어두는 일정이 단 하나도 없어서\n언제든 풀 접속 가능한 루틴", scores: { rational: 3, social: 1 }, item: "☕" }
    ]
  },
  {
    systemMessage: "[모닥불] \"거울을 들여다보니 정보창 이면에 숨겨진 속성이 빛나기 시작해.\n네 가방 속 깊은 곳에 남겨진 '나만의 고유한 특징'은 뭐야?\"",
    question: "Q3. 내면의 인벤토리 스캔",
    options: [
      { text: "✨ 1 : 내 개성과 독특한 취향을 표현해 둔\n'나만의 비밀 마크(문양스킨)'", scores: { emotional: 3, social: 1 } },
      { text: "🤝 2 : 성별 상관없이 마음이 가장 잘 통하는\n소중한 친구와 '평생 단짝 서약' 맺기", scores: { social: 3, emotional: 1 } },
      { text: "🌱 3 : 멘탈 관리를 위해 명상이나 일기 쓰기 등\n'나만의 마음 챙김 루틴'을 꼭 챙기기", scores: { orderly: 3, rational: 1 } },
      { text: "🔮 4 : 치열한 현실 과제들에 치여 마음의 에너지가\n보라색으로 깜빡깜빡 방전된 상태", scores: { rational: 3, emotional: 1 }, item: "🔮" }
    ]
  },
  {
    systemMessage: "[모닥불] \"축하해! 주민들의 마음을 다 고쳐줬구나.\n마침내 마음의 '틈' 너머에 숨겨져 있던 진짜 소원이 나타났어.\n네가 지금 가장 풀고 싶은 소원은?\"",
    question: "Q4. 틈새 너머의 진짜 소원",
    options: [
      { text: "💌 1 : 캠퍼스에서 마음이 딱 맞는 파트너를 만나\n이쁜 연애를 하는 것", scores: { social: 3, emotional: 1 } },
      { text: "🎯 2 : 내 전공 포트폴리오를 완성해서\n원하는 꿈의 직장에 무사히 합격하는 것", scores: { rational: 3, orderly: 1 }, item: "⚙️" },
      { text: "🕊️ 3 : 주변 사람들과 오해나 싸움 없이\n상처받지 않고 사이좋게 지내는 것", scores: { orderly: 3, social: 1 } },
      { text: "🛌 4 : 피로 게이지가 꽉 차서 지친 나에게,\n다 끄고 침대 속에서 푹 쉴 수 있는 휴식을 주는 것", scores: { emotional: 3, rational: 1 }, item: "🛌" }
    ]
  }
];

// --- Archetype Mapping ---
const archetypes = {
  emotional: {
    name: "슬픈 눈의 감성 시인",
    badge: "✍️",
    tagline: "#감성주의 #예술가 #따뜻한_치유",
    description: "마법사의 장난으로 감정이 늘 겉돌지만, 깊은 내면에는 따뜻한 온기가 가득한 NPC입니다. 슬픈 눈으로 웃으며 마을 한편에서 조용히 풍경을 그리거나 음악을 연주하고 있을 거예요. 이 NPC와 친해지면 숨겨진 히든 에피소드를 감상할 수 있습니다.",
    item: "노을빛 엽서",
    interaction: "조용한 산책 동행",
    compatPerfect: "파티 러버 홈데코레이터",
    compatWorst: "묵묵한 완벽주의 가이드"
  },
  rational: {
    name: "냉철한 전략가 연금술사",
    badge: "🧪",
    tagline: "#전략가 #이성적 #스킬마스터 #효율중심",
    description: "마을의 얽히고설킨 마법의 코드를 해독하기 위해 밤낮으로 분석하는 전략가형 NPC입니다. 늘 이성적이고 차분하지만, 마을 축제나 모험의 승리 공식을 설계해 주는 든든한 동반자입니다. 성장을 돕는 핵심 가이드를 제공합니다.",
    item: "비밀의 나침반",
    interaction: "스킬트리 분석 상담",
    compatPerfect: "묵묵한 완벽주의 가이드",
    compatWorst: "파티 러버 홈데코레이터"
  },
  social: {
    name: "파티 러버 홈데코레이터",
    badge: "🎉",
    tagline: "#다정다감 #파티러버 #소중한서약 #인맥도감",
    description: "우울한 미스터리 마을을 밝히기 위해 매일 아기자기한 홈파티를 기획하는 활기찬 NPC입니다! 수많은 모임 일정과 소중한 인연을 맺는 것이 가장 큰 낙입니다. 이 NPC의 집에 초대받으면 온갖 귀여운 수집품들을 구경할 수 있습니다.",
    item: "은하수 전구",
    interaction: "러블리 홈파티 초대",
    compatPerfect: "슬픈 눈의 감성 시인",
    compatWorst: "냉철한 전략가 연금술사"
  },
  orderly: {
    name: "묵묵한 완벽주의 가이드",
    badge: "🛡️",
    tagline: "#완벽주의 #성실한비서 #규칙적인일과 #도감수집",
    description: "마을의 질서와 가이드라인을 철저히 지키는 듬직한 NPC입니다. 묵묵히 정해진 일과와 아르바이트를 해내며, 마을의 역사와 규칙을 기록합니다. 처음에는 다가가기 어렵지만, 시간이 지날수록 누구보다 단단한 의지가 되어줍니다.",
    item: "가죽 양장본 일기장",
    interaction: "마을 순찰 동행",
    compatPerfect: "냉철한 전략가 연금술사",
    compatWorst: "슬픈 눈의 감성 시인"
  }
};

// --- App State ---
let currentQuestionIndex = 0;
let equippedItems = [];

let selectedOptionIndex = null;
let userScores = {
  emotional: 0,
  rational: 0,
  social: 0,
  orderly: 0
};
let isTyping = false;
let typingTimer = null;

// --- DOM Elements ---
const audioControl = document.getElementById('audioControl');
const screenIntro = document.getElementById('screen-intro');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const introSystemBox = document.getElementById('intro-system-box');
const introSystemText = document.getElementById('intro-system-text');
const btnStart = document.getElementById('btn-start');

const quizSystemBox = document.getElementById('quiz-system-box');
const quizSystemText = document.getElementById('quiz-system-text');
const dialogNextIndicator = document.getElementById('dialog-next-indicator');
const quizCard = document.getElementById('quiz-card');
const questionTitle = document.getElementById('question-title');
const optionsList = document.getElementById('options-list');
const btnNext = document.getElementById('btn-next');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Results elements
const resultBadge = document.getElementById('result-badge');
const resultNpcName = document.getElementById('result-npc-name');
const resultTagline = document.getElementById('result-tagline');
const resultDescription = document.getElementById('result-description');
const statEmotional = document.getElementById('stat-emotional');
const statRational = document.getElementById('stat-rational');
const statSocial = document.getElementById('stat-social');
const statOrderly = document.getElementById('stat-orderly');
const valEmotional = document.getElementById('val-emotional');
const valRational = document.getElementById('val-rational');
const valSocial = document.getElementById('val-social');
const valOrderly = document.getElementById('val-orderly');
const resultItem = document.getElementById('result-item');
const resultInteraction = document.getElementById('result-interaction');
const resultCompatPerfect = document.getElementById('result-compat-perfect');
const resultCompatWorst = document.getElementById('result-compat-worst');


const btnSubmit = document.getElementById('btn-submit');

// Character Element
const gameCharacter = document.getElementById('game-character');

// --- Helper Functions ---

// Audio toggle
audioControl.addEventListener('click', () => {
  const isMuted = sound.toggleMute();
  if (isMuted) {
    audioControl.classList.add('muted');
    audioControl.querySelector('.audio-icon').textContent = '🔇';
  } else {
    audioControl.classList.remove('muted');
    audioControl.querySelector('.audio-icon').textContent = '🔊';
    sound.init();
  }
});

// Dynamic typing effect
function typeText(element, text, callback) {
  element.textContent = '';
  isTyping = true;
  let index = 0;
  
  if (typingTimer) clearInterval(typingTimer);
  
  typingTimer = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      sound.playTyping();
      index++;
    } else {
      clearInterval(typingTimer);
      isTyping = false;
      if (callback) callback();
    }
  }, 35); // speed of typing
}

// Fast-forward typing
function skipTyping(element, text, callback) {
  clearInterval(typingTimer);
  element.textContent = text;
  isTyping = false;
  if (callback) callback();
}

// Particle init
initParticles();

// --- Main Quiz Flow Control ---

// Intro System Box Click:
// First click plays typing fast-forward. If typing is done, clicks start the quiz.
let introText = introSystemText.textContent.trim();
let introTypingDone = false;

// Trigger character walk on initial page load
function playIntroSequence() {
  introTypingDone = false;
  
  // Reset elements for fade-in
  const gameLogo = document.querySelector('.game-logo');
  gameLogo.classList.remove('fade-in');
  btnStart.classList.remove('fade-in');
  btnStart.classList.remove('pressed');
  gameLogo.style.display = 'block';
  btnStart.style.display = 'block';
  introSystemBox.style.display = 'none';

  // Move character back to document body if it was in the progress bar
  document.body.insertBefore(gameCharacter, document.querySelector('.app-container'));

  gameCharacter.style.display = 'block';
  gameCharacter.style.transform = 'none'; // Reset any transform from quiz screen
  gameCharacter.style.left = '50%';
  gameCharacter.style.bottom = '-100px'; // start offscreen
  gameCharacter.classList.add('walking');
  gameCharacter.style.transition = 'bottom 2.5s linear';
  
  // Target position just below the start button
  const targetBottom = window.innerHeight * 0.35; 
  
  setTimeout(() => {
    gameCharacter.style.backgroundPosition = '0 0'; // back facing as it walks up
    gameCharacter.style.bottom = `${targetBottom}px`;
    
    // After walking finishes
    setTimeout(() => {
      gameCharacter.classList.remove('walking');
      gameCharacter.style.backgroundPosition = '-120px 0'; // Front facing
      
      // Force a reflow so the fade-in animation restarts
      void gameLogo.offsetWidth;
      void btnStart.offsetWidth;
      
      // Fade in logo and start button
      gameLogo.classList.add('fade-in');
      btnStart.classList.add('fade-in');
      
      // Automatically jump and press start button after fade in
      setTimeout(() => {
        gameCharacter.classList.add('jumping');
        
        // Halfway through jump, press the button
        setTimeout(() => {
          btnStart.classList.add('pressed');
          // Note: audio might be blocked if no user interaction occurred yet, 
          // but we try to play it anyway.
          sound.playConfirm().catch(() => {}); 
        }, 300);
        
        // After jump finishes
        setTimeout(() => {
          gameCharacter.classList.remove('jumping');
          gameCharacter.style.display = 'none'; // hide character temporarily
          btnStart.style.display = 'none'; // hide button
          
          // Show intro text box and type
          introSystemBox.style.display = 'block';
          typeText(introSystemText, introText, () => {
            introTypingDone = true;
          });
          
        }, 600);
      }, 1500); // Wait 1.5s for the fade-in animation
      
    }, 2500);
  }, 50);
}


// --------------------------------------------------
// Story Sequence Logic
// --------------------------------------------------
const screenStory = document.getElementById('screen-story');
const screenForm = document.getElementById('screen-form');
const storySystemBox = document.getElementById('story-system-box');
const storySystemText = document.getElementById('story-system-text');
const storyNextIndicator = document.getElementById('story-next-indicator');
const btnToIntro = document.getElementById('btn-to-intro');

const betaName = document.getElementById('beta-name');
const betaContact = document.getElementById('beta-contact');
const betaAge = document.getElementById('beta-age');
const betaJob = document.getElementById('beta-job');
const betaAgree = document.getElementById('beta-agree');

const storyPages = [
  "평화로운 마을에 살던 주인공. 어느 날, 알 수 없는 이유로 모든 것이 엇갈려버린 '미스터리 마을'에 떨어지게 되었습니다.",
  "집으로 돌아가기 위해서는 흩어진 '조각'을 모두 모아야 합니다.",
  "미스터리 마을의 주민들을 치유하면서 점점 마을의 비밀에 다다르게 되는데..."
];
const finalStoryLine = "<br><br><span id='final-story-line'></span>";

let currentStoryIndex = 0;
let isStoryTypingDone = false;
let storyTimer = null;

function loadStoryPage(index) {
  isStoryTypingDone = false;
  storyNextIndicator.style.display = 'none';
  const text = storyPages[index];
  
  typeText(storySystemText, text, () => {
    if (index === 2) {
      storyTimer = setTimeout(() => {
        storySystemText.innerHTML += "<br><br><span id='final-story-line'></span>";
        const finalEl = document.getElementById('final-story-line');
        typeText(finalEl, "과연 주인공은 집으로 돌아갈 수 있을까요?", () => {
          isStoryTypingDone = true;
          storyNextIndicator.style.display = 'block';
        });
      }, 1200); // 1.2s pause
    } else {
      isStoryTypingDone = true;
      storyNextIndicator.style.display = 'block';
    }
  });
}

setTimeout(() => {
  if (document.getElementById('screen-story')) {
    loadStoryPage(currentStoryIndex);
  }
}, 500);

if (storySystemBox) {
  storySystemBox.addEventListener('click', () => {
    if (isTyping || (currentStoryIndex === 2 && !isStoryTypingDone)) {
      clearTimeout(storyTimer);
      skipTyping(storySystemText, storyPages[currentStoryIndex], () => {
        if (currentStoryIndex === 2) {
          storySystemText.innerHTML = storyPages[currentStoryIndex] + "<br><br>과연 주인공은 집으로 돌아갈 수 있을까요?";
        }
        isStoryTypingDone = true;
        storyNextIndicator.style.display = 'block';
      });
    } else if (isStoryTypingDone) {
      currentStoryIndex++;
      if (currentStoryIndex < storyPages.length) {
        loadStoryPage(currentStoryIndex);
      } else {
        sound.playClick();
        screenStory.classList.remove('active');
        screenForm.classList.add('active');
      }
    }
  });
}

function checkFormValidity() {
  if (betaName && betaAge && betaJob && betaContact && betaAgree) {
    if (betaName.value.trim() !== '' && betaAge.value.trim() !== '' && betaJob.value.trim() !== '' && betaContact.value.trim() !== '' && betaAgree.checked) {
      btnToIntro.disabled = false;
      btnToIntro.classList.remove('btn-disabled');
    } else {
      btnToIntro.disabled = true;
      btnToIntro.classList.add('btn-disabled');
    }
  }
}

if (betaName) {
  betaName.addEventListener('input', checkFormValidity);
  betaContact.addEventListener('input', checkFormValidity);
  betaAge.addEventListener('input', checkFormValidity);
  betaJob.addEventListener('input', checkFormValidity);
  betaAgree.addEventListener('change', checkFormValidity);
  
  btnToIntro.addEventListener('click', () => {
    if (btnToIntro.disabled) return;
    sound.playClick();
    screenForm.classList.remove('active');
    screenIntro.classList.add('active');
    playIntroSequence();
  });
}


introSystemBox.addEventListener('click', () => {
  if (isTyping) {
    skipTyping(introSystemText, introText, () => {
      introTypingDone = true;
    });
  } else if (introTypingDone) {
    startQuiz(); // Go to quiz after intro text is acknowledged
  }
});

function startQuiz() {
  screenIntro.classList.remove('active');
  
  setTimeout(() => {
    screenQuiz.classList.add('active');
    
    // Move character to progress bar
    gameCharacter.style.display = 'block';
    const progressContainer = document.querySelector('.quiz-progress-container');
    progressContainer.style.position = 'relative'; 
    progressContainer.appendChild(gameCharacter);
    
    gameCharacter.style.transition = 'left 0.5s ease-in-out';
    gameCharacter.style.position = 'absolute';
    gameCharacter.style.top = '-85px'; // sit on top of the bar
    gameCharacter.style.bottom = 'auto';
    gameCharacter.style.left = '0%';
    gameCharacter.style.transform = 'translateX(0)'; // Position just ahead of the line
    gameCharacter.style.backgroundPosition = '-180px 0'; // right facing
    
    loadQuestion(0);
  }, 400);
}

// Load Question step
let currentStepState = 'typing'; // typing -> waiting_click -> question

function loadQuestion(index) {
  currentQuestionIndex = index;
  selectedOptionIndex = null;
  btnNext.disabled = true;
  btnNext.className = 'btn btn-disabled';
  
  const qData = quizData[index];
  
  // Update progress bar
  const percentage = (index / quizData.length) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = `${index + 1} / ${quizData.length}`;
  document.documentElement.style.setProperty('--progress-ratio', index / (quizData.length - 1));
  
  // Move character
  if (gameCharacter) {
    gameCharacter.classList.add('walking');
    gameCharacter.style.left = `${percentage}%`;
    setTimeout(() => {
      gameCharacter.classList.remove('walking');
    }, 500); // Stop walking after move
  }

  // Hide Quiz Card (for choices)
  quizCard.style.display = 'none';
  dialogNextIndicator.style.display = 'none';
  
  currentStepState = 'typing';
  
  // Start typing system message
  typeText(quizSystemText, qData.systemMessage, () => {
    currentStepState = 'waiting_click';
    dialogNextIndicator.style.display = 'block';
  });
}

// Click on Quiz System Box to transition from system notice to actual question options
quizSystemBox.addEventListener('click', () => {
  const qData = quizData[currentQuestionIndex];
  
  if (currentStepState === 'typing') {
    // Fast-forward typing
    skipTyping(quizSystemText, qData.systemMessage, () => {
      currentStepState = 'waiting_click';
      dialogNextIndicator.style.display = 'block';
    });
  } else if (currentStepState === 'waiting_click') {
    // Show question and options
    sound.playClick();
    currentStepState = 'question';
    dialogNextIndicator.style.display = 'none';
    
    // Populate Question details
    questionTitle.textContent = qData.question;
    optionsList.innerHTML = '';
    
    qData.options.forEach((opt, idx) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option-item';
      optionEl.innerHTML = `
        <div class="option-radio">
          <div class="option-radio-dot"></div>
        </div>
        <div class="option-text">${opt.text}</div>
      `;
      
      optionEl.addEventListener('click', () => selectOption(idx));
      optionsList.appendChild(optionEl);
    });
    
    // Smoothly show quiz options card
    quizCard.style.display = 'block';
  }
});

function renderEquippedItems() {
  const container = document.getElementById('equipped-items');
  if (!container) return;
  container.innerHTML = '';
  equippedItems.forEach((item, idx) => {
    if (item) {
      const el = document.createElement('div');
      el.className = 'eq-item eq-item-' + idx;
      el.textContent = item;
      container.appendChild(el);
    }
  });
}

function renderEquippedItems() {
  const container = document.getElementById('equipped-items');
  if (!container) return;
  container.innerHTML = '';
  equippedItems.forEach((item, idx) => {
    if (item) {
      const el = document.createElement('div');
      el.className = 'eq-item eq-item-' + idx;
      el.textContent = item;
      container.appendChild(el);
    }
  });
}

function selectOption(index) {
  sound.playClick();
  selectedOptionIndex = index;
  
  // Update styling
  const items = optionsList.querySelectorAll('.option-item');
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
  
  // Enable Confirm Button
  btnNext.disabled = false;
  btnNext.className = 'btn btn-primary';
}

btnNext.addEventListener('click', () => {
  if (selectedOptionIndex === null) return;
  
  sound.playConfirm();
  
  // Add scores
  const selectedOption = quizData[currentQuestionIndex].options[selectedOptionIndex];
  for (const [key, value] of Object.entries(selectedOption.scores)) {
    userScores[key] += value;
  }
  
  // Go to next question or show results
  if (currentQuestionIndex + 1 < quizData.length) {
    loadQuestion(currentQuestionIndex + 1);
  } else {
    // Final progress bar fills up
    progressBar.style.width = '100%';
    
    if (gameCharacter) {
      gameCharacter.classList.add('walking');
      gameCharacter.style.left = '100%';
      setTimeout(() => {
        gameCharacter.classList.remove('walking');
        gameCharacter.style.display = 'none'; // hide character before result screen
      }, 500);
    }
    
    showResults();
  }
});

// --- Results Calculation & Rendering ---
function showResults() {
  sound.playSuccess();
  
  screenQuiz.classList.remove('active');
  document.documentElement.style.setProperty('--progress-ratio', 1);
  
  // Determine dominant archetype
  let dominantType = 'emotional';
  let maxScore = -1;
  
  for (const [type, score] of Object.entries(userScores)) {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type;
    }
  }
  
  // Render Result Screen Data
  const details = archetypes[dominantType];
  
  resultBadge.textContent = details.badge;
  resultNpcName.textContent = details.name;
  resultTagline.textContent = details.tagline;
  resultDescription.textContent = details.description;
  resultItem.textContent = details.item;
  resultInteraction.textContent = details.interaction;
  resultCompatPerfect.textContent = details.compatPerfect;
  resultCompatWorst.textContent = details.compatWorst;
  
  // Calculate proportional percentages for progress bars
  const total = userScores.emotional + userScores.rational + userScores.social + userScores.orderly;
  
  const pctEmotional = Math.round((userScores.emotional / total) * 100);
  const pctRational = Math.round((userScores.rational / total) * 100);
  const pctSocial = Math.round((userScores.social / total) * 100);
  const pctOrderly = 100 - (pctEmotional + pctRational + pctSocial);
  
  // Animate stat bars
  animateStatBar(statEmotional, valEmotional, pctEmotional);
  animateStatBar(statRational, valRational, pctRational);
  animateStatBar(statSocial, valSocial, pctSocial);
  animateStatBar(statOrderly, valOrderly, pctOrderly);
  
  setTimeout(() => {
    screenResult.classList.add('active');
  }, 500);
}

function animateStatBar(barEl, valEl, targetValue) {
  barEl.style.width = '0%';
  valEl.textContent = '0%';
  
  let currentVal = 0;
  const interval = setInterval(() => {
    if (currentVal < targetValue) {
      currentVal++;
      barEl.style.width = `${currentVal}%`;
      valEl.textContent = `${currentVal}%`;
    } else {
      clearInterval(interval);
    }
  }, 12);
}


// Submit button
btnSubmit.addEventListener('click', async () => {
  sound.playClick();
  
  if (btnSubmit.disabled) return;
  
  btnSubmit.disabled = true;
  const originalText = btnSubmit.textContent;
  btnSubmit.textContent = "저장 중...";
  btnSubmit.style.opacity = "0.7";

  try {
    const npcTypeEl = document.getElementById('result-npc-name');
    const npcType = npcTypeEl ? npcTypeEl.textContent : 'Unknown';
    const itemsStr = equippedItems.filter(i => i).join(', ');

    const payload = {
      name: betaName ? betaName.value.trim() : "Unknown",
      age_desc: betaAge ? betaAge.value.trim() : "Unknown",
      job: betaJob ? betaJob.value.trim() : "Unknown",
      contact: betaContact ? betaContact.value.trim() : "Unknown",
      npc_type: npcType,
      items: itemsStr
    };
    const response = await fetch("https://btnrstfbvynsmzzxwcfy.supabase.co/rest/v1/beta_testers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bnJzdGZidnluc216enh3Y2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTU2OTcsImV4cCI6MjEwMDQ3MTY5N30.-fhusuRmMexuUTwUT4R9ZX1oFM5l1R57xyj3BvW5Y_Y",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0bnJzdGZidnluc216enh3Y2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTU2OTcsImV4cCI6MjEwMDQ3MTY5N30.-fhusuRmMexuUTwUT4R9ZX1oFM5l1R57xyj3BvW5Y_Y",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("서버 응답 오류: " + response.status);
    }

    alert("베타테스트 결과가 성공적으로 제출되었습니다!\n소중한 의견 감사드립니다.");
    btnSubmit.textContent = "제출 완료";
    btnSubmit.style.background = "#4CAF50"; // Green color
    btnSubmit.style.color = "#fff";
    btnSubmit.style.opacity = "1";
    // Keep it disabled so they don't submit twice
  } catch (error) {
    console.error("Submission error:", error);
    alert("데이터 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    btnSubmit.disabled = false;
    btnSubmit.textContent = originalText;
    btnSubmit.style.opacity = "1";
  }
});

// Submit button
btnSubmit.addEventListener('click', () => {
  sound.playClick();
  alert("베타테스트 결과가 성공적으로 제출되었습니다!\n소중한 의견 감사드립니다.");
});
