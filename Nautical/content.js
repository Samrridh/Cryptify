(function () {
  if (window.typingTestActive) return;
  window.typingTestActive = true;

  let para = document.querySelector("article p, p");
  if (!para) {
    alert("No paragraph found!");
    return;
  }

  let text = para.innerText.trim().split(/\s+/).slice(0, 40).join(" "); // ~40 words

  // Replace paragraph with spans
  para.innerHTML = "";
  text.split("").forEach(ch => {
    let span = document.createElement("span");
    span.textContent = ch;
    para.appendChild(span);
  });

  let spans = para.querySelectorAll("span");
  let idx = 0, startTime = null, finished = false;

  // Hidden input to capture typing
  let input = document.createElement("textarea");
  input.style.position = "fixed";
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);
  input.focus();

  // Timer popup
  let timerBox = document.createElement("div");
  timerBox.style.position = "fixed";
  timerBox.style.top = "10px";
  timerBox.style.right = "10px";
  timerBox.style.padding = "6px 10px";
  timerBox.style.background = "black";
  timerBox.style.color = "white";
  timerBox.style.fontFamily = "sans-serif";
  timerBox.style.borderRadius = "6px";
  timerBox.style.zIndex = "999999";
  document.body.appendChild(timerBox);

  let timeLeft = 60; // seconds
  timerBox.textContent = `⏱ ${timeLeft}s`;

  let countdown = setInterval(() => {
    timeLeft--;
    timerBox.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      finishTest(true);
    }
  }, 1000);

  // Current word box
  let wordBox = document.createElement("div");
  wordBox.style.position = "fixed";
  wordBox.style.top = "50px";
  wordBox.style.right = "10px";
  wordBox.style.padding = "6px 10px";
  wordBox.style.background = "#333";
  wordBox.style.color = "yellow";
  wordBox.style.fontFamily = "sans-serif";
  wordBox.style.borderRadius = "6px";
  wordBox.style.zIndex = "999999";
  document.body.appendChild(wordBox);

  let words = text.split(" ");
  let wordIndex = 0;
  wordBox.textContent = `👉 ${words[wordIndex]}`;

  function finishTest(timeout = false) {
    if (finished) return;
    finished = true;
    clearInterval(countdown);
    input.remove();
    timerBox.remove();
    wordBox.remove();

    let elapsed = (Date.now() - startTime) / 1000;
    let wpm = Math.round((words.length / elapsed) * 60);

    let result = document.createElement("div");
    result.style.fontWeight = "bold";
    result.style.marginTop = "10px";
    result.textContent = timeout ? `⏰ Time up! WPM: ${wpm}` : `✅ Done! WPM: ${wpm}`;
    para.after(result);
  }

  input.addEventListener("input", () => {
    if (finished) return;
    if (!startTime) startTime = Date.now();

    let ch = input.value.slice(-1); // last typed char
    let expected = spans[idx]?.textContent;

    if (ch === expected) {
      spans[idx].style.background = "lightgreen";
    } else {
      spans[idx].style.background = "salmon";
    }
    idx++;

    // Update current word when space is typed or new word starts
    if (ch === " " || idx >= spans.length || spans[idx - 1].textContent === " ") {
      wordIndex++;
      if (wordIndex < words.length) {
        wordBox.textContent = `👉 ${words[wordIndex]}`;
      }
    }

    if (idx === spans.length) {
      finishTest();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      para.innerText = text; // restore original text
      input.remove();
      timerBox.remove();
      wordBox.remove();
      clearInterval(countdown);
      window.typingTestActive = false;
    }
  });
})();
