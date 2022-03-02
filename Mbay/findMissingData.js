const fs = require('fs')
const path = require('path');
const { data } = require('./firstResults')

const getSampleSentenceHasMissingInformation = (sampleSentence) => {
    if (!sampleSentence) {
        return null
    }
    const hasMbayButNotEnglish = Boolean(sampleSentence.mbay && !sampleSentence.english)
    const hasEnglishButNotMbay = Boolean(sampleSentence.english && !sampleSentence.mbay)
    return hasMbayButNotEnglish || hasEnglishButNotMbay
}
const getExpressionHasMissingInformation = (expression) => {
    if (!expression) {
        return null
    }
    const hasMbayButNotEnglish = Boolean(expression.expressionMbay && !expression.expressionEnglish)
    const hasEnglishButNotMbay = Boolean(expression.expressionEnglish && !expression.expressionMbay)
    const sampleSentencesHasMissingInformation = getSampleSentenceHasMissingInformation(expression.sampleSentence)
    return hasMbayButNotEnglish || hasEnglishButNotMbay || sampleSentencesHasMissingInformation
}

const findMissingData = (definition) => {
    const expressions = definition.expressions
    const missingExpressions = expressions.filter(getExpressionHasMissingInformation)
    const sampleSentences = definition.sampleSentences
    const missingSampleSentences = sampleSentences.filter(getSampleSentenceHasMissingInformation)
    if (missingExpressions.length > 0 || missingSampleSentences.length > 0) {
        const missingData = {
            definitionName: definition.translation,
        }
        if (missingExpressions.length > 0) {
            missingData.missingExpressions = missingExpressions
        }
        if (missingSampleSentences.length > 0) {
            missingData.missingSampleSentences = missingSampleSentences
        }
    return missingData;
    }
    return null
}
const results = data.reduce((results, currentWord, index) => {
    const definitions = currentWord.definitions;
    const missingData = definitions.map(findMissingData).filter(Boolean)
    if (missingData.length > 0) {
        results.push({
            word: currentWord.word,
            index,
            missingData,
        })
    }
    return results
}, [])

var resultsPath = path.join(__dirname, 'missingData.json');

fs.writeFile(resultsPath, results, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('file written successfully')
})

