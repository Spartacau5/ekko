// Phase 5: demo flow context.
// Tracks the active walkthrough flow + current step. Persisted to
// localStorage so a demo can survive a reload. The WalkthroughStrip reads
// from this context and renders a persistent bottom bar; pages can also
// read from it (e.g. to highlight the section the current step references).

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DemoFlowId, DemoFlow, DemoStep, getDemoFlow } from '../data/demoFlows';

interface DemoFlowState {
  flowId: DemoFlowId;
  stepIndex: number;
}

interface DemoFlowContextValue {
  active: { flow: DemoFlow; step: DemoStep; stepIndex: number; total: number } | null;
  startFlow: (id: DemoFlowId) => void;
  next: () => DemoStep | null;     // returns the next step (or null if done)
  goToStep: (index: number) => void;
  exit: () => void;
}

const DemoFlowContext = createContext<DemoFlowContextValue | null>(null);

const STORAGE_KEY = 'ekko.demoFlow';

function readInitial(): DemoFlowState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.flowId === 'string' &&
      typeof parsed.stepIndex === 'number' &&
      getDemoFlow(parsed.flowId)
    ) {
      return parsed as DemoFlowState;
    }
  } catch {}
  return null;
}

export function DemoFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoFlowState | null>(readInitial);

  useEffect(() => {
    try {
      if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [state]);

  const startFlow = useCallback((id: DemoFlowId) => {
    const flow = getDemoFlow(id);
    if (!flow) return;
    setState({ flowId: id, stepIndex: 0 });
  }, []);

  const next = useCallback((): DemoStep | null => {
    let nextStep: DemoStep | null = null;
    setState((prev) => {
      if (!prev) return prev;
      const flow = getDemoFlow(prev.flowId);
      if (!flow) return null;
      const newIdx = prev.stepIndex + 1;
      if (newIdx >= flow.steps.length) {
        // Reached the end — clear the flow.
        nextStep = null;
        return null;
      }
      nextStep = flow.steps[newIdx];
      return { ...prev, stepIndex: newIdx };
    });
    return nextStep;
  }, []);

  const goToStep = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return prev;
      const flow = getDemoFlow(prev.flowId);
      if (!flow) return prev;
      const clamped = Math.max(0, Math.min(flow.steps.length - 1, index));
      return { ...prev, stepIndex: clamped };
    });
  }, []);

  const exit = useCallback(() => setState(null), []);

  let active: DemoFlowContextValue['active'] = null;
  if (state) {
    const flow = getDemoFlow(state.flowId);
    if (flow) {
      active = {
        flow,
        step: flow.steps[state.stepIndex],
        stepIndex: state.stepIndex,
        total: flow.steps.length,
      };
    }
  }

  return (
    <DemoFlowContext.Provider value={{ active, startFlow, next, goToStep, exit }}>
      {children}
    </DemoFlowContext.Provider>
  );
}

export function useDemoFlow(): DemoFlowContextValue {
  const ctx = useContext(DemoFlowContext);
  if (!ctx) throw new Error('useDemoFlow must be used inside <DemoFlowProvider>');
  return ctx;
}
