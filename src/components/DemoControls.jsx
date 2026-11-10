// PROTOTYPE-ONLY controls for the simulated timeline. Not part of the real product.
import { useState } from 'react';
import { HOUR } from '../lib/clock.js';
import { fmtDateTime, fmtDuration } from '../lib/format.js';
import { useStore } from '../state/store.jsx';
import { useTick } from './Status.jsx';

export default function DemoControls() {
  const { demo, toast } = useStore();
  const t = useTick();
  const [confirm, setConfirm] = useState(false);
  const jump = (h) => { demo.advance(h * HOUR); toast(`Demo clock moved forward ${h} hour${h === 1 ? '' : 's'}`); };
  return (
    <section className="demo" aria-label="Prototype demo controls">
      <div className="kicker">Prototype demo controls</div>
      <p className="small">Rating windows last 24 real hours. These controls move this prototype’s clock forward so you can see windows close, ranks form and Browse Mode reset at midnight without waiting. They don’t exist in a real deployment.</p>
      <dl className="demo-kv small">
        <div><dt>App time</dt><dd className="tabular">{fmtDateTime(t)}</dd></div>
        <div><dt>Ahead of real time by</dt><dd className="tabular">{demo.offset ? fmtDuration(demo.offset, { seconds: false }) : 'nothing'}</dd></div>
        <div><dt>Timeline started</dt><dd className="tabular">{fmtDateTime(demo.epoch)}</dd></div>
      </dl>
      <div className="row-gap">
        <button className="btn btn-ghost btn-sm" onClick={() => jump(1)}>+1 hour</button>
        <button className="btn btn-ghost btn-sm" onClick={() => jump(6)}>+6 hours</button>
        <button className="btn btn-ghost btn-sm" onClick={() => jump(24)}>+24 hours</button>
        {confirm ? (
          <span className="row-gap"><span className="small">Restart the timeline and delete your ratings?</span>
            <button className="btn btn-sm btn-danger" onClick={() => { demo.restart(); setConfirm(false); toast('Timeline restarted'); }}>Restart</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirm(false)}>Cancel</button></span>
        ) : <button className="btn btn-ghost btn-sm" onClick={() => setConfirm(true)}>Restart timeline</button>}
      </div>
    </section>
  );
}
