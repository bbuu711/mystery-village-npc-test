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
    type: 'single',
    systemMessage: "[모닥불] \"당신이 게임 속 NPC가 된다면 어떤 캐릭터일까요?\n첫 번째 질문부터 차근차근 시작해보자.\"",
    title: "STEP 1. NPC 성격 설정",
    question: "Q. NPC마다 성격에 따라 대사와 행동이 달라집니다.\n가장 나와 가까운 것을 선택해주세요.",
    options: [
      { text: "처음 보는 사람에게도 먼저 말을 건다.", scores: { social: 3, emotional: 1 } },
      { text: "친해질 때까지 상대를 지켜보는 편이다.", scores: { rational: 3, orderly: 1 } },
      { text: "새로운 일이 생기면 일단 도전해본다.", scores: { social: 3, emotional: 1 } },
      { text: "계획보다 즉흥적으로 움직인다.", scores: { emotional: 4 } }
    ]
  },
  {
    type: 'single',
    systemMessage: "[모닥불] \"음, 그렇구나.\n그럼 평소엔 주로 어디서 시간을 보내?\"",
    title: "STEP 2. NPC의 일상 (1/2)",
    question: "가장 많은 시간을 보내는 곳",
    options: [
      { text: "학교", scores: { social: 2, orderly: 2 } },
      { text: "회사", scores: { rational: 2, orderly: 2 } },
      { text: "집", scores: { emotional: 2, orderly: 1 } },
      { text: "기타", scores: { social: 1, emotional: 1 } }
    ]
  },
  {
    type: 'single',
    systemMessage: "[모닥불] \"바쁜 일상이네.\n그럼 쉴 때는 주로 뭐 해?\"",
    title: "STEP 2. NPC의 일상 (2/2)",
    question: "쉬는 날에는 주로 어떻게 시간을 보내나요?",
    options: [
      { text: "친구를 만난다.", scores: { social: 4 } },
      { text: "집에서 쉰다(넷플릭스 등).", scores: { emotional: 3, orderly: 1 } },
      { text: "새로운 곳을 간다.", scores: { emotional: 2, social: 2 } },
      { text: "취미를 즐긴다.", scores: { rational: 2, orderly: 2 } }
    ]
  },
  {
    type: 'single',
    systemMessage: "[모닥불] \"이제 너라는 NPC의 '메인 퀘스트'를 알아볼 차례야.\"",
    title: "STEP 3. 메인 키워드",
    question: "현재 당신 NPC에게 해당하는\n메인 키워드는 무엇인가요?",
    options: [
      { text: "진로/취업", scores: { rational: 3, orderly: 1 }, item: "🗒️" },
      { text: "인간관계", scores: { social: 3, emotional: 1 }, item: "💌" },
      { text: "연애", scores: { emotional: 3, social: 1 }, item: "❤️" },
      { text: "경제", scores: { rational: 1, orderly: 3 }, item: "💰" },
      { text: "기타", scores: { emotional: 1, rational: 1 }, item: "⚙️" }
    ]
  },
  {
    type: 'multiple',
    systemMessage: "[모닥불] \"아하, 그렇구나.\n그럼 이제 네가 숨기고 있는 히든 설정을 엿볼까? (여러 개 골라도 돼)\"",
    title: "STEP 4. 💬 NPC 회복 시 공개되는 설정",
    question: "플레이어의 틈을 고쳐주면 공개되는 당신 NPC의 히든 설정입니다.\n가장 어울리는 설정을 선택해주세요. (중복 선택 가능)",
    options: [
      { text: "🌿 마음을 다스리는 나만의 방법이 있다.", scores: { orderly: 3, rational: 1 } },
      { text: "🎨 남들과 다른 취향이나 스타일이 있다.", scores: { emotional: 3, social: 1 } },
      { text: "🧭 소중하게 지키는 가치가 있다.", scores: { rational: 2, orderly: 2 } },
      { text: "🔒 아직 누구에게도 말하지 못한 비밀이 있다.", scores: { emotional: 4 } }
    ]
  },
  {
    type: 'single',
    systemMessage: "[모닥불] \"마지막이야.\n아무도 모르는 네 마음속 '틈'을 들여다볼게.\"",
    title: "STEP 5. 마음속 ‘틈’",
    question: "모든 NPC에게는 플레이어가 쉽게 볼 수 없는 **‘틈’**이 존재합니다.\n가장 공감되는 문장을 선택해주세요.",
    options: [
      { text: "항상 괜찮은 척하지만 혼자 생각이 많다.", scores: { emotional: 2, rational: 2 } },
      { text: "쉬고 싶지만 계속 달려야 할 것 같다.", scores: { orderly: 3, rational: 1 } },
      { text: "남들의 기대에 맞추려고 노력하는 편이다.", scores: { social: 3, emotional: 1 } },
      { text: "진짜 내 모습을 아직 잘 모르겠다.", scores: { orderly: 2, social: 2 } },
      { text: "사람들과 함께 있어도 가끔 외롭다.", scores: { social: 2, emotional: 2 } }
    ]
  }
];

