const definitions = document.querySelectorAll('.def');

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


const sampleSentenceShape = {
  mbay: '', // e.g. 'Ngōn-kó̰o̰-á àl̄ gìdɨ̀-á tɨ́.',
  english: '', // e.g.  His brother climbed on his back.
  wordSoundPath: '', // e.g. 'Sound/Mba386W.mp3'
};
const expressionShape = {
  expressionMbay: '', // e.g. 'Ngōn-kó̰o̰-á àl̄ gìdɨ̀-á tɨ́.',
  expressionEnglish: '', // e.g.  His brother climbed on his back.
  sampleSentence: {...sampleSentenceShape}
};

const getSampleSentencesAndExpressions = (type, skipNumber) => {
  let currentSibling = type.nextElementSibling;
  let sampleSentencesMbay = [];
  while (currentSibling !== null && currentSibling.className !== 'type') {
    sampleSentencesMbay.push(currentSibling);
    currentSibling = currentSibling.nextElementSibling;
  }

  // skipNumber: Edge case around "will (future marker, 1/2 pers. of à)."
  // because "à" has the class "sara-bagirmi-lang" its thinking its a sample sentence.
  sampleSentencesMbay = skipNumber > 0
    ? sampleSentencesMbay.slice(skipNumber)
    : sampleSentencesMbay;

  const sampleAndExpressions = sampleSentencesMbay.map((mbay) => {
    if (!mbay) {
      return null
    }
    const sampleCopy = { ...sampleSentenceShape };
    sampleCopy.mbay = mbay.innerText.trim();
    sampleCopy.english = mbay.nextSibling ? mbay.nextSibling.data.trim() : '';
    const wordSound = mbay.querySelector('.play-sound');
    if (wordSound) {
      sampleCopy.wordSoundPath = getSoundPath(wordSound.onclick);
    }
    return sampleCopy;
  });
  let sampleSentences = []
  let expressions = [];
  for (let i = 0; i < sampleAndExpressions.length; i++) {
    const currentSampleOrExpression = sampleAndExpressions[i];
    // if the current sentence is 'Expr: '
    if (currentSampleOrExpression && currentSampleOrExpression.mbay.includes('Expr:')) {
      // Get the next two and push them to expressions
      // and iterate twice
      const expressionCopy = { ...expressionShape };
      const expression = sampleAndExpressions[++i];
      const expressionSampleSentence = sampleAndExpressions[++i];
      expressionCopy.expressionMbay = expression.mbay;
      expressionCopy.expressionEnglish = expression.english;
      expressionCopy.sampleSentence = expressionSampleSentence;
      // Edge case, no sample sentence with it.
      if (expressionSampleSentence && expressionSampleSentence.mbay.includes('Expr')) {
        expressionCopy.sampleSentence = null;
        // go back one... for iteration reasons :)
        i--
      } else {
        expressionCopy.sampleSentence = expressionSampleSentence;
      }
      expressions.push(expressionCopy);
    } else {
      sampleSentences.push(currentSampleOrExpression);
    }
  }
  return [sampleSentences, expressions];
};
typesShape = {
  type: '', // e.g. VAU, Aux, AF etc
  translation: '', // e.g. climb, climb up; go up.
  sampleSentences: [], // Array of sampleSentenceShape
};

const getHasOpenParenthesisWithoutClosing = (wordString) => {
  const numberOfOpeningParenthesis = wordString.split('(').length - 1;
  const numberOfClosingParanthesis = wordString.split(')').length - 1;
  return numberOfOpeningParenthesis > numberOfClosingParanthesis;
};

const getMbayWordAndWordAfter = (followingSibling) => {
  const mbayWord = followingSibling?.nextSibling
  const wordAfter = followingSibling?.nextSibling?.nextSibling
  // .innerHTML.trim() : ''; for mbayWord
  // .data.trim() for wordAfter
  return [mbayWord, wordAfter];
}

