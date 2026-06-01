'use client';

import confettiLib from 'canvas-confetti';
import { useCallback } from 'react';

const BRAND = ['#E8541C', '#F4B942', '#1A1514', '#2D6A4F', '#FFFBF2'];

function fire(opts: confettiLib.Options) {
  if (typeof window === 'undefined') return;
  confettiLib(opts);
}

export function useConfetti() {
  const fireSignup = useCallback(() => {
    fire({ particleCount: 120, spread: 80, origin: { x: 0.5, y: 0.3 }, colors: BRAND, startVelocity: 55, zIndex: 9999 });
    setTimeout(() => {
      fire({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.65 }, colors: BRAND, zIndex: 9999 });
      fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: BRAND, zIndex: 9999 });
    }, 200);
  }, []);

  const fireTestPassed = useCallback(() => {
    [0.2, 0.5, 0.8].forEach((x, i) => {
      setTimeout(() => {
        fire({ particleCount: 80, spread: 60, origin: { x, y: 0 }, colors: BRAND, startVelocity: 30, gravity: 0.8, zIndex: 9999 });
      }, i * 180);
    });
    setTimeout(() => {
      fire({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: BRAND, startVelocity: 45, scalar: 1.1, zIndex: 9999 });
    }, 600);
  }, []);

  const fireFlashcardComplete = useCallback(() => {
    fire({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.4 }, colors: BRAND, startVelocity: 35, zIndex: 9999 });
  }, []);

  return { fireSignup, fireTestPassed, fireFlashcardComplete };
}
