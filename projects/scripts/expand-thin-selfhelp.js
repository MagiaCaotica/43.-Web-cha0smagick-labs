// expand-thin-selfhelp.js - expande 16 artículos thin de Self-help/Mindset con CTA a libros Hotmart
const fs = require('fs');
const BASE = 'D:/Paginas web/Cha0smagick Labs/43.-Web-cha0smagick-labs/blog/';

function bookCta(bookId, bookName, bookDesc) {
  return '<div class="blog-cta-box" style="background:#111;border:1px solid #c0a060;border-radius:8px;padding:1.6rem;margin:2rem 0;text-align:center;">'
    + '<h3 style="color:#c0a060;margin-bottom:0.8rem;">' + bookName + '</h3>'
    + '<p style="color:#a0a0a0;">' + bookDesc + '</p>'
    + '<p><strong style="color:#fff;">$3.99 USD &mdash; One-time payment &mdash; Instant download</strong></p>'
    + '<a href="https://pay.hotmart.com/' + bookId + '?checkoutMode=2" target="_blank" style="display:inline-flex;margin-top:1rem;background:#ff6b35;color:#fff!important;padding:0.8rem 1.8rem;border-radius:6px;font-weight:600;text-decoration:none;">Get the Guide Now</a>'
    + '<p style="margin-top:0.8rem;font-size:0.85rem;color:#888;">Questions? Drop a comment below &mdash; we read every one.</p></div>';
}

