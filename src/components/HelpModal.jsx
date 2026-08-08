import React, { useState } from 'react';

const rules = [
  {
    num: '1',
    title: 'MVP & Top Donor priority',
    desc: 'On other days, if the week\'s MVP and top Donor haven\'t been picked yet in this session, they get first priority — for example, MVP as Conductor, top Donor as VIP. Use Manual Entry to set these with a note (e.g. "MVP"). Designated days - Monday, Tuesday',
  },
  {
    num: '2',
    title: 'R4+ days (2 days per week)',
    desc: 'Two days every week are designated R4+ days. On those days, the next R4 or R5 member in the rotation queue is selected as Conductor. They cycle to the back of the queue after each pick, ensuring fair rotation. Designated days - Wednesday and Thursday.',
  },
  {
    num: '3',
    title: 'Random selection',
    desc: 'If there\'s no MVP/Donor to prioritize, Conductor and VIP are picked randomly from their respective bags.',
  },
  {
    num: '4',
    title: 'Balancing bags',
    desc: 'If one bag runs low on people, an admin can move roughly half the members from the other bag using Manage Bags. Each person has a home bag, and Swap will return them there.',
  },
  {
    num: '5',
    title: 'End of session — Swap Lists',
    desc: 'After the session ends, use Swap Lists to rotate the bags. Everyone in the Conductor bag moves to VIP and vice versa, so members alternate roles across sessions. The full pick history persists between sessions.',
  },
];

const sections = [
  {
    title: 'Picking',
    items: [
      {
        label: 'Pick R4',
        desc: 'Selects the next R4/R5 member in the rotation queue as Conductor. The picked person moves to the back of the queue so everyone rotates fairly.',
      },
      {
        label: 'Pick Conductor',
        desc: 'Randomly picks someone from the Conductor bag (standard members only). R4/R5 members are never drawn here.',
      },
      {
        label: 'Pick VIP',
        desc: 'Randomly picks someone from the VIP bag (standard members only, excluding whoever was already selected as Conductor).',
      },
      {
        label: 'Manual Entry',
        desc: 'Set a specific person as Conductor or VIP manually — useful for VS winners or other special cases. You can add a note explaining why.',
      },
    ],
  },
  {
    title: 'Current Pick',
    items: [
      {
        label: 'Mark as Used',
        desc: 'Confirms the current Conductor + VIP pair. Both are moved to the Used bag (R4/R5 Conductors skip Used and stay in their queue). The pick is recorded in the history log.',
      },
      {
        label: 'Note field',
        desc: 'Optional note attached to the log entry when marking as used. If left blank it defaults to "R4 selected" or "Random selection" based on who was picked.',
      },
    ],
  },
  {
    title: 'People Management (Admin)',
    items: [
      {
        label: 'Add Person',
        desc: 'Adds a new member. You choose their starting bag (Conductor/VIP) and rank (Standard/R4/R5).',
      },
      {
        label: 'Manage Rank',
        desc: 'Promote or demote a member. Standard members can be promoted to R4 or R5 — they leave the bags and join the R4/R5 queue. R4/R5 members can be demoted back to Standard, choosing which bag they return to. Only one R5 is allowed at a time.',
      },
      {
        label: 'Manage Bags',
        desc: 'Move a standard member between Conductor, VIP, Used, or Inactive bags. For R4/R5 members, the only options are Active (in queue) or Inactive.',
      },
    ],
  },
  {
    title: 'Session End (Admin)',
    items: [
      {
        label: 'Swap Lists',
        desc: 'Swaps everyone between Conductor and VIP — people in Conductor move to VIP and vice versa. Used and Inactive members are not affected. This also resets anyone in Used back to their new home. Do this at the end of each session so the lists alternate.',
      },
    ],
  },
  {
    title: 'General',
    items: [
      {
        label: 'Undo',
        desc: 'Reverts the last action. Only one level of undo is available — doing anything new will clear the previous snapshot.',
      },
      {
        label: 'R4/R5 Queue',
        desc: 'Shows all R4/R5 members in their current rotation order. Admins can reorder the queue using the arrows. Inactive members are shown at the bottom and are skipped when picking.',
      },
      {
        label: 'Bags Grid',
        desc: 'Shows standard members grouped into Conductor, VIP, Used, and Inactive columns. Highlighted names are whoever is in the current pick.',
      },
      {
        label: 'Pick History',
        desc: 'Log of all confirmed picks (Mark as Used), newest first.',
      },
      {
        label: 'Activity Log',
        desc: 'Audit trail of all admin actions — rank changes, bag moves, person additions, swaps, etc.',
      },
    ],
  },
];

export default function HelpModal({ onClose }) {
  const [open, setOpen] = useState(sections.map(() => true));

  function toggle(i) {
    setOpen(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-800">How to use</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">General Rules</p>
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.num} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                    {rule.num}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{rule.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-b border-gray-100" />
          </div>

          {sections.map((section, i) => (
            <div key={section.title}>
              <button
                className="w-full flex items-center justify-between text-left mb-2"
                onClick={() => toggle(i)}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">{section.title}</span>
                <span className="text-gray-400 text-sm">{open[i] ? '▲' : '▼'}</span>
              </button>
              {open[i] && (
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.label}>
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
              {i < sections.length - 1 && <div className="mt-4 border-b border-gray-100" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