const getDefinitions = (definition) => {
  const definitionsElements = definition.querySelectorAll('.type');

  return [...definitionsElements].map((type) => {
    if (!type) {
      return null
    } 
    const typeShapeCopy = { ...typesShape };
    typeShapeCopy.type = type.innerText.trim();
    typeShapeCopy.translation = type.nextSibling.data.trim();
    // Edge case for "will (future marker, 1/2 pers. of à)."
    //  because "à" has the class "sara-bagirmi-lang" its thinking its a sample sentence.
    // if there is an "(" but not a ")" that means there is a closing one,
    //  and a mbay word in it
    const hasOpenParenthesisWithoutClosing =
      getHasOpenParenthesisWithoutClosing(typeShapeCopy.translation);
    // figuring how many sentences to skip if above edge case takes place
    let skipNumber = 0;
    if (hasOpenParenthesisWithoutClosing) {

      const opening = typeShapeCopy.translation;

      let translationArray = [opening]
      // *** Another edge case *** if multiple sara-bagirmi-lang exist.
      // oh good (man, woman, etc.) (suffixed to stems containing
      // <span class="sara-bagirmi-lang">a</span> or
      // <span class="sara-bagirmi-lang">a</span>).

      let followingSibling = type.nextSibling
      let [mbayWord, wordAfter] = getMbayWordAndWordAfter(followingSibling); 
      // Probably not necessary, but was running into infinite loops, and i'm over it.
      let maxLoops = 0;
      if (mbayWord) {
        skipNumber++
        translationArray = [...translationArray, mbayWord.innerHTML?.trim(), wordAfter?.data?.trim()]
        while(!wordAfter?.data?.includes(')') && maxLoops < 10) {
          followingSibling = wordAfter;
          [mbayWord, wordAfter] = getMbayWordAndWordAfter(followingSibling);  
          if (mbayWord) {
            translationArray = [...translationArray, mbayWord.innerHTML?.trim(), wordAfter?.data?.trim()]
          }
          skipNumber++
          maxLoops++;
        }  
      }
      // This will create weirdness sometimes, but it is the best we can do at the moment
      // AKA, extra spacing where there shoudln't be.
      typeShapeCopy.translation = translationArray.join(' ');
    }
    const [sampleSentences, expressions] = getSampleSentencesAndExpressions(
      type,
      skipNumber
    );
    typeShapeCopy.sampleSentences = sampleSentences;
    typeShapeCopy.expressions = expressions;
    return typeShapeCopy;
  });
};

const wordShape = {
  word: '', // e.g. àl̄
  wordSoundPath: '', // e.g. Sound/Mba386W.mp3
  synonym: '', // e.g. (Syn: ànḛ̄)
  originLanguage: '', // e.g. French
  alternative: '', // e.g. [dà̰nà̰ŋ]
  definitions: [], // Array of typesShape
};

// (Syn: ànḛ̄)
// [dà̰nà̰ŋ]
// French

const getSynonymOriginLanguageAlternative = (definition) => {
  // sola => synonymOriginLanguageOrAlternative
  let soloa = definition.querySelector('.word').lastChild
  soloa = soloa?.data?.trim()
  if (!soloa) {
    return ''
  }
  soloa = soloa.trim()

  let synonym = '' // (Syn: ànḛ̄)
  let alternative = '' // [dà̰nà̰ŋ]
  let originLanguage = ''// French

  // Synonym
  if (soloa.includes('(Syn:')) {
    const startIndex = soloa.indexOf('(Syn:');
    const endIndex = soloa.indexOf(')') + 1
    // remove the (Syn: and the )
    synonym = soloa.substring(startIndex + 5, endIndex - 1).trim()
    soloa = soloa.substring(0, startIndex) + soloa.substring(endIndex);
  }
  // Alternative
  if (soloa.includes('[')) {
    const startIndex = soloa.indexOf('[');
    const endIndex = soloa.indexOf(']') + 1
    // remove the [ and ]
    alternative = soloa.substring(startIndex + 1, endIndex - 1).trim()
    soloa = soloa.substring(0, startIndex) + soloa.substring(endIndex);
  }
  originLanguage = soloa.trim()
  return [synonym, originLanguage, alternative]
}

const getWord = (definition) => {
  const wordShapeCopy = { ...wordShape };
  const word = definition.querySelector('.word .w.sara-bagirmi-lang');
  wordShapeCopy.word = word.innerText.trim();
  const wordSound = word.querySelector('.play-sound');
  if (wordSound) {
    wordShapeCopy.wordSoundPath = getSoundPath(wordSound.onclick);
  }
  wordShapeCopy.definitions = getDefinitions(definition);
  const [synonym, originLanguage, alternative] = getSynonymOriginLanguageAlternative(definition)
  // Add synonym, originLanguage, alternative if they exist
  wordShapeCopy.synonym = synonym
  wordShapeCopy.originLanguage = originLanguage
  wordShapeCopy.alternative = alternative
  return wordShapeCopy;
};

const words = [...definitions].map(definition => getWord(definition));

console.log(words);
// Just copy this whole file and paste into Chrome console
copy(`const data = ${JSON.stringify(words, null, 2)}
exports.data = data`);