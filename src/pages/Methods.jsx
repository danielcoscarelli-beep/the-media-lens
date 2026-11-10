import { LIMITATIONS } from '../lib/reputation.js';
import { CLAIM_STATUS } from '../data/claims.js';
import { USE_CLASS } from '../components/SourceParts.jsx';
import { Link } from '../state/router.jsx';

export default function Methods() {
  return (
    <div className="page methods">
      <header className="page-head narrow">
        <div className="kicker">Methods &amp; limitations</div>
        <h1 className="page-title">How The Media Lens works</h1>
        <p className="page-sub">This prototype is built to show readers its reasoning. This page explains what each score means and what it can’t tell you.</p>
      </header>
      <article className="prose">
        <h2>About the sample content</h2>
        <p>Every headline, article, source document, claim and community rating in this prototype is <strong>hypothetical</strong>. Real publication names show how a comparison would work in practice. None of these stories were published by those organizations, and links go only to each organization’s homepage. Nothing here has been independently fact-checked.</p>

        <h2>Three separate questions</h2>
        <p>The platform keeps three dimensions apart because they often get mixed up:</p>
        <ul>
          <li><strong>Factual basis:</strong> can each claim be traced to evidence, and has anyone corroborated it independently?</li>
          <li><strong>Framing:</strong> which words, emphasis and perspectives shape the reader’s impression? This is where community bias ratings apply.</li>
          <li><strong>Opinion vs. reporting:</strong> is the piece labeled as analysis or opinion, and does unlabeled news use evaluative language?</li>
        </ul>

        <h2>Why we rate headlines, not outlets</h2>
        <p>Ratings attach to individual headlines. Publication-level views show the spread of article ratings and never a single label, so a single story can’t be judged by the outlet’s reputation. The same outlet can be careful on one story and loaded on another.</p>

        <h2>Sourcing statuses</h2>
        <ul>{Object.values(CLAIM_STATUS).map((s) => <li key={s.label}><strong>{s.label}:</strong> {s.help}</li>)}</ul>
        <p>These statuses describe the sourcing available, not whether a claim is true. When five outlets repeat a figure from one press release, that is one source, not five.</p>

        <h2>Source classifications</h2>
        <ul>{Object.values(USE_CLASS).map((s) => <li key={s.label}><strong>{s.label}:</strong> {s.help}</li>)}</ul>

        <h2>The reputation model (simulated)</h2>
        <p>Credibility combines four measures: reasoning quality (40%), consistency (25%), framing detection (20%) and constructive participation (15%). <strong>Agreement with the majority has zero weight.</strong> A reader who disagrees with the crowd and explains why carefully can reach the highest level.</p>
        <h3>Known limitations</h3>
        <ol>{LIMITATIONS.map((l) => <li key={l}>{l}</li>)}</ol>

        <h2>Demographic data</h2>
        <p>Demographic fields are optional and private. They are used only when a reader opts in, and only in aggregate groups of 50 or more people. They never affect credibility, and the platform never treats demographics as a predictor of a reader’s beliefs or judgment.</p>

        <h2>Toward production</h2>
        <p>All data access goes through one service module. A real deployment would replace it with a news API for articles, a database for evaluations and sources, an authentication provider for profiles, and human editorial review of source and claim annotations.</p>
        <p><Link to="compare" param="permitting-act">Open the featured comparison</Link></p>
      </article>
    </div>
  );
}
