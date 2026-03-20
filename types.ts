
export interface UserProfile {
  name: string;
  username: string;
  age?: number;
  medicalConditions?: string;
  avatar?: string;
}

export interface Vital {
  id: string;
  type: 'heart_rate' | 'blood_oxygen' | 'sleep' | 'stress' | 'blood_pressure' | 'ecg';
  value: number | string;
  unit: string;
  timestamp: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string; // Specific time like "08:00 AM"
  timeSlot: 'Morning' | 'Noon' | 'Evening' | 'Night';
  taken: boolean;
  color: string;
  category?: 'medicine' | 'water' | 'walk' | 'other';
}

export interface HistoryLog {
  date: string;
  steps: number;
  medsCompleted: number;
  avgHeartRate: number;
}

export interface Message {
  role: 'ai' | 'user';
  content: string;
  isStreaming?: boolean;
  emotion?: 'happy' | 'sad' | 'love' | 'surprised' | 'neutral' | 'oops';
  timestamp: string;
  moodLabel?: string;
}

export interface Pot {
  id: string;
  name: string;
  personality: 'Playful' | 'Calm' | 'Wise' | 'Curious';
  mood: 'happy' | 'neutral' | 'tired' | 'thriving';
  emoji: string;
  description: string;
  subtitle: string;
  color: string;
  needs: {
    water: number;
    sunlight: number;
    spirit: number;
  };
}

export interface AppState {
  user: UserProfile;
  accounts: UserProfile[]; // Support for multiple accounts
  plantName: string;
  vitals: Vital[];
  medications: Medication[];
  history: HistoryLog[];
  selectedPot: Pot;
  chatMessages: Message[];
  currentView: 'home' | 'watch' | 'history' | 'ai' | 'schedule' | 'selector' | 'settings';
  theme: 'dark' | 'light';
  onboardingStep: 'auth' | 'register' | 'profile' | 'companion' | 'plantName' | 'main';
}