// --- Archetype Mapping ---
const archetypes = {
  emotional: {
    name: "생각에 잠긴 감성 시인",
    badge: "✍️",
    tagline: "#감성주의 #예술가 #따뜻한_치유",
    description: "마법사의 장난으로 감정이 늘 겉돌지만, 깊은 내면에는 따뜻한 온기가 가득한 NPC입니다. 슬픈 눈으로 웃으며 마을 한편에서 조용히 풍경을 그리거나 음악을 연주하고 있을 거예요. 이 NPC와 친해지면 숨겨진 히든 에피소드를 감상할 수 있습니다.",
    item: "노을빛 엽서",
    interaction: "조용한 산책 동행",
    compatPerfect: "어딜가나 눈에 띄는 활동가",
    compatWorst: "묵묵하게 곁을 지키는 기사"
  },
  rational: {
    name: "냉철한 분석가 학자",
    badge: "🧪",
    tagline: "#전략가 #이성적 #스킬마스터 #효율중심",
    description: "마을의 얽히고설킨 마법의 코드를 해독하기 위해 밤낮으로 분석하는 전략가형 NPC입니다. 늘 이성적이고 차분하지만, 마을 축제나 모험의 승리 공식을 설계해 주는 든든한 동반자입니다. 성장을 돕는 핵심 가이드를 제공합니다.",
    item: "비밀의 나침반",
    interaction: "스킬트리 분석 상담",
    compatPerfect: "묵묵하게 곁을 지키는 기사",
    compatWorst: "어딜가나 눈에 띄는 활동가"
  },
  social: {
    name: "어딜가나 눈에 띄는 활동가",
    badge: "🎉",
    tagline: "#다정다감 #파티러버 #소중한서약 #인맥도감",
    description: "우울한 미스터리 마을을 밝히기 위해 매일 아기자기한 홈파티를 기획하는 활기찬 NPC입니다! 수많은 모임 일정과 소중한 인연을 맺는 것이 가장 큰 낙입니다. 이 NPC의 집에 초대받으면 온갖 귀여운 수집품들을 구경할 수 있습니다.",
    item: "은하수 전구",
    interaction: "러블리 홈파티 초대",
    compatPerfect: "생각에 잠긴 감성 시인",
    compatWorst: "냉철한 분석가 학자"
  },
  orderly: {
    name: "묵묵하게 곁을 지키는 기사",
    badge: "🛡️",
    tagline: "#완벽주의 #성실한비서 #규칙적인일과 #도감수집",
    description: "마을의 질서와 가이드라인을 철저히 지키는 듬직한 NPC입니다. 묵묵히 정해진 일과와 아르바이트를 해내며, 마을의 역사와 규칙을 기록합니다. 처음에는 다가가기 어렵지만, 시간이 지날수록 누구보다 단단한 의지가 되어줍니다.",
    item: "가죽 양장본 일기장",
    interaction: "마을 순찰 동행",
    compatPerfect: "냉철한 분석가 학자",
    compatWorst: "생각에 잠긴 감성 시인"
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
  
  // Darken background immediately
  const introScreen = document.getElementById('screen-intro');
  introScreen.classList.add('darkened');
  
  // Hide start button immediately
  btnStart.style.display = 'none';
  
  // Hide Aria character if present
  const introChar = document.getElementById('intro-character');
  if (introChar) introChar.style.display = 'none';
  
  // Show intro system notice box immediately
  introSystemBox.style.display = 'block';
  introSystemBox.style.opacity = '1';
  introSystemBox.style.transform = 'translateY(0)';
  
  // Start typing the bonfire text
  typeText(introSystemText, introText, () => {
    introTypingDone = true;
  });
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
        const hasForm = document.getElementById('screen-form');
        if (hasForm) {
          screenForm.classList.add('active');
        } else {
          // Standard Version: Go straight to the start door screen
          screenIntro.classList.add('active');
        }
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
    // playIntroSequence();
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
let selectedOptions = []; // Array to store multiple selections

function loadQuestion(index) {
  currentQuestionIndex = index;
  selectedOptions = [];
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
    }, 500);
  }

  quizCard.style.display = 'none';
  dialogNextIndicator.style.display = 'none';
  currentStepState = 'typing';
  
  typeText(quizSystemText, qData.systemMessage, () => {
    currentStepState = 'waiting_click';
    dialogNextIndicator.style.display = 'block';
  });
}

