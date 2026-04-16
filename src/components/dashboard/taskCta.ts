import { ActionItem } from '../../data/actions';

// Derive a short verb CTA label from a task. Prefers the first word of the
// existing `cta` string (which is already written as "Verb <rest>"), and
// falls back to an entity-category default when `cta` is missing.

const FALLBACK_BY_ENTITY: Record<string, string> = {
  donor: 'Reach out',
  policy: 'Review',
  peer: 'View',
  campaign: 'Open',
  alert: 'View',
  system: 'Open',
};

export function deriveTaskCta(task: ActionItem): string {
  if (task.cta && task.cta.trim().length > 0) {
    return task.cta.split(/\s+/)[0];
  }
  return FALLBACK_BY_ENTITY[task.entity?.type || 'system'] || 'Open';
}
