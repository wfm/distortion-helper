const distortions = [
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing Thinking',
    shortDescription: 'Seeing things in black and white, with no middle ground.',
    example: '"I made one mistake on the presentation — the whole thing was a failure."',
    reframeTechnique: 'Examine the Evidence',
    reframeTechniqueDescription:
      'Ask yourself: what facts actually support or contradict this black-or-white view? Look for shades of grey — partial successes, mixed outcomes — and weigh them honestly rather than defaulting to the extreme interpretation.',
  },
  {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    shortDescription: 'Treating one negative event as a never-ending pattern of defeat.',
    example: '"I got rejected for that job. I never get what I want."',
    reframeTechnique: 'Examine the Evidence',
    reframeTechniqueDescription:
      'Challenge the word "always" or "never" by listing concrete exceptions. One negative event doesn\'t define a pattern unless the evidence consistently supports it.',
  },
  {
    id: 'mental-filter',
    name: 'Mental Filter',
    shortDescription: 'Dwelling on a single negative detail while ignoring the bigger picture.',
    example: '"Someone left a critical comment on my work, so the whole project must be bad."',
    reframeTechnique: 'The Friend Technique',
    reframeTechniqueDescription:
      'Imagine a close friend described this situation to you. What would you say to them? This shift in perspective makes it easier to notice the positives you\'re filtering out for yourself.',
  },
  {
    id: 'disqualifying-the-positive',
    name: 'Disqualifying the Positive',
    shortDescription: 'Dismissing positive experiences as flukes that "don\'t count."',
    example: '"They only complimented me to be polite — it didn\'t really mean anything."',
    reframeTechnique: 'The Behavioral Experiment',
    reframeTechniqueDescription:
      'Design a small test to check whether the positive really "doesn\'t count." Track outcomes objectively for a week and compare them to your prediction — the data often contradicts the dismissal.',
  },
  {
    id: 'jumping-to-conclusions',
    name: 'Jumping to Conclusions',
    shortDescription: 'Making negative assumptions without evidence — mind reading or fortune telling.',
    example: '"She didn\'t text back right away. She must be angry with me."',
    reframeTechnique: 'Thinking in Shades of Grey',
    reframeTechniqueDescription:
      'Replace the certainty of a mind-read or fortune-tell with a probability range. Ask: on a scale of 0–100%, how likely is this really? Then consider what you\'d do if the more moderate outcome happened.',
  },
  {
    id: 'magnification-or-minimization',
    name: 'Magnification or Minimization',
    shortDescription: 'Blowing negatives out of proportion or shrinking the importance of positives.',
    example: '"Forgetting that one thing proves I\'m completely incompetent."',
    reframeTechnique: 'The Survey Method',
    reframeTechniqueDescription:
      'Ask a few trusted people how big a deal they think this actually is. Comparing your reaction to others\' calibrated responses helps you see when you\'ve blown something up or unfairly shrunk something positive.',
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    shortDescription: 'Assuming that because you feel something strongly, it must be true.',
    example: '"I feel stupid, so I must actually be stupid."',
    reframeTechnique: 'Define Your Terms',
    reframeTechniqueDescription:
      'Write down the feeling and then separately list the objective evidence for and against the belief it generates. Feelings are real, but they aren\'t facts — separating them exposes the gap.',
  },
  {
    id: 'should-statements',
    name: 'Should Statements',
    shortDescription: 'Holding yourself or others to rigid rules that generate guilt or frustration.',
    example: '"I should always know the right answer. I shouldn\'t need to ask for help."',
    reframeTechnique: 'The Semantic Method',
    reframeTechniqueDescription:
      'Replace "should," "must," and "ought" with "could," "would like to," or "it would be helpful if." Softening the language reduces shame and guilt while keeping the underlying goal intact.',
  },
  {
    id: 'labeling',
    name: 'Labeling',
    shortDescription: 'Attaching a harsh global label to yourself or others based on a single event.',
    example: '"I lost my temper once — I\'m a terrible person."',
    reframeTechnique: 'Reattribution',
    reframeTechniqueDescription:
      'Break the global label into specific behaviors or events. Instead of "I\'m a failure," identify the particular action that went wrong and ask what situational factors contributed — spreading responsibility more accurately.',
  },
  {
    id: 'personalization-and-blame',
    name: 'Personalization and Blame',
    shortDescription: 'Taking excessive personal responsibility for events outside your control, or blaming others entirely.',
    example: '"My friend is in a bad mood — it must be something I did."',
    reframeTechnique: 'Cost-Benefit Analysis',
    reframeTechniqueDescription:
      'List the advantages and disadvantages of taking on full responsibility (or assigning it entirely to others). This reveals when blame is protecting you from something or keeping you stuck, and helps you find a more balanced attribution.',
  },
];

export default distortions;