const CLUSTERS = {
  'direction-clarity-purpose-framework': ['Direction, Clarity, Purpose: A Practical Framework', [
    'Direction without clarity is just motion. Clarity without purpose burns out. This framework ties the three together into a repeatable loop: set a direction, audit what clarity you actually have, and let purpose filter the decisions that follow.',
    'Most people fail the loop at the audit step. They assume clarity means knowing the whole path. It does not. Clarity means knowing the next three steps. That is enough to move, and movement generates the information the next audit needs.',
    'Run the loop weekly. A 15-minute audit of direction, clarity, and purpose compounds into a decision engine that stops the drift before it starts.'
  ]],
  'animagus-techniques-psychological-transformation': ['Animagus Techniques: Psychological Transformation', [
    'The animagus archetype, the human who becomes an animal, is a map for psychological transformation. The animal form is not literal: it is the raw instinctual self stripped of social performance. This guide covers the inner work behind the myth.',
    'The practice starts with identifying your animal counterpart. Which animal matches your stress response, your social style, your instincts? The matching is the mirror. The transformation work is deliberately adopting that mode for specific tasks.',
    'Used intentionally, the animal self becomes a resource: the wolf for boundaries, the fox for strategy, the hawk for overview. You do not become the animal; you learn to call it when the situation demands it.'
  ]],
  'neuroplasticity-magic-brain-hacking': ['Neuroplasticity and Magic: Brain Hacking', [
    'Neuroplasticity is the brain ability to rewire itself through repetition. Magic is the oldest deliberate use of that ability. Every sigil, every affirmation, every ritual is a plasticity protocol with intention attached.',
    'The mechanism is simple: repeated neural firing with emotional charge creates durable pathways. A sigil fired in gnosis is a one-shot intense firing. A daily practice is a slow drip. Both work, on different timelines.',
    'Design your practice like a training program. Clear target behavior, consistent reps, measurable progress. The magic is not separate from the neuroscience; it is neuroscience with an interface you can feel.'
  ]],
  'identity-shift-behavior-change-framework': ['Identity Shift: The Behavior Change Framework', [
    'Behavior change fails when it targets actions instead of identity. You do not maintain a habit that contradicts who you believe you are. The framework is: define the identity first, then let the behaviors fall out of it.',
    'Shift the question from what should I do to who is the person who does this naturally. Write the identity as a statement, repeat it in the morning, and use it as the filter for the day decisions.',
    'Identity shift is not affirmation fluff. It is a self-model update, and the self-model is the control loop behind every automatic behavior. Update the model and the behaviors update themselves.'
  ]],
  'accumulation-marginal-gains-system': ['Accumulation: The Marginal Gains System', [
    'The marginal gains system is the 1% improvement method: dozens of tiny optimizations that compound into outsized results. It works because no single change is threatening enough to trigger resistance.',
    'Build the list of every small lever in your domain: sleep, hydration, environment, tools, timing. Improve each by 1%. The compounding is not linear; improvements feed each other and the system accelerates.',
    'Track the system, not the outcome. The outcome is the lagging indicator. When the leading indicators move, the outcome follows. This guide gives the tracking format that keeps the system honest.'
  ]],
  'pause-technique-stress-response-control': ['The Pause Technique: Stress Response Control', [
    'The pause is the space between stimulus and response where agency lives. Training the pause is training the nervous system to delay its automatic reaction by one breath, then two, then five.',
    'The technique is boring on purpose: when triggered, take one full exhale before speaking or acting. The exhale engages the parasympathetic brake. With reps, the delay becomes automatic and the reactions become choices.',
    'This is not suppression. The pause does not kill the emotion; it buys time to aim it. Over weeks the pause shortens the recovery time after every stressor.'
  ]],
  'wolf-archetype-psychology-shadow-work': ['The Wolf Archetype: Psychology and Shadow Work', [
    'The wolf archetype carries the shadow material of independence, instinct, and loyalty. In shadow work, the wolf shows up when you are suppressing your own needs to keep the pack peace.',
    'The integration work is learning when to be wolf and when to be human. Pure wolf is isolation; pure human is codependency. The healthy position is a toggle you control consciously.',
    'A practical session: journal the last three times you overrode your own boundary, find the pattern, and design a wolf boundary phrase you will use next time. The archetype becomes a tool, not a possession.'
  ]],
  'shadow-beast-ritual-transformation': ['The Shadow Beast Ritual: Transformation', [
    'The shadow beast is the personified mass of the traits you repress. The ritual gives it a shape, a name, and a function, which converts an unconscious saboteur into a conscious ally.',
    'The structure: meditate into the feeling, let the beast show itself, name it, and negotiate a role for it. Most shadow beasts just want to be acknowledged and given a job that uses their strength.',
    'The danger is summoning without structure. Always close the ritual with an integration step: a written contract with the beast that defines when it is allowed to act. Structure is what keeps the ally an ally.'
  ]],
  'habit-formation-neuroscience-willpower': ['Habit Formation: Neuroscience and Willpower', [
    'Willpower is a finite resource, but habits are willpower-free. The neuroscience is clear: habits live in the basal ganglia and run without the prefrontal cortex, which is why they survive willpower crashes.',
    'The formation protocol is the same one gym culture discovered: cue, routine, reward, repeated with the smallest possible version of the behavior. The size is what makes the repetition sustainable.',
    'Stack new habits on existing anchors to borrow their automaticity. If you already brush your teeth nightly, the journal lives next to the toothbrush. The anchor is the cue that never has to be remembered.'
  ]],
  'stillness-meditation-cognitive-clarity': ['Stillness: Meditation for Cognitive Clarity', [
    'Stillness is not the absence of thought; it is the end of the fight with thought. The practice is a daily appointment where you do nothing for five minutes and let the mind settle on its own schedule.',
    'The clarity payoff is cumulative. A settled mind makes faster decisions, reads situations more accurately, and carries less background noise. The noise is the tax; stillness removes it.',
    'The technique matters less than the consistency. Five minutes daily beats forty minutes weekly. The habit is the mechanism, and the mechanism delivers the clarity.'
  ]],
  'lycanthropy-spiritual-transformation-path': ['Lycanthropy as a Spiritual Transformation Path', [
    'Lycanthropy in the occult sense is a transformation path: the deliberate cultivation of the wild, instinctual self. The wolf is the symbol, and the practice is the integration of raw instinct with conscious will.',
    'The path has three stages: identification with the beast, controlled release of the beast mode, and return to the human self with the gain integrated. Each stage has its own practice and its own failure mode.',
    'The most common failure is refusing the return. The beast mode is a tool, not a residence. The return is what makes the transformation productive instead of destructive.'
  ]],
  'primal-instinct-magic-occult-empowerment': ['Primal Instinct: Magic and Occult Empowerment', [
    'Primal instinct is the pre-linguistic intelligence that magic has always courted. The gut knows before the mind does. The practice of magic is largely the practice of teaching the mind to listen to the gut.',
    'The cultivation protocol: trust small instincts first. Act on the quiet nudge in low-stakes situations and log the outcome. The log builds the evidence base that lets you trust the bigger instincts.',
    'Instinct and impulse are not the same. Impulse is reactivity; instinct is compressed experience. The distinction is the whole art, and the log is what draws the line.'
  ]],
  'surrender-control-paradox-freedom': ['The Surrender Control Paradox: Freedom', [
    'The paradox: the more you try to control outcomes directly, the less control you have. Surrender is not giving up; it is switching from outcome control to process control.',
    'Process control means you control the inputs: the preparation, the timing, the quality of the attempt. Outcome control means you fight for a result you do not actually command. The first is agency; the second is anxiety.',
    'The practice is a daily audit: for each current goal, write what you control and what you do not. Work the first column, release the second. Freedom is the space between them.'
  ]],
  'decisive-moment-framing-choices': ['The Decisive Moment: Framing Choices', [
    'The decisive moment is the instant where a choice becomes real. Most decisions are made before the conscious mind arrives, by framing, defaults, and the state of the body. This guide covers how to own the frame.',
    'Before a decision, name the criteria aloud. The act of naming converts the implicit frame into an explicit one, and an explicit frame can be examined. Most bad choices are bad frames, not bad reasoning.',
    'The two-second rule: if the decision is reversible and low-stakes, decide immediately and do not revisit. Reversible decisions burn time in proportion to the fear, not the stakes. Speed trains the muscle.'
  ]],
  'emotional-regulation-techniques-stoic-neuroscience': ['Emotional Regulation: Stoic and Neuroscience Techniques', [
    'Emotional regulation is the skill of letting feelings pass without letting them steer. The Stoic contribution is the discipline of judgment; the neuroscience contribution is the physiology underneath it.',
    'The stoic practice: label the emotion, examine the judgment behind it, and check it against the facts. The neuroscience addition: breathe to down-regulate the body so the labeling is possible at all.',
    'The combined protocol is 90 seconds: name it, breathe it, examine it. Naming recruits the prefrontal cortex; breathing lowers the stress cascade; examining turns the trigger into data.'
  ]],
  'response-gap-master-impulse-control': ['The Response Gap: Master Impulse Control', [
    'The response gap is the delay you can train between impulse and action. It is the foundation of impulse control, and it is trainable like any other skill, with reps and measurement.',
    'The drill: when you feel the impulse, take one deliberate breath before responding. In a full day, that is a dozen small reps. Over weeks, the delay becomes the default and the impulse loses its veto power.',
    'The gap is not about suppressing the impulse; it is about making room for a second decision. The second decision is where the skill lives.'
  ]]
};

