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
    systemMessage: "마법사의 장난으로 주민들의 마음과 행동이 서로 엇갈려버린 미스터리 마을입니다. 이곳에 배치될 새로운 NPC 캐릭터를 생성합니다.",
    question: "Q1. 당신의 NPC는 주인공이 말을 걸었을 때, 어떤 '독특한 개성'으로 반응하게 만들까요?",
    options: [
      { text: "슬픈 눈을 하고 싱긋 웃는 감성 주민", scores: { emotional: 3, social: 1 } },
      { text: "상황을 이성적으로 분석하려는 전략가 주민", scores: { rational: 3, orderly: 1 } },
      { text: "아기자기하게 방을 꾸미고 파티를 여는 다정한 주민", scores: { social: 3, emotional: 1 } },
      { text: "가이드라인만 묵묵히 알려주는 완벽주의 주민", scores: { orderly: 3, rational: 1 } }
    ]
  },
  {
    systemMessage: "NPC의 머리 위에 캘린더 모양의 '스케줄 슬롯' 신호가 켜졌습니다.",
    question: "Q2. 주인공이 일상의 균형을 찾아주기 전까지, 당신의 NPC가 매일 반복하게 될 '숨겨진 일과'는 무엇인가요?",
    options: [
      { text: "다양한 모임 일정이 무한대로 늘어나 꽉 찬 상태", scores: { social: 3, emotional: 1 } },
      { text: "매일 정해진 시간 동안 아르바이트를 해야 하는 상태", scores: { orderly: 3, rational: 1 } },
      { text: "상시 바캉스(여행) 계획이 있어 스케줄이 매우 유동적인 상태", scores: { emotional: 3, social: 1 } },
      { text: "고정 일정이 없어 언제든 축제에 풀 접속 가능한 상태", scores: { rational: 3, social: 1 } }
    ]
  },
  {
    systemMessage: "가구 상점 내부의 숨겨진 코드를 확인하자, 캐릭터 정보창 이면에 등록된 '특별한 고유 속성'이 발견되었습니다.",
    question: "Q3. 당신의 NPC 캐릭터 데이터에 남겨둘 나만의 고유한 특징은 무엇인가요?",
    options: [
      { text: "개성을 듬뿍 담은 멋진 '타투'를 새겨둔 특징", scores: { emotional: 3, social: 1 } },
      { text: "성별 상관없이 동료와 '소중한 서약(결혼)'을 맺고 싶어 하는 특징", scores: { social: 3, emotional: 1 } },
      { text: "마을 정기 신앙 소모임 활동에 성실히 참석하는 특징", scores: { orderly: 3, rational: 1 } },
      { text: "에너지가 소진되어 따뜻한 위로와 내면 치유가 필요한 특징", scores: { rational: 3, emotional: 1 } }
    ]
  },
  {
    systemMessage: "모든 에피소드가 해결되면 마침내 플레이어의 '진짜 나'와 마주하는 엔딩으로 이어집니다.",
    question: "Q4. 당신의 NPC가 마음의 안정을 찾고 새로운 시작을 맞이하기 위해, 최종적으로 풀고 싶은 '가장 소중한 소원'은 무엇인가요?",
    options: [
      { text: "온전히 마음을 나눌 사람을 만나 예쁜 커플 스토리를 완성하는 것", scores: { social: 3, emotional: 1 } },
      { text: "직업 스킬트리를 마스터하고 원하는 직무 취업에 성공하는 것", scores: { rational: 3, orderly: 1 } },
      { text: "주민들과의 오해를 해결하고 평화로운 관계 도감을 채우는 것", scores: { orderly: 3, social: 1 } },
      { text: "피로도 게이지를 비우고 아무것도 안 하며 푹 쉬는 것", scores: { emotional: 3, rational: 1 } }
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

const btnShare = document.getElementById('btn-share');
const btnRestart = document.getElementById('btn-restart');

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

// Trigger typing on initial page load (with a slight delay)
setTimeout(() => {
  typeText(introSystemText, introText, () => {
    introTypingDone = true;
    btnStart.style.display = 'block';
  });
}, 800);

introSystemBox.addEventListener('click', () => {
  if (isTyping) {
    skipTyping(introSystemText, introText, () => {
      introTypingDone = true;
      btnStart.style.display = 'block';
    });
  } else if (introTypingDone) {
    startQuiz();
  }
});

btnStart.addEventListener('click', (e) => {
  e.stopPropagation();
  startQuiz();
});

function startQuiz() {
  sound.playClick();
  screenIntro.classList.remove('active');
  
  setTimeout(() => {
    screenQuiz.classList.add('active');
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
  const progressPct = ((index) / quizData.length) * 100;
  progressBar.style.width = `${progressPct}%`;
  progressText.textContent = `${index + 1} / ${quizData.length}`;
  document.documentElement.style.setProperty('--progress-ratio', index / (quizData.length - 1));
  
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

// Restart button
btnRestart.addEventListener('click', () => {
  sound.playClick();
  
  // Reset state
  userScores = { emotional: 0, rational: 0, social: 0, orderly: 0 };
  currentQuestionIndex = 0;
  selectedOptionIndex = null;
  
  screenResult.classList.remove('active');
  document.documentElement.style.setProperty('--progress-ratio', 0);
  
  setTimeout(() => {
    screenIntro.classList.add('active');
    // Restart typing intro text
    introTypingDone = false;
    btnStart.style.display = 'none';
    typeText(introSystemText, introText, () => {
      introTypingDone = true;
      btnStart.style.display = 'block';
    });
  }, 500);
});

// Share / Copy Results Code Button
btnShare.addEventListener('click', () => {
  sound.playClick();
  
  const summary = `🔮 [미스터리 마을 NPC 생성 결과] 🔮\n\n내가 생성한 NPC: ${resultNpcName.textContent}\n${resultTagline.textContent}\n\n성향 스탯:\n- 감성: ${valEmotional.textContent}\n- 이성: ${valRational.textContent}\n- 사교: ${valSocial.textContent}\n- 규율: ${valOrderly.textContent}\n\n지금 미스터리 마을 주민을 생성해보세요!`;
  
  navigator.clipboard.writeText(summary).then(() => {
    const originalText = btnShare.textContent;
    btnShare.textContent = '복사 완료!';
    btnShare.style.background = 'rgba(34, 197, 94, 0.2)';
    btnShare.style.borderColor = '#22c55e';
    
    setTimeout(() => {
      btnShare.textContent = originalText;
      btnShare.style.background = 'rgba(255, 255, 255, 0.05)';
      btnShare.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }, 2000);
  }).catch(err => {
    console.error('클립보드 복사 실패:', err);
  });
});
