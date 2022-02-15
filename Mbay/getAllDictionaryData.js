const definitions = document.querySelectorAll('.def');

// TODO add a loop

const getSoundPath = (func) => {
  // input:
  // `ƒ onclick(event) {
  //     playSound('Sound/Mba386W.mp3')
  // }`
  // output:
  // `Sound/Mba386W.mp3`
  const string = func.toString();
  const start = string.indexOf("('") + 2;
  const end = string.indexOf("')");
  return string.substring(start, end);
};

const definition = definitions[0];

const sampleSentenceShape = {
  mbay: '', // e.g. 'Ngōn-kó̰o̰-á àl̄ gìdɨ̀-á tɨ́.',
  english: '', // e.g.  His brother climbed on his back.
  wordSoundPath: '', // e.g. 'Sound/Mba386W.mp3'
};

const getSampleSentences = (type) => {
  let currentSibling = type.nextElementSibling;
  const sampleSentencesMbay = [];
  while (currentSibling !== null && currentSibling.className !== 'type') {
    sampleSentencesMbay.push(currentSibling);
    currentSibling = currentSibling.nextElementSibling;
  }

  return sampleSentencesMbay.map((mbay) => {
    const sampleCopy = { ...sampleSentenceShape };
    sampleCopy.mbay = mbay.innerText;
    sampleCopy.english = mbay.nextSibling.data.trim();
    const wordSound = mbay.querySelector('.play-sound');
    if (wordSound) {
      sampleCopy.wordSoundPath = getSoundPath(wordSound.onclick);
    }
    return sampleCopy;
  });
};
typesShape = {
  type: '', // e.g. VAU, Aux, AF etc
  translation: '', // e.g. climb, climb up; go up.
  sampleSentences: [], // Array of sampleSentenceShape
};

const getDefinitions = (definition) => {
  const definitionsElements = definition.querySelectorAll('.type');

  return [...definitionsElements].map((type) => {
    const typeShapeCopy = { ...typesShape };
    typeShapeCopy.type = type.innerText.trim();
    typeShapeCopy.translation = type.nextSibling.data.trim();
    typeShapeCopy.sampleSentences = getSampleSentences(type);
    return typeShapeCopy;
  });
};

const wordShape = {
  word: '', // e.g. àl̄
  wordSoundPath: '', // e.g. Sound/Mba386W.mp3
  definitions: [], // Array of typesShape
};

const getWord = (definition) => {
  const wordShapeCopy = { ...wordShape };
  const word = definition.querySelector('.word .w.sara-bagirmi-lang');
  wordShapeCopy.word = word.innerText;
  const wordSound = word.querySelector('.play-sound');
  if (wordSound) {
    wordShapeCopy.wordSoundPath = getSoundPath(wordSound.onclick);
  }
  wordShapeCopy.definitions = getDefinitions(definition);
  return wordShapeCopy;
};

const word = getWord(definition);

console.log(word);