quizSystemBox.addEventListener('click', () => {
  const qData = quizData[currentQuestionIndex];
  
  if (currentStepState === 'typing') {
    skipTyping(quizSystemText, qData.systemMessage, () => {
      currentStepState = 'waiting_click';
      dialogNextIndicator.style.display = 'block';
    });
  } else if (currentStepState === 'waiting_click') {
    sound.playClick();
    currentStepState = 'question';
    dialogNextIndicator.style.display = 'none';
    
    // Convert bold to span if any
    let formattedQ = qData.question.replace(/\*\*(.*?)\*\*/g, '<span style="color:#ff6b6b;font-weight:bold;">$1</span>');
    
    questionTitle.innerHTML = `<span style="color:#aaa; font-size:14px;">${qData.title}</span><br><br>${formattedQ}`;
    optionsList.innerHTML = '';
    
    qData.options.forEach((opt, idx) => {
      const optionEl = document.createElement('div');
      optionEl.className = 'option-item';
      
      if (qData.type === 'multiple') {
        optionEl.innerHTML = `
          <div class="option-checkbox"></div>
          <div class="option-text">${opt.text}</div>
        `;
      } else {
        optionEl.innerHTML = `
          <div class="option-radio"><div class="option-radio-dot"></div></div>
          <div class="option-text">${opt.text}</div>
        `;
      }
      
      optionEl.addEventListener('click', () => selectOption(idx, qData.type));
      optionsList.appendChild(optionEl);
    });
    
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

function selectOption(index, type) {
  sound.playClick();
  const items = optionsList.querySelectorAll('.option-item');
  
  if (type === 'multiple') {
    const arrIdx = selectedOptions.indexOf(index);
    if (arrIdx > -1) {
      selectedOptions.splice(arrIdx, 1);
      items[index].classList.remove('selected');
    } else {
      selectedOptions.push(index);
      items[index].classList.add('selected');
    }
    
    if (selectedOptions.length > 0) {
      btnNext.disabled = false;
      btnNext.className = 'btn btn-primary';
    } else {
      btnNext.disabled = true;
      btnNext.className = 'btn btn-disabled';
    }
  } else {
    selectedOptions = [index];
    items.forEach((item, idx) => {
      if (idx === index) item.classList.add('selected');
      else item.classList.remove('selected');
    });
    
    btnNext.disabled = false;
    btnNext.className = 'btn btn-primary';
  }
}

btnNext.addEventListener('click', () => {
  if (selectedOptions.length === 0) return;
  
  sound.playConfirm();
  const qData = quizData[currentQuestionIndex];
  
  // Add scores
  selectedOptions.forEach(optIdx => {
    const selectedOption = qData.options[optIdx];
    if (selectedOption.item) {
       equippedItems.push(selectedOption.item);
       renderEquippedItems();
    }
    for (const [key, value] of Object.entries(selectedOption.scores)) {
      userScores[key] += value;
    }
  });
  
  if (currentQuestionIndex + 1 < quizData.length) {
    loadQuestion(currentQuestionIndex + 1);
  } else {
    progressBar.style.width = '100%';
    if (gameCharacter) {
      gameCharacter.classList.add('walking');
      gameCharacter.style.left = '100%';
      setTimeout(() => {
        gameCharacter.classList.remove('walking');
        gameCharacter.style.display = 'none';
      }, 500);
    }
    
    // Add Celebration overlay temporarily
    quizSystemText.textContent = "[모닥불] \"수고했어! NPC 생성 완료!\"";
    quizSystemBox.style.display = 'block';
    
    setTimeout(() => {
        showResults();
    }, 1500);
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
    // Route dynamically: beta_testers if form exists, standard_results if it is the standard version
    const tableName = document.getElementById('screen-form') ? 'beta_tester' : 'NPC_tester';
    const response = await fetch(`https://btnrstfbvynsmzzxwcfy.supabase.co/rest/v1/${tableName}`, {
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

btnStart.addEventListener('click', () => {
  sound.playConfirm();
  playIntroSequence();
});
