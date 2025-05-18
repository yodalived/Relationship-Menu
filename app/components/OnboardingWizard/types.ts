export interface SubStep {
  title: string;
  description: string;
}

export interface Step {
  selector: string;
  title: string;
  description: string;
  subSteps?: SubStep[];
}

export interface WelcomeScreen {
  title: string;
  description: string;
}

export interface OnboardingWizardProps {
  steps: Step[];
  storageKey?: string;
  onFinish?: () => void;
  welcomeScreen: WelcomeScreen;
}

export type TransitionPhase = 'none' | 'fadeOutWelcome' | 'showFullPage' | 'fadeInSpotlight'; 