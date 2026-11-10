// Generated editorial illustrations: sample articles carry no photography,
// so each gets a restrained line drawing keyed to its subject.
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

function Motif({ motif, h }) {
  const o = (h % 40) - 20;
  const L = { stroke: 'var(--img-ink)', strokeWidth: 1.4, fill: 'none' };
  const A = { stroke: 'var(--img-accent)', strokeWidth: 2, fill: 'none' };
  switch (motif) {
    case 'capitol':
      return <g>
        <path {...L} d="M120 150h160M130 150v-50M150 150v-50M170 150v-50M190 150v-50M210 150v-50M230 150v-50M250 150v-50M270 150v-50M125 100h150L200 78z" />
        <path {...A} d="M170 78a30 30 0 0160 0M200 48v-12" /><path {...L} d="M60 160h280" />
      </g>;
    case 'grid':
      return <g>
        {[90, 200, 310].map((x, i) => <path key={i} {...L} d={`M${x} 160l14-90 14 90M${x + 2} 100h24M${x + 4} 85h20M${x - 4} 125h36`} />)}
        <path {...A} d={`M104 78Q155 ${100 + o / 2} 214 78T324 78`} /><path {...A} d={`M100 92Q155 ${115 + o / 2} 210 92T320 92`} />
      </g>;
    case 'gavel':
      return <g>
        <path {...L} d="M200 50v100M140 150h120M150 70h100" />
        <path {...A} d="M150 70l-22 44h44zM250 70l-22 44h44z" /><path {...L} d="M128 114a22 8 0 0044 0M228 114a22 8 0 0044 0" />
      </g>;
    case 'turbine':
      return <g>
        {[120, 220, 300].map((x, i) => <g key={i}><path {...L} d={`M${x} 160V${80 + i * 8}`} /><path {...(i === 1 ? A : L)} d={`M${x} ${80 + i * 8}l-4-38M${x} ${80 + i * 8}l34 20M${x} ${80 + i * 8}l-32 18`} /></g>)}
        <path {...L} d="M60 160h280" />
      </g>;
    case 'pipeline':
      return <g>
        <path {...L} d="M40 120h320M40 136h320" /><path {...A} d="M40 128h320" strokeDasharray="2 10" />
        {[90, 170, 250, 330].map((x) => <path key={x} {...L} d={`M${x} 112v32M${x - 6} 112v32`} />)}
        <path {...L} d="M60 100l20-30h40l20 30" />
      </g>;
    case 'river':
      return <g>
        {[0, 1, 2, 3].map((i) => <path key={i} {...(i === 1 ? A : L)} d={`M40 ${80 + i * 22}C120 ${60 + i * 22 + o / 3} 180 ${110 + i * 22} 260 ${80 + i * 22}S360 ${70 + i * 22} 380 ${86 + i * 22}`} />)}
      </g>;
    case 'chart':
      return <g>
        <path {...L} d="M70 40v120h270" />
        {[70, 100, 130].map((y) => <path key={y} stroke="var(--img-ink)" strokeOpacity=".25" d={`M70 ${y}h270`} />)}
        <path {...A} d={`M70 ${130 + o / 4}L120 120L170 95L220 100L270 80L330 ${78 + o / 5}`} /><circle cx="330" cy={78 + o / 5} r="4" fill="var(--img-accent)" />
      </g>;
    case 'globe':
      return <g>
        <circle {...L} cx="200" cy="100" r="62" /><ellipse {...L} cx="200" cy="100" rx="26" ry="62" /><path {...L} d="M138 100h124M146 70h108M146 130h108" />
        <path {...A} d="M120 48c40-20 120-20 160 0" /><circle cx="280" cy="48" r="4" fill="var(--img-accent)" />
      </g>;
    case 'chip':
      return <g>
        <rect {...L} x="150" y="50" width="100" height="100" /><rect {...A} x="175" y="75" width="50" height="50" />
        {[60, 80, 100, 120, 140].map((v) => <path key={v} {...L} d={`M150 ${v}h-20M250 ${v}h20M${v + 100} 50v-20M${v + 100} 150v20`} />)}
      </g>;
    case 'map':
      return <g>
        <path {...L} d="M80 60l70-10 60 20 80-14 30 60-40 50-90-6-70 20-40-60z" />
        <path {...L} d="M150 50l10 70 50-50M160 120l-60-10M160 120l20 50M210 70l60 60" />
        <path {...A} d="M210 70l80-14 30 60-50 14z" />
      </g>;
    case 'water':
      return <g>
        <path {...A} d="M200 40c-26 36-40 56-40 76a40 40 0 0080 0c0-20-14-40-40-76z" />
        {[0, 1, 2].map((i) => <path key={i} {...L} d={`M50 ${150 + i * 10}q25-8 50 0t50 0t50 0t50 0t50 0t50 0`} />)}
      </g>;
    case 'sea':
      return <g>
        {[0, 1, 2].map((i) => <path key={i} {...L} d={`M30 ${70 + i * 16}q20-8 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0`} />)}
        <path {...A} d={`M30 150C120 ${140 + o / 2} 260 160 370 146`} /><circle cx="200" cy="152" r="4" fill="var(--img-accent)" />
      </g>;
    default:
      return <path {...L} d="M60 100h280" />;
  }
}

export default function ArticleImage({ motif, seed = '', label }) {
  const h = hash(seed + motif);
  return (
    <div className="art-img" role="img" aria-label={label || `Illustration: ${motif}`}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="200" fill="var(--img-bg)" />
        <g opacity=".18">{Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${i * 50} 0v200`} stroke="var(--img-ink)" strokeWidth=".5" />)}</g>
        <Motif motif={motif} h={h} />
      </svg>
    </div>
  );
}
