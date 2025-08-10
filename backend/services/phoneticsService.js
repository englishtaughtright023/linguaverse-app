// File: backend/services/phoneticsService.js

export async function getPhoneticBreakdown(sentence) {
  console.log(`[Phonetics Service]: Generating GROUPED breakdown for: "${sentence}"`);

  // The data is now structured by words, each containing its syllables.
  // This allows for natural grouping and pauses on the frontend.
  const sampleBreakdown = [
    { word: "The", syllables: [{ text: "The", duration: 500 }] },
    { word: "quick", syllables: [{ text: "quick", duration: 500 }] },
    { word: "brown", syllables: [{ text: "brown", duration: 500 }] },
    { word: "fox", syllables: [{ text: "fox", duration: 600 }] },
    { word: "(pause)", syllables: [{ text: "", duration: 400 }] },
    { word: "jumps", syllables: [{ text: "jumps", duration: 600 }] },
    { word: "over", syllables: [{ text: "o", duration: 300 }, { text: "ver", duration: 400 }] },
    { word: "the", syllables: [{ text: "the", duration: 500 }] },
    { word: "lazy", syllables: [{ text: "la", duration: 300 }, { text: "zy", duration: 400 }] },
    { word: "dog", syllables: [{ text: "dog", duration: 800 }] },
  ];
  
  return new Promise(resolve => setTimeout(() => resolve(sampleBreakdown), 200));
}