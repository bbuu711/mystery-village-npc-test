const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

const newStoryLogic = `
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
        storySystemText.innerHTML += finalStoryLine;
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
  if (betaName && betaContact && betaAgree) {
    if (betaName.value.trim() !== '' && betaContact.value.trim() !== '' && betaAgree.checked) {
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
  betaAgree.addEventListener('change', checkFormValidity);
  
  btnToIntro.addEventListener('click', () => {
    if (btnToIntro.disabled) return;
    sound.playClick();
    screenForm.classList.remove('active');
    screenIntro.classList.add('active');
    playIntroSequence();
  });
}
`;

// Replace the playIntroSequence setTimeout with the new logic
script = script.replace('setTimeout(playIntroSequence, 500);', newStoryLogic);

fs.writeFileSync('script.js', script, 'utf8');
console.log('Restored story logic.');
