import { Question } from '@/types';

export const QUESTIONS: Question[] = [
  {
    id: 'porosity',
    stepNumber: 1,
    category: 'Porosity & Moisture',
    title: 'How does your hair absorb products?',
    question:
      'Do hair products disappear quickly into your hair, or do they sit on top and create white buildup?',
    subtitle: 'Try dabbing a few drops of water on a dry section and watch what happens.',
    options: [
      {
        id: 'high',
        label: 'Absorbs fast — drinks it up',
        description: 'Products sink in immediately, hair always feels thirsty',
        value: 'high_porosity',
      },
      {
        id: 'medium',
        label: 'Somewhere in between',
        description: 'Absorbs reasonably well — not too fast or too slow',
        value: 'medium_porosity',
      },
      {
        id: 'low',
        label: 'Sits on top — white buildup',
        description: 'Products bead or coat the surface without absorbing',
        value: 'low_porosity',
      },
    ],
  },
  {
    id: 'elasticity',
    stepNumber: 2,
    category: 'Elasticity & Strength',
    title: 'How stretchy is a wet strand?',
    question:
      'When you stretch a wet strand of hair, does it snap immediately, stretch and bounce back, or stay limp?',
    subtitle: 'Wet a single strand and gently pull it from both ends.',
    options: [
      {
        id: 'snap',
        label: 'Snaps right away',
        description: 'Little to no stretch before breaking',
        value: 'low_elasticity',
      },
      {
        id: 'bounce',
        label: 'Stretches then bounces back',
        description: 'Good spring — returns to its original length',
        value: 'good_elasticity',
      },
      {
        id: 'limp',
        label: 'Stretches but stays limp',
        description: "Stretches out but doesn't spring back",
        value: 'damaged_elasticity',
      },
    ],
  },
  {
    id: 'thickness',
    stepNumber: 3,
    category: 'Thickness & Density',
    title: 'How thick is a single strand?',
    question:
      'If you roll a single hair strand between your fingers, does it feel like a thin thread or a thick wire?',
    subtitle: 'Pull out one strand and roll it between your thumb and index finger.',
    options: [
      {
        id: 'fine',
        label: 'Barely feel it — very fine',
        description: 'Almost invisible, like a whisper of thread',
        value: 'fine',
      },
      {
        id: 'medium',
        label: 'Noticeable — standard thread',
        description: 'Clear feel but not thick, like sewing thread',
        value: 'medium',
      },
      {
        id: 'coarse',
        label: 'Thick and sturdy — like wire',
        description: 'Clearly substantial, strong, and wiry',
        value: 'coarse',
      },
    ],
  },
  {
    id: 'curl_pattern',
    stepNumber: 4,
    category: 'Curl Pattern',
    title: 'What does your wet hair look like?',
    question:
      "When wet, does your hair show distinct 'S' coils, sharp 'Z' angles, or a fluffy cloud-like texture?",
    subtitle: 'Check freshly washed hair before applying any products.',
    options: [
      {
        id: 'type3',
        label: "Soft 'S' shaped coils",
        description: 'Clear S-curves — loose to springy ringlets (Type 3)',
        value: 'type_3',
      },
      {
        id: 'type4ab',
        label: "Sharp 'Z' angles — tight coils",
        description: 'Defined tight coils with a distinct Z-pattern (Type 4A/4B)',
        value: 'type_4ab',
      },
      {
        id: 'type4c',
        label: 'Fluffy cloud — little definition',
        description: 'Dense and full, minimal visible curl pattern (Type 4C)',
        value: 'type_4c',
      },
    ],
  },
  {
    id: 'styling_goal',
    stepNumber: 5,
    category: 'Your Hair Goals',
    title: 'What styles are you aiming for?',
    question: 'What is your primary styling goal?',
    subtitle: 'Pick the look you want to achieve most often.',
    options: [
      {
        id: 'washngo',
        label: 'Defined wash-and-gos',
        description: 'Show off natural curl pattern with defined coils',
        value: 'wash_and_go',
      },
      {
        id: 'twistout',
        label: 'Twist-outs or braid-outs',
        description: 'Stretched, defined styles with volume',
        value: 'twist_braid_out',
      },
      {
        id: 'stretched',
        label: 'Stretched styles',
        description: 'Blowouts, banding, or elongated looks',
        value: 'stretched',
      },
      {
        id: 'protective',
        label: 'Protective styles',
        description: 'Box braids, twists, wigs, or weaves',
        value: 'protective',
      },
    ],
  },
  {
    id: 'scalp',
    stepNumber: 6,
    category: 'Scalp & Routine',
    title: 'How does your scalp behave?',
    question:
      'Does your scalp frequently feel itchy, dry, and flaky, or does it get oily quickly?',
    subtitle: 'Think about how your scalp feels 2–3 days after washing.',
    options: [
      {
        id: 'dry',
        label: 'Itchy, dry, and flaky',
        description: 'Dandruff-prone, tight feeling, always needs moisture',
        value: 'dry_scalp',
      },
      {
        id: 'oily',
        label: 'Gets oily quickly',
        description: 'Needs frequent washing, prone to product buildup',
        value: 'oily_scalp',
      },
      {
        id: 'balanced',
        label: 'Pretty balanced',
        description: 'Neither too dry nor oily — manageable',
        value: 'balanced_scalp',
      },
      {
        id: 'sensitive',
        label: 'Sensitive or easily irritated',
        description: 'Reacts to products, prone to inflammation or redness',
        value: 'sensitive_scalp',
      },
    ],
  },
];

export const TOTAL_STEPS = QUESTIONS.length;
