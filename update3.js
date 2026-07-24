const fs = require('fs');

let script = fs.readFileSync('script.js', 'utf8');

// Add items to quizData
script = script.replace('scores: { emotional: 3, social: 1 } }', 'scores: { emotional: 3, social: 1 }, item: "🎨" }');
script = script.replace('scores: { rational: 3, orderly: 1 } }', 'scores: { rational: 3, orderly: 1 }, item: "⚙️" }');
script = script.replace('scores: { social: 3, emotional: 1 } }', 'scores: { social: 3, emotional: 1 }, item: "🏡" }');
script = script.replace('scores: { orderly: 3, rational: 1 } }', 'scores: { orderly: 3, rational: 1 }, item: "🏆" }');

script = script.replace('scores: { social: 3, emotional: 1 } },\n      { text: "💼', 'scores: { social: 3, emotional: 1 }, item: "📚" },\n      { text: "💼');
script = script.replace('scores: { orderly: 3, rational: 1 } },\n      { text: "✈️', 'scores: { orderly: 3, rational: 1 }, item: "💼" },\n      { text: "✈️');
script = script.replace('scores: { emotional: 3, social: 1 } },\n      { text: "☕', 'scores: { emotional: 3, social: 1 }, item: "✈️" },\n      { text: "☕');
script = script.replace('scores: { rational: 3, social: 1 } }', 'scores: { rational: 3, social: 1 }, item: "☕" }');

script = script.replace('scores: { emotional: 3, social: 1 } },\n      { text: "🤝', 'scores: { emotional: 3, social: 1 }, item: "✨" },\n      { text: "🤝');
script = script.replace('scores: { social: 3, emotional: 1 } },\n      { text: "🌱', 'scores: { social: 3, emotional: 1 }, item: "🤝" },\n      { text: "🌱');
script = script.replace('scores: { orderly: 3, rational: 1 } },\n      { text: "🔮', 'scores: { orderly: 3, rational: 1 }, item: "🌱" },\n      { text: "🔮');
script = script.replace('scores: { rational: 3, emotional: 1 } }', 'scores: { rational: 3, emotional: 1 }, item: "🔮" }');

script = script.replace('scores: { social: 3, emotional: 1 } },\n      { text: "🎯', 'scores: { social: 3, emotional: 1 }, item: "💌" },\n      { text: "🎯');
script = script.replace('scores: { rational: 3, orderly: 1 } },\n      { text: "🕊️', 'scores: { rational: 3, orderly: 1 }, item: "🎯" },\n      { text: "🕊️');
script = script.replace('scores: { orderly: 3, social: 1 } },\n      { text: "🛌', 'scores: { orderly: 3, social: 1 }, item: "🕊️" },\n      { text: "🛌');
script = script.replace('scores: { emotional: 3, rational: 1 } }', 'scores: { emotional: 3, rational: 1 }, item: "🛌" }');


// Update story logic (add typing for final line)
const oldStorySetTimeout = `      storyTimer = setTimeout(() => {
        storySystemText.innerHTML += finalStoryLine;
        isStoryTypingDone = true;
        storyNextIndicator.style.display = 'block';
      }, 1200); // 1.2s pause`;
const newStorySetTimeout = `      storyTimer = setTimeout(() => {
        storySystemText.innerHTML += "<br><br><span id='final-story-line'></span>";
        const finalEl = document.getElementById('final-story-line');
        typeText(finalEl, "과연 주인공은 집으로 돌아갈 수 있을까요?", () => {
          isStoryTypingDone = true;
          storyNextIndicator.style.display = 'block';
        });
      }, 1200); // 1.2s pause`;
script = script.replace(oldStorySetTimeout, newStorySetTimeout);

const oldStorySkip = `        if (currentStoryIndex === 2) {
          storySystemText.innerHTML = storyPages[currentStoryIndex] + finalStoryLine;
        }`;
const newStorySkip = `        if (currentStoryIndex === 2) {
          storySystemText.innerHTML = storyPages[currentStoryIndex] + "<br><br>과연 주인공은 집으로 돌아갈 수 있을까요?";
        }`;
script = script.replace(oldStorySkip, newStorySkip);

// Add equippedItems state
script = script.replace('let currentQuestionIndex = 0;', 'let currentQuestionIndex = 0;\nlet equippedItems = [];');

// Add DOM reference for submit button
script = script.replace("const btnShare = document.getElementById('btn-share');", '');
script = script.replace("const btnRestart = document.getElementById('btn-restart');", "const btnSubmit = document.getElementById('btn-submit');");

// Function to render items
const renderFn = `function renderEquippedItems() {
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
`;
script = script.replace('function selectOption(index) {', renderFn + '\nfunction selectOption(index) {');

// In selectOption, add the equip logic
const oldSelectBody = `  sound.playClick();
  selectedOptionIndex = index;
  
  // Update styling`;
const newSelectBody = `  sound.playClick();
  selectedOptionIndex = index;
  
  // Equip Item
  const qData = quizData[currentQuestionIndex];
  equippedItems[currentQuestionIndex] = qData.options[index].item;
  renderEquippedItems();
  
  // Update styling`;
script = script.replace(oldSelectBody, newSelectBody);

// Moving character to result screen
const resultShow = `  setTimeout(() => {
    screenResult.classList.add('active');
  }, 500);`;
const newResultShow = `  // Show character in result screen
  const preview = document.getElementById('result-character-preview');
  if(preview && gameCharacter) {
    preview.appendChild(gameCharacter);
  }
  
  setTimeout(() => {
    screenResult.classList.add('active');
  }, 500);`;
script = script.replace(resultShow, newResultShow);

// Remove share/restart event listeners and add submit listener
script = script.replace(/btnRestart\.addEventListener\([\s\S]*?\}\);/, '');
script = script.replace(/btnShare\.addEventListener\([\s\S]*?\}\);/, `btnSubmit.addEventListener('click', () => {
  sound.playClick();
  alert("베타테스트 결과가 성공적으로 제출되었습니다!\\n소중한 의견 감사드립니다.");
});`);

fs.writeFileSync('script.js', script, 'utf8');

console.log('Update3 Complete!');
