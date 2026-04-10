import { 
  Eye, Ear, Brain, 
  Radio, Watch, Activity,
  MessageCircle, BellRing, Vibrate,
  Puzzle, Blocks, Calendar
} from 'lucide-react';

export type ProductCategory = 'visual' | 'hearing' | 'cognitive';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  cost: number;
  icon: any;
  description: string;
  color: string;
}

export const PRODUCTS: Product[] = [
  // Visually Impaired
  {
    id: 'p_smart_cane',
    name: 'Smart Cane',
    category: 'visual',
    cost: 4000,
    icon: Activity,
    description: 'A cane with ultrasonic sensors to detect obstacles.',
    color: 'bg-blue-500'
  },
  {
    id: 'p_audio_reader',
    name: 'Audio Reader',
    category: 'visual',
    cost: 8000,
    icon: Radio,
    description: 'Scans and reads printed text aloud.',
    color: 'bg-blue-600'
  },
  {
    id: 'p_braille_watch',
    name: 'Braille Watch',
    category: 'visual',
    cost: 12000,
    icon: Watch,
    description: 'A tactile watch to read time by touch.',
    color: 'bg-blue-700'
  },

  // Hearing Impaired
  {
    id: 'p_sign_kit',
    name: 'Sign Language Kit',
    category: 'hearing',
    cost: 4000,
    icon: MessageCircle,
    description: 'Flashcards and guides to learn basic signs.',
    color: 'bg-orange-500'
  },
  {
    id: 'p_visual_alert',
    name: 'Visual Alert System',
    category: 'hearing',
    cost: 8000,
    icon: BellRing,
    description: 'Flashing lights for doorbells and alarms.',
    color: 'bg-orange-600'
  },
  {
    id: 'p_vibrating_alarm',
    name: 'Vibrating Alarm',
    category: 'hearing',
    cost: 12000,
    icon: Vibrate,
    description: 'A wearable alarm that wakes you up with vibrations.',
    color: 'bg-orange-700'
  },

  // Cognitive Disabilities
  {
    id: 'p_memory_match',
    name: 'Memory Match Kit',
    category: 'cognitive',
    cost: 4000,
    icon: Puzzle,
    description: 'Games designed to improve short-term memory.',
    color: 'bg-green-500'
  },
  {
    id: 'p_sensory_fidget',
    name: 'Sensory Fidget Set',
    category: 'cognitive',
    cost: 8000,
    icon: Blocks,
    description: 'Tools to help focus and reduce anxiety.',
    color: 'bg-green-600'
  },
  {
    id: 'p_routine_planner',
    name: 'Routine Planner',
    category: 'cognitive',
    cost: 12000,
    icon: Calendar,
    description: 'Visual schedules to help organize daily tasks.',
    color: 'bg-green-700'
  }
];
