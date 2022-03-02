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
    return {
            definition,
            missingExpressions,
            missingSampleSentences,
        };
    }
    return null
}
const results = data.reduce((results, currentWord, index) => {
    const definitions = currentWord.definitions;
    const missingData = definitions.map(findMissingData).filter(Boolean)
    if (missingData.length > 0) {
        results.push({
            word: currentWord.word,
            missingData,
        })
    }
    return results
}, [])
console.log(JSON.stringify(results, null, 2))

