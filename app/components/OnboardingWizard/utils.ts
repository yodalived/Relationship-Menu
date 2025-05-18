import { Step } from './types';

export function getSpotlightRect(step: Step | null): DOMRect | null {
  if (!step) return null;

  const elements = document.querySelectorAll(step.selector);
  for (const el of elements) {
    if (el instanceof HTMLElement && window.getComputedStyle(el).display !== 'none') {
      return el.getBoundingClientRect();
    }
  }
  return null;
}

export function getModalPosition(
  spotlightRect: DOMRect | null, 
  modalSize: { width: number, height: number }
) {
  if (!spotlightRect) return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  
  const modalWidth = modalSize.width;
  const modalHeight = modalSize.height;
  const minPadding = 30;
  const edgePadding = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // Try to place below first
  if (vh - spotlightRect.bottom > modalHeight + minPadding) {
    return {
      left: Math.min(Math.max(spotlightRect.left, edgePadding), vw - modalWidth - edgePadding),
      top: spotlightRect.bottom + minPadding,
      transform: 'none',
      maxWidth: `${modalWidth}px`,
    };
  }
  // If not enough space below, place above
  if (spotlightRect.top > modalHeight + minPadding) {
    return {
      left: Math.min(Math.max(spotlightRect.left, edgePadding), vw - modalWidth - edgePadding),
      top: spotlightRect.top - modalHeight - minPadding,
      transform: 'none',
      maxWidth: `${modalWidth}px`,
    };
  }
  // Fallback: center
  return {
    left: '50%',
    top: '5%',
    transform: 'translate(-50%, -5%)',
    maxWidth: `${Math.min(modalWidth, vw - (edgePadding * 2))}px`,
  };
}

export function calculateTotalSteps(steps: Step[]) {
  let total = 0;
  steps.forEach(s => {
    if (s?.subSteps && Array.isArray(s.subSteps) && s.subSteps.length > 0) {
      total += s.subSteps.length;
    } else {
      total += 1;
    }
  });
  return total;
}

export function calculateCurrentStepNumber(
  steps: Step[], 
  currentStep: number, 
  currentSubStep: number, 
  hasSubSteps: boolean
) {
  if (currentStep < 0) return 0;
  
  let count = 0;
  
  // Count completed steps
  for (let i = 0; i < currentStep; i++) {
    const stepItem = steps[i];
    if (stepItem?.subSteps && Array.isArray(stepItem.subSteps) && stepItem.subSteps.length > 0) {
      count += stepItem.subSteps.length;
    } else {
      count += 1;
    }
  }
  
  // Add current step
  if (hasSubSteps) {
    count += currentSubStep + 1;
  } else {
    count += 1;
  }
  
  return count;
}

export function calculateProgressPercentage(
  steps: Step[], 
  currentStep: number, 
  currentSubStep: number, 
  hasSubSteps: boolean
) {
  const total = calculateTotalSteps(steps);
  const current = calculateCurrentStepNumber(steps, currentStep, currentSubStep, hasSubSteps);
  return (current / total) * 100;
} 