import { 
  Hand, Headphones, Shapes, 
  Circle, Square, Triangle, Star, Heart,
  Dog, Cat, Bird, 
  ThumbsUp, ThumbsDown, HandMetal,
  Car, Train, Plane,
  Waves, CloudRain, Flame, Wind,
  Utensils, CupSoda, HelpCircle, Smile, Frown,
  Type, Fish, Trees,
  MessageCircle, Check, X, Octagon,
  Users, Bell, Keyboard, Footprints, Volume2,
  Sun, BookOpen, Clock, Zap, Music, MousePointer2,
  Camera, Smartphone, PenTool, Home, CupSoda, Laptop
} from 'lucide-react';

export const GAMES = [
  { 
    id: 'sign-and-play', 
    title: "Sign & Play", 
    bg: "bg-[#FF6B35]", 
    borderBg: "border-[#D95A2B]", 
    icon: Hand, 
    levels: [
      { 
        id: 'l1', 
        title: 'Level 1: Hello', 
        gesture: 'HELLO',
        introText: 'Let\'s learn how to sign "Hello"!', 
        introIcon: Waves,
        funFact: 'Waving is a universal greeting across many cultures',
        guidedText: 'Wave your hand gently to say "Hello".',
        practiceText: 'Which sign means "Hello"?',
        testQuestions: [
          {
            questionText: 'Find the "Hello" sign',
            correctOption: 'hello',
            options: [
              { id: 'hello', label: 'Hello', icon: Waves },
              { id: 'stop', label: 'Stop', icon: Octagon },
              { id: 'no', label: 'No', icon: X },
            ]
          }
        ]
      },
      { 
        id: 'l2', 
        title: 'Level 2: Thank You', 
        gesture: 'HELLO',
        introText: 'Let\'s learn how to sign "Thank You"!', 
        introIcon: Smile,
        funFact: 'Sign languages have full grammar like spoken languages',
        guidedText: 'Touch chin → move hand forward to say "Thank You".',
        practiceText: 'Which sign means "Thank You"?',
        testQuestions: [
          {
            questionText: 'Find the "Thank You" sign',
            correctOption: 'thanks',
            options: [
              { id: 'thanks', label: 'Thank You', icon: Smile },
              { id: 'bad', label: 'Bad', icon: Frown },
              { id: 'help', label: 'Help', icon: HelpCircle },
            ]
          }
        ]
      },
      { 
        id: 'l3', 
        title: 'Level 3: Yes', 
        gesture: 'YES',
        introText: 'Let\'s learn how to sign "Yes"!', 
        introIcon: Check,
        funFact: 'Head nods are common signs of agreement worldwide',
        guidedText: 'Make a fist and nod it up and down to say "Yes".',
        practiceText: 'Which sign means "Yes"?',
        testQuestions: [
          {
            questionText: 'Find the "Yes" sign',
            correctOption: 'yes',
            options: [
              { id: 'no', label: 'No', icon: X },
              { id: 'yes', label: 'Yes', icon: Check },
              { id: 'hello', label: 'Hello', icon: Waves },
            ]
          }
        ]
      },
      { 
        id: 'l4', 
        title: 'Level 4: No', 
        gesture: 'YES',
        introText: 'Let\'s learn how to sign "No"!', 
        introIcon: X,
        funFact: 'Body language often communicates faster than words',
        guidedText: 'Shake index and middle finger to say "No".',
        practiceText: 'Which sign means "No"?',
        testQuestions: [
          {
            questionText: 'Find the "No" sign',
            correctOption: 'no',
            options: [
              { id: 'yes', label: 'Yes', icon: Check },
              { id: 'no', label: 'No', icon: X },
              { id: 'stop', label: 'Stop', icon: Octagon },
            ]
          }
        ]
      },
      { 
        id: 'l5', 
        title: 'Level 5: Stop', 
        gesture: 'HELLO',
        introText: 'Let\'s learn how to sign "Stop"!', 
        introIcon: Octagon,
        funFact: 'Stop gestures are understood globally',
        guidedText: 'One palm hits the other to say "Stop".',
        practiceText: 'Which sign means "Stop"?',
        testQuestions: [
          {
            questionText: 'Find the "Stop" sign',
            correctOption: 'stop',
            options: [
              { id: 'hello', label: 'Hello', icon: Waves },
              { id: 'stop', label: 'Stop', icon: Octagon },
              { id: 'thanks', label: 'Thank You', icon: Smile },
            ]
          }
        ]
      },
      { 
        id: 'l6', 
        title: 'Level 6: Help', 
        gesture: 'HELLO',
        introText: 'Let\'s learn how to sign "Help"!', 
        introIcon: HelpCircle,
        funFact: 'Asking for help improves teamwork and learning',
        guidedText: 'One hand lifts the other upward to say "Help".',
        practiceText: 'Which sign means "Help"?',
        testQuestions: [
          {
            questionText: 'Find the "Help" sign',
            correctOption: 'help',
            options: [
              { id: 'help', label: 'Help', icon: HelpCircle },
              { id: 'sorry', label: 'Sorry', icon: Frown },
              { id: 'eat', label: 'Eat', icon: Utensils },
            ]
          }
        ]
      },
      { 
        id: 'l7', 
        title: 'Level 7: Eat', 
        gesture: 'YES',
        introText: 'Let\'s learn how to sign "Eat"!', 
        introIcon: Utensils,
        funFact: 'Many food gestures are similar across cultures',
        guidedText: 'Bring fingers to mouth like you are eating.',
        practiceText: 'Which sign means "Eat"?',
        testQuestions: [
          {
            questionText: 'Find the "Eat" sign',
            correctOption: 'eat',
            options: [
              { id: 'drink', label: 'Drink', icon: CupSoda },
              { id: 'eat', label: 'Eat', icon: Utensils },
              { id: 'stop', label: 'Stop', icon: Octagon },
            ]
          }
        ]
      },
      { 
        id: 'l8', 
        title: 'Level 8: Drink', 
        gesture: 'YES',
        introText: 'Let\'s learn how to sign "Drink"!', 
        introIcon: CupSoda,
        funFact: 'Gesture-based communication is used even by babies',
        guidedText: 'Pretend to hold a cup and sip to say "Drink".',
        practiceText: 'Which sign means "Drink"?',
        testQuestions: [
          {
            questionText: 'Find the "Drink" sign',
            correctOption: 'drink',
            options: [
              { id: 'eat', label: 'Eat', icon: Utensils },
              { id: 'drink', label: 'Drink', icon: CupSoda },
              { id: 'hello', label: 'Hello', icon: Waves },
            ]
          }
        ]
      },
      { 
        id: 'l9', 
        title: 'Level 9: Friend', 
        gesture: 'PEACE',
        introText: 'Let\'s learn how to sign "Friend"!', 
        introIcon: Users,
        funFact: 'Friendship gestures exist in many sign languages',
        guidedText: 'Hook two fingers together to say "Friend".',
        practiceText: 'Which sign means "Friend"?',
        testQuestions: [
          {
            questionText: 'Find the "Friend" sign',
            correctOption: 'friend',
            options: [
              { id: 'friend', label: 'Friend', icon: Users },
              { id: 'love', label: 'Love', icon: Heart },
              { id: 'hello', label: 'Hello', icon: Waves },
            ]
          }
        ]
      },
      { 
        id: 'l10', 
        title: 'Level 10: Love', 
        gesture: 'PEACE',
        introText: 'Let\'s learn how to sign "Love"!', 
        introIcon: Heart,
        funFact: 'Emotional gestures are easy to recognize globally',
        guidedText: 'Cross arms over chest to say "Love".',
        practiceText: 'Which sign means "Love"?',
        testQuestions: [
          {
            questionText: 'Find the "Love" sign',
            correctOption: 'love',
            options: [
              { id: 'friend', label: 'Friend', icon: Users },
              { id: 'love', label: 'Love', icon: Heart },
              { id: 'thanks', label: 'Thank You', icon: Smile },
            ]
          }
        ]
      }
    ]
  },
  { 
    id: 'listen-and-guess', 
    title: "Hear & Play", 
    bg: "bg-[#BC9A16]", 
    borderBg: "border-[#9A7D12]", 
    icon: Headphones, 
    levels: [
      { 
        id: 'l1', 
        title: 'Level 1: Dog Bark', 
        introText: 'Listen carefully. What animal is this?', 
        introIcon: Dog,
        funFact: 'Dogs can understand human emotions',
        guidedText: 'A dog says "Woof". Tap the dog!',
        practiceText: 'Which animal says "Woof"?',
        audioUrl: '/sounds/dog-bark.mp3',
        testQuestions: [
          {
            questionText: 'Find the Dog',
            correctOption: 'dog',
            audioUrl: '/sounds/dog-bark.mp3',
            options: [
              { id: 'dog', label: 'Dog', icon: Dog },
              { id: 'cat', label: 'Cat', icon: Cat },
              { id: 'bird', label: 'Bird', icon: Bird },
              { id: 'car', label: 'Car', icon: Car },
            ]
          }
        ]
      },
      { 
        id: 'l2', 
        title: 'Level 2: Cat Meow', 
        introText: 'Listen carefully. What animal is this?', 
        introIcon: Cat,
        funFact: 'Cats use different meows to communicate',
        guidedText: 'A cat says "Meow". Tap the cat!',
        practiceText: 'Which animal says "Meow"?',
        audioUrl: '/sounds/cat-meow.mp3',
        testQuestions: [
          {
            questionText: 'Find the Cat',
            correctOption: 'cat',
            audioUrl: '/sounds/cat-meow.mp3',
            options: [
              { id: 'dog', label: 'Dog', icon: Dog },
              { id: 'cat', label: 'Cat', icon: Cat },
              { id: 'cow', label: 'Cow', icon: Volume2 },
              { id: 'goat', label: 'Goat', icon: Volume2 },
            ]
          }
        ]
      },
      { 
        id: 'l3', 
        title: 'Level 3: Bird Chirping', 
        introText: 'Listen carefully. What animal is this?', 
        introIcon: Bird,
        funFact: 'Birds sing to communicate and attract mates',
        guidedText: 'A bird says "Chirp". Tap the bird!',
        practiceText: 'Which animal says "Chirp"?',
        audioUrl: '/sounds/bird-chirp.mp3',
        testQuestions: [
          {
            questionText: 'Find the Bird',
            correctOption: 'bird',
            audioUrl: '/sounds/bird-chirp.mp3',
            options: [
              { id: 'bird', label: 'Bird', icon: Bird },
              { id: 'wind', label: 'Wind', icon: Wind },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'fire', label: 'Fire', icon: Flame },
            ]
          }
        ]
      },
      { 
        id: 'l4', 
        title: 'Level 4: Rain', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: CloudRain,
        funFact: 'Rain sounds can help people relax',
        guidedText: 'Rain falls from the clouds. Tap the rain!',
        practiceText: 'Which sound is the Rain?',
        audioUrl: '/sounds/rain.mp3',
        testQuestions: [
          {
            questionText: 'Find the Rain',
            correctOption: 'rain',
            audioUrl: '/sounds/rain.mp3',
            options: [
              { id: 'fire', label: 'Fire', icon: Flame },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'car', label: 'Car', icon: Car },
              { id: 'clock', label: 'Clock', icon: Clock },
            ]
          }
        ]
      },
      { 
        id: 'l5', 
        title: 'Level 5: Car Horn', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: Car,
        funFact: 'Horns are used for safety warnings',
        guidedText: 'A car horn goes "Beep". Tap the car!',
        practiceText: 'Which vehicle has a horn?',
        audioUrl: 'https://www.soundjay.com/transportation/car-horn-1.mp3',
        testQuestions: [
          {
            questionText: 'Find the Car',
            correctOption: 'car',
            audioUrl: 'https://www.soundjay.com/transportation/car-horn-1.mp3',
            options: [
              { id: 'car', label: 'Car', icon: Car },
              { id: 'train', label: 'Train', icon: Train },
              { id: 'dog', label: 'Dog', icon: Dog },
              { id: 'bell', label: 'Bell', icon: Bell },
            ]
          }
        ]
      },
      { 
        id: 'l6', 
        title: 'Level 6: Bell Ringing', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: Bell,
        funFact: 'Bells are used in schools and temples',
        guidedText: 'A bell rings "Ding Dong". Tap the bell!',
        practiceText: 'Which sound is the Bell?',
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        testQuestions: [
          {
            questionText: 'Find the Bell',
            correctOption: 'bell',
            audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
            options: [
              { id: 'bell', label: 'Bell', icon: Bell },
              { id: 'alarm', label: 'Alarm', icon: Clock },
              { id: 'drum', label: 'Drum', icon: Music },
              { id: 'door', label: 'Door', icon: Octagon },
            ]
          }
        ]
      },
      { 
        id: 'l7', 
        title: 'Level 7: Ocean Waves', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: Waves,
        funFact: 'Ocean sounds can reduce stress',
        guidedText: 'Ocean waves crash on the shore. Tap the ocean!',
        practiceText: 'Which sound is the Ocean?',
        audioUrl: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
        testQuestions: [
          {
            questionText: 'Find the Ocean',
            correctOption: 'ocean',
            audioUrl: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3',
            options: [
              { id: 'ocean', label: 'Ocean', icon: Waves },
              { id: 'wind', label: 'Wind', icon: Wind },
              { id: 'fire', label: 'Fire', icon: Flame },
              { id: 'fan', label: 'Fan', icon: Wind },
            ]
          }
        ]
      },
      { 
        id: 'l8', 
        title: 'Level 8: Keyboard Typing', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: Keyboard,
        funFact: 'Typing speed improves with practice',
        guidedText: 'A keyboard makes a "Click" sound. Tap the keyboard!',
        practiceText: 'Which sound is Typing?',
        audioUrl: 'https://www.soundjay.com/misc/sounds/keyboard-typing-1.mp3',
        testQuestions: [
          {
            questionText: 'Find the Typing sound',
            correctOption: 'typing',
            audioUrl: 'https://www.soundjay.com/misc/sounds/keyboard-typing-1.mp3',
            options: [
              { id: 'typing', label: 'Typing', icon: Keyboard },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'clock', label: 'Clock', icon: Clock },
              { id: 'engine', label: 'Engine', icon: Car },
            ]
          }
        ]
      },
      { 
        id: 'l9', 
        title: 'Level 9: Footsteps', 
        introText: 'Listen carefully. What is this sound?', 
        introIcon: Footprints,
        funFact: 'Humans can recognize people by footsteps',
        guidedText: 'Footsteps make a "Thump" sound. Tap the footsteps!',
        practiceText: 'Which sound is Footsteps?',
        audioUrl: 'https://www.soundjay.com/misc/sounds/footsteps-1.mp3',
        testQuestions: [
          {
            questionText: 'Find the Footsteps',
            correctOption: 'footsteps',
            audioUrl: 'https://www.soundjay.com/misc/sounds/footsteps-1.mp3',
            options: [
              { id: 'footsteps', label: 'Footsteps', icon: Footprints },
              { id: 'drum', label: 'Drum', icon: Music },
              { id: 'wind', label: 'Wind', icon: Wind },
              { id: 'bird', label: 'Bird', icon: Bird },
            ]
          }
        ]
      },
      { 
        id: 'l10', 
        title: 'Level 10: Mixed', 
        introText: 'Listen carefully. Can you hear two sounds?', 
        introIcon: Volume2,
        funFact: 'The brain can separate multiple sounds at once',
        guidedText: 'Listen for the dog and the bell. Tap the correct mix!',
        practiceText: 'Which mix do you hear?',
        audioUrl: ['https://www.soundjay.com/nature/dog-bark-1.mp3', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'],
        testQuestions: [
          {
            questionText: 'Find Dog & Bell',
            correctOption: 'dog-bell',
            audioUrl: ['https://www.soundjay.com/nature/dog-bark-1.mp3', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'],
            options: [
              { id: 'dog-bell', label: 'Dog & Bell', icon: Volume2 },
              { id: 'cat-rain', label: 'Cat & Rain', icon: Volume2 },
              { id: 'bird-wind', label: 'Bird & Wind', icon: Volume2 },
              { id: 'car-fire', label: 'Car & Fire', icon: Volume2 },
            ]
          }
        ]
      }
    ]
  },
  { 
    id: 'shape-sorter', 
    title: "Speak & Say", 
    bg: "bg-[#0A7A66]", 
    borderBg: "border-[#086353]", 
    icon: Shapes, 
    levels: [
      { 
        id: 'l1', 
        title: 'Level 1: Spell CAT', 
        type: 'spelling',
        introText: 'Let\'s learn how to spell "CAT"!', 
        introIcon: Type,
        funFact: 'Learning small words builds memory',
        guidedText: 'C-A-T spells CAT. Tap the letters!',
        practiceText: 'How do you spell CAT?',
        testQuestions: [
          {
            questionText: 'Spell CAT',
            correctOption: 'CAT',
            options: [
              { id: 'CAT', label: 'CAT', icon: Type },
              { id: 'DOG', label: 'DOG', icon: Type },
              { id: 'BIRD', label: 'BIRD', icon: Type },
              { id: 'X', label: 'X', icon: Type },
            ]
          }
        ]
      },
      { 
        id: 'l2', 
        title: 'Level 2: Spell DOG', 
        type: 'spelling',
        introText: 'Let\'s learn how to spell "DOG"!', 
        introIcon: Dog,
        funFact: 'Repetition improves learning speed',
        guidedText: 'D-O-G spells DOG. Tap the letters!',
        practiceText: 'How do you spell DOG?',
        testQuestions: [
          {
            questionText: 'Spell DOG',
            correctOption: 'DOG',
            options: [
              { id: 'DOG', label: 'DOG', icon: Type },
              { id: 'CAT', label: 'CAT', icon: Type },
              { id: 'FISH', label: 'FISH', icon: Type },
              { id: 'P', label: 'P', icon: Type },
            ]
          }
        ]
      },
      { 
        id: 'l3', 
        title: 'Level 3: Spell SUN', 
        type: 'spelling',
        introText: 'Let\'s learn how to spell "SUN"!', 
        introIcon: Sun,
        funFact: 'The sun is the main energy source for Earth',
        guidedText: 'S-U-N spells SUN. Tap the letters!',
        practiceText: 'How do you spell SUN?',
        testQuestions: [
          {
            questionText: 'Spell SUN',
            correctOption: 'SUN',
            options: [
              { id: 'SUN', label: 'SUN', icon: Type },
              { id: 'MOON', label: 'MOON', icon: Type },
              { id: 'STAR', label: 'STAR', icon: Type },
              { id: 'M', label: 'M', icon: Type },
            ]
          }
        ]
      },
      { 
        id: 'l4', 
        title: 'Level 4: Spell BALL', 
        type: 'spelling',
        introText: 'Let\'s learn how to spell "BALL"!', 
        introIcon: Type,
        funFact: 'Playing games improves brain activity',
        guidedText: 'B-A-L-L spells BALL. Tap the letters!',
        practiceText: 'How do you spell BALL?',
        testQuestions: [
          {
            questionText: 'Spell BALL',
            correctOption: 'BALL',
            options: [
              { id: 'BALL', label: 'BALL', icon: Type },
              { id: 'BAT', label: 'BAT', icon: Type },
              { id: 'BELL', label: 'BELL', icon: Type },
              { id: 'T', label: 'T', icon: Type },
            ]
          }
        ]
      },
      { 
        id: 'l5', 
        title: 'Level 5: Spell TREE', 
        type: 'spelling',
        introText: 'Let\'s learn how to spell "TREE"!', 
        introIcon: Trees,
        funFact: 'Trees produce oxygen for us',
        guidedText: 'T-R-E-E spells TREE. Tap the letters!',
        practiceText: 'How do you spell TREE?',
        testQuestions: [
          {
            questionText: 'Spell TREE',
            correctOption: 'TREE',
            options: [
              { id: 'TREE', label: 'TREE', icon: Type },
              { id: 'BIRD', label: 'BIRD', icon: Type },
              { id: 'FISH', label: 'FISH', icon: Type },
              { id: 'P', label: 'P', icon: Type },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'see-and-identify',
    title: "See & Identify",
    bg: "bg-[#7C3AED]",
    borderBg: "border-[#5B21B6]",
    icon: Camera,
    levels: [
      {
        id: 'l1',
        title: 'Level 1: Find a Laptop',
        targetObject: 'laptop',
        introText: 'Can you find a laptop? Show it to the camera!',
        introIcon: Laptop,
        funFact: 'Laptops help us learn, play, and work from anywhere!',
        guidedText: 'Pick up a laptop and show it to the camera.',
        practiceText: 'Show the laptop now!',
        testQuestions: [
          {
            questionText: 'Show a Laptop',
            correctOption: 'laptop',
            options: [
              { id: 'laptop', label: 'Laptop', icon: Laptop }
            ]
          }
        ]
      },
      {
        id: 'l2',
        title: 'Level 2: Find a Book',
        targetObject: 'book',
        introText: 'Let\'s find a book! Books are full of amazing stories.',
        introIcon: BookOpen,
        funFact: 'The first books were written on clay tablets thousands of years ago!',
        guidedText: 'Hold a book up to the camera.',
        practiceText: 'Show the book now!',
        testQuestions: [
          {
            questionText: 'Show a Book',
            correctOption: 'book',
            options: [
              { id: 'book', label: 'Book', icon: BookOpen }
            ]
          }
        ]
      },
      {
        id: 'l3',
        title: 'Level 3: Find a Phone',
        targetObject: 'cell phone',
        introText: 'Can you find a mobile phone? We use them to talk to friends.',
        introIcon: Smartphone,
        funFact: 'Mobile phones are actually powerful computers that fit in your pocket!',
        guidedText: 'Show a phone to the camera.',
        practiceText: 'Show the phone now!',
        testQuestions: [
          {
            questionText: 'Show a Phone',
            correctOption: 'cell phone',
            options: [
              { id: 'cell phone', label: 'Phone', icon: Smartphone }
            ]
          }
        ]
      },
      {
        id: 'l4',
        title: 'Level 4: Find a Chair',
        targetObject: 'chair',
        introText: 'Is there a chair nearby? Stand next to it or show it!',
        introIcon: Home,
        funFact: 'The oldest chairs in the world are over 4,500 years old!',
        guidedText: 'Point the camera at a chair.',
        practiceText: 'Show the chair now!',
        testQuestions: [
          {
            questionText: 'Show a Chair',
            correctOption: 'chair',
            options: [
              { id: 'chair', label: 'Chair', icon: Home }
            ]
          }
        ]
      },
      {
        id: 'l5',
        title: 'Level 5: Find a Pen',
        targetObject: 'pen',
        introText: 'Finally, let\'s find a pen or pencil to write with!',
        introIcon: PenTool,
        funFact: 'A single pencil can draw a line that is 35 miles long!',
        guidedText: 'Show a pen or pencil to the camera.',
        practiceText: 'Show the pen now!',
        testQuestions: [
          {
            questionText: 'Show a Pen',
            correctOption: 'pen',
            options: [
              { id: 'pen', label: 'Pen', icon: PenTool }
            ]
          }
        ]
      }
    ]
  }
];
