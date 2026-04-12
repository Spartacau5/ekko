import React, { createContext, useCallback, useContext, useState } from 'react';
import { ActionItem, ActionStatus, ActionPriority, ActionEntity, actions as seedActions } from '../data/actions';
import { Role } from '../data/team';

export interface NewActionPayload {
  title: string;
  context: string;
  ownerId: string;
  dueDate: string;
  priority: ActionPriority;
  entity?: ActionEntity;
}

interface ActionContextValue {
  actions: ActionItem[];
  updateStatus: (id: string, status: ActionStatus) => void;
  updateOwner: (id: string, ownerId: string) => void;
  addAction: (payload: NewActionPayload, createdBy: string, visibleTo: Role[]) => ActionItem;
}

const ActionContext = createContext<ActionContextValue | null>(null);

let nextId = 100;

export function ActionProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<ActionItem[]>(() => seedActions.slice());

  const updateStatus = useCallback((id: string, status: ActionStatus) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const updateOwner = useCallback((id: string, ownerId: string) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ownerId } : a)));
  }, []);

  const addAction = useCallback((payload: NewActionPayload, createdBy: string, visibleTo: Role[]): ActionItem => {
    const action: ActionItem = {
      id: `act-user-${nextId++}`,
      title: payload.title,
      context: payload.context,
      ownerId: payload.ownerId,
      dueDate: payload.dueDate,
      priority: payload.priority,
      status: 'open',
      source: 'Team member',
      cta: 'Open details',
      entity: payload.entity,
      visibleTo,
      createdBy,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setActions((prev) => [action, ...prev]);
    return action;
  }, []);

  return (
    <ActionContext.Provider value={{ actions, updateStatus, updateOwner, addAction }}>
      {children}
    </ActionContext.Provider>
  );
}

export function useActions() {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error('useActions must be used within ActionProvider');
  return ctx;
}