let ok = 0, fail = 0;
for (const slug of Object.keys(CLUSTERS)) {
  const f = BASE + slug + '.html';
  try {
    let h = fs.readFileSync(f, 'utf8');
    const [title, secs] = CLUSTERS[slug];
    let html = '<h2 id="expanded-guide">' + title + '</h2>\n';
    for (const s of secs) html += '<p>' + s + '</p>\n';
    const wolfLike = /wolf|lycanthropy|shadow-beast|primal|animagus/.test(slug);
    html += bookCta(wolfLike ? 'O104271155J' : 'V106730857R',
      wolfLike ? 'Liber Lvpinux: The Lycanthropic Path' : 'Mind the Gap: Master the 0.3 Seconds That Define Your Life',
      wolfLike ? 'The complete Spanish-English guide to the transformative wolf path.' : 'The neuroscience-backed guide to the decisive moments that shape your life.');
    let idx = h.indexOf('<aside');
    if (idx < 0) idx = h.lastIndexOf('</main>');
    if (idx < 0) idx = h.lastIndexOf('</article>');
    if (idx < 0) { fail++; console.log('FAIL no anchor:', slug); continue; }
    h = h.slice(0, idx) + html + h.slice(idx);
    fs.writeFileSync(f, h);
    ok++;
    const words = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
    console.log('OK', slug, 'words~', words);
  } catch (e) { fail++; console.log('ERR', slug, e.message); }
}
console.log('TOTAL ok:', ok, 'fail:', fail);
