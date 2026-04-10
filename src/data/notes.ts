// Phase 4: lightweight internal note model. Notes attach to a donor, policy,
// or peer; they're how the team passes context to one another inside the
// product instead of in email threads.

export type NoteEntityType = 'donor' | 'policy' | 'peer';

export interface InternalNote {
  id: string;
  authorId: string;
  entity: { type: NoteEntityType; id: string };
  content: string;
  createdAt: string;
  visibility: 'team' | 'private';
}

export const internalNotes: InternalNote[] = [
  // Donor notes
  {
    id: 'note-maya-1',
    authorId: 'leah-kim',
    entity: { type: 'donor', id: 'maya-patel' },
    content: 'Maya asked at the breakfast for a deeper read on Right-to-Counsel. Tee up a one-pager from Noah and pair it with a personal note from Ana.',
    createdAt: '2026-04-05T11:20:00',
    visibility: 'team',
  },
  {
    id: 'note-maya-2',
    authorId: 'noah-stein',
    entity: { type: 'donor', id: 'maya-patel' },
    content: 'Reminder: she sits on a community board in Crown Heights. Avoid framing that downplays neighborhood-level impact.',
    createdAt: '2026-03-18T15:02:00',
    visibility: 'team',
  },
  {
    id: 'note-jordan-1',
    authorId: 'leah-kim',
    entity: { type: 'donor', id: 'jordan-rivera' },
    content: 'Tried twice on email — no opens. Next try: SMS with a single-line story link, not another newsletter.',
    createdAt: '2026-04-02T09:14:00',
    visibility: 'team',
  },
  {
    id: 'note-priya-1',
    authorId: 'noah-stein',
    entity: { type: 'donor', id: 'priya-narang' },
    content: 'Priya wants peer benchmarks before the renewal meeting. Pull from the housing finance cohort, not the general one.',
    createdAt: '2026-04-04T13:40:00',
    visibility: 'team',
  },
  {
    id: 'note-daniel-1',
    authorId: 'leah-kim',
    entity: { type: 'donor', id: 'daniel-cho' },
    content: 'Outcome-driven. He has not engaged in 14 months but kept opening emails through Q1 — soft signal we can re-warm.',
    createdAt: '2026-03-29T10:05:00',
    visibility: 'team',
  },

  // Policy notes
  {
    id: 'note-rtc-1',
    authorId: 'ana-rodriguez',
    entity: { type: 'policy', id: 'right-to-counsel' },
    content: 'Coordinating with advocacy team for testimony prep. Need draft talking points by April 18.',
    createdAt: '2026-04-08T08:45:00',
    visibility: 'team',
  },
  {
    id: 'note-rtc-2',
    authorId: 'leah-kim',
    entity: { type: 'policy', id: 'right-to-counsel' },
    content: 'Maya Patel and Samir Gupta are both highly engaged on tenant rights — good audience for a tailored update once we have a position.',
    createdAt: '2026-04-05T17:21:00',
    visibility: 'team',
  },
  {
    id: 'note-rar-1',
    authorId: 'marcus-bell',
    entity: { type: 'policy', id: 'rental-assistance-reporting' },
    content: 'Audit kicked off. Finance has a draft of the new reporting template — sharing in the team channel by Friday.',
    createdAt: '2026-04-07T16:00:00',
    visibility: 'team',
  },
  {
    id: 'note-aef-1',
    authorId: 'tessa-moore',
    entity: { type: 'policy', id: 'anti-eviction-funding' },
    content: 'Outreach plan in motion across Crown Heights and Jamaica. Need flyers translated to Spanish and Bengali by April 14.',
    createdAt: '2026-04-09T12:10:00',
    visibility: 'team',
  },

  // Peer notes
  {
    id: 'note-bronx-1',
    authorId: 'leah-kim',
    entity: { type: 'peer', id: 'bronx-housing' },
    content: 'Their emergency aid creative is the best I have seen this year. Worth a 30-minute teardown with the comms team.',
    createdAt: '2026-04-07T14:25:00',
    visibility: 'team',
  },
  {
    id: 'note-harbor-1',
    authorId: 'noah-stein',
    entity: { type: 'peer', id: 'harbor-family' },
    content: 'Harbor is shifting toward direct-mail-heavy back-to-school campaigns. Different mix from us — useful counterpoint for the board.',
    createdAt: '2026-04-03T10:30:00',
    visibility: 'team',
  },
];

export function notesForEntity(type: NoteEntityType, id: string): InternalNote[] {
  return internalNotes
    .filter((n) => n.entity.type === type && n.entity.id === id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
