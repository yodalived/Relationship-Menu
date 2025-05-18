import React from 'react';
import { createPortal } from 'react-dom';
import { OnboardingWizardProps } from './types';
import { useOnboardingState } from './hooks';
import { WelcomeScreen } from './WelcomeScreen';
import { WizardOverlay } from './WizardOverlay';
import { calculateTotalSteps, calculateCurrentStepNumber, calculateProgressPercentage } from './utils';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ 
  steps, 
  storageKey = 'editorOnboardingShown', 
  onFinish,
  welcomeScreen
}) => {
  const {
    currentStep,
    currentSubStep,
    isOpen,
    spotlightRect,
    transitionPhase,
    step,
    isWelcomeScreen,
    hasSubSteps,
    handleNext,
    handlePrevious,
    handleClose
  } = useOnboardingState(steps, storageKey, onFinish);

  if (!isOpen) return null;

  // Calculate progress functions
  const calculateTotalStepsWithData = () => calculateTotalSteps(steps);
  const calculateCurrentStepNumberWithData = () => calculateCurrentStepNumber(
    steps, currentStep, currentSubStep, hasSubSteps || false
  );
  const calculateProgressPercentageWithData = () => calculateProgressPercentage(
    steps, currentStep, currentSubStep, hasSubSteps || false
  );

  if (isWelcomeScreen) {
    return createPortal(
      <WelcomeScreen 
        welcomeScreen={welcomeScreen}
        onStart={handleNext}
        onSkip={handleClose}
        transitionPhase={transitionPhase}
      />,
      document.body
    );
  }

  return createPortal(
    step && spotlightRect ? (
      <WizardOverlay
        step={step}
        spotlightRect={spotlightRect}
        transitionPhase={transitionPhase}
        currentSubStep={currentSubStep}
        currentStep={currentStep}
        steps={steps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onClose={handleClose}
        calculateProgressPercentage={calculateProgressPercentageWithData}
        calculateCurrentStepNumber={calculateCurrentStepNumberWithData}
        calculateTotalSteps={calculateTotalStepsWithData}
      />
    ) : null,
    document.body
  );
};

// Export types for consumers
export * from './types'; 