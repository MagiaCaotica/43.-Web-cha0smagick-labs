/**
 * Quick test for Groq + smartReply integration
 * Run: node scripts/_test-groq.js
 */
const BRAIN = require('./bot-brain');
const { askGroq, needsGroq } = require('./groq-ai');
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

BRAIN.helpers.groqAsk = askGroq;

async function test() {
  console.log('=== TEST 1: keyword match (no API call) ===');
  let r1 = await BRAIN.helpers.smartReply('tell me about sigils', GROQ_API_KEY);
  console.log('Result:', r1 ? r1.substring(0, 120) + '...' : 'NULL');
  console.log('Expected: instant keyword match\n');

  console.log('=== TEST 2: complex question (Groq API) ===');
  let r2 = await BRAIN.helpers.smartReply('What would you recommend for a beginner interested in divination?', GROQ_API_KEY);
  console.log('Result:', r2 ? r2.substring(0, 300) + '...' : 'NULL');
  console.log('Expected: Groq AI response\n');

  console.log('=== TEST 3: needsGroq classifier ===');
  console.log('"What is the best app?" →', needsGroq('What is the best app?'));
  console.log('"hi" →', needsGroq('hi'));
  console.log('"how do sigils work" →', needsGroq('how do sigils work'));
  console.log('"apps" →', needsGroq('apps'));

  console.log('\n=== TEST 4: Direct Groq (Spanish) ===');
  let r4 = await askGroq('Qué herramienta recomiendas para aprender a hacer sigilos?', GROQ_API_KEY, { maxTokens: 300 });
  console.log('Result:', r4.substring(0, 300) + '...');

  console.log('\n✅ All tests completed');
}
test().catch(err => console.error('❌', err.message));
