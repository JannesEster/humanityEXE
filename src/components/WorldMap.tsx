import { useState, type KeyboardEvent } from 'react';
import type { RegionState } from '../types/game.ts';

const LANDS: { id: string; label: string; lx: number; ly: number; paths: string[] }[] = [
  { id: 'na', label: 'NA', lx: 200, ly: 108, paths: [
    'M42 82 36 70 58 56 95 48 145 46 200 44 255 50 295 62 325 88 338 112 328 128 308 132 288 138 275 155 278 175 270 192 262 178 240 172 222 180 228 198 248 208 232 214 208 202 188 188 178 168 162 148 152 122 148 108 128 98 95 90 68 88Z',
    'M368 44 398 36 420 56 410 92 378 100 358 74Z',
  ]},
  { id: 'latam', label: 'LATAM', lx: 328, ly: 300, paths: [
    'M232 214 248 210 260 218 275 226 292 220 318 226 348 248 378 258 408 268 406 290 392 318 368 342 340 358 322 385 310 412 298 400 292 360 288 320 282 285 276 255 268 238 252 228 238 220Z',
  ]},
  { id: 'eu', label: 'EU', lx: 528, ly: 112, paths: [
    'M472 145 488 152 508 140 522 130 528 136 536 146 546 144 558 146 572 136 578 118 568 102 552 96 535 100 515 110 495 120 478 132Z',
    'M525 95 532 70 548 52 568 55 575 78 562 95 545 100Z',
    'M484 80 502 74 510 90 504 108 490 104Z',
    'M472 92 482 90 480 106 470 104Z',
    'M438 64 458 62 460 78 440 80Z',
  ]},
  { id: 'ru', label: 'RU', lx: 760, ly: 78, paths: [
    'M582 88 595 55 650 42 720 38 755 28 790 38 880 46 960 58 978 70 968 88 940 108 952 128 928 112 880 105 830 114 800 116 770 124 720 140 680 142 640 132 605 115 586 100Z',
  ]},
  { id: 'cn', label: 'CN', lx: 790, ly: 152, paths: [
    'M722 148 748 126 800 118 848 124 856 142 842 162 828 182 800 190 770 180 742 162Z',
  ]},
  { id: 'in', label: 'IN', lx: 718, ly: 188, paths: [
    'M690 182 700 158 728 156 750 172 748 192 728 210 716 232 704 205 692 190Z',
    'M714 236 726 238 724 250 714 246Z',
  ]},
  { id: 'me', label: 'ME', lx: 622, ly: 172, paths: [
    'M578 140 608 132 630 140 652 148 670 155 662 172 648 180 662 198 642 220 618 200 600 178 590 158 580 148Z',
  ]},
  { id: 'af', label: 'AF', lx: 532, ly: 242, paths: [
    'M478 165 488 150 512 147 538 148 562 154 588 162 596 178 604 210 622 222 658 232 646 248 618 258 598 268 588 305 570 338 548 358 532 348 524 318 520 285 522 258 540 248 518 240 492 242 468 238 448 212 452 188 468 172Z',
    'M618 292 636 298 632 338 616 332Z',
  ]},
  { id: 'ea', label: 'EA', lx: 886, ly: 146, paths: [
    'M848 130 860 136 858 158 850 162 846 148Z',
    'M888 124 905 128 910 142 898 162 878 168 868 155 876 140Z',
    'M842 178 850 182 848 194 840 190Z',
  ]},
  { id: 'sea', label: 'SEA', lx: 818, ly: 232, paths: [
    'M768 200 798 194 812 210 800 232 785 245 772 228 762 210Z',
    'M778 248 792 250 788 272 768 265 762 245Z',
    'M786 276 830 278 828 286 786 284Z',
    'M808 248 838 252 834 272 808 268Z',
    'M840 205 858 210 854 238 838 230Z',
    'M878 258 920 262 918 276 880 272Z',
  ]},
  { id: 'oc', label: 'OC', lx: 872, ly: 326, paths: [
    'M850 295 875 286 892 282 908 298 928 328 922 350 895 360 855 352 825 340 818 322 828 302Z',
    'M898 366 912 370 908 382 896 378Z',
    'M968 348 982 352 978 370 964 365Z',
    'M954 372 972 378 962 400 946 392Z',
  ]},
];

function tone(region: RegionState): string {
  if (region.influence >= 40) return 'managed';
  if (region.dependency >= 25) return 'dependent';
  if (region.aiAdoption >= 20) return 'adopted';
  return 'low';
}

export function WorldMap({ regions }: { regions: RegionState[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = regions.find((region) => region.id === openId) ?? null;

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  function onKey(event: KeyboardEvent<SVGGElement>, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(id);
    }
  }

  return (
    <section className="map" aria-label="World influence">
      <style>{`
        .map .map-field { background:#071525; line-height:0; }
        .map .world-map { display:block; width:100%; height:auto; }
        .map .graticule { fill:none; stroke:#1a3358; stroke-width:0.7; opacity:0.45; }
        .map .land { cursor:pointer; fill:#4a5564; stroke:#081018; stroke-width:1.2; stroke-linejoin:round; }
        .map .land:hover { stroke:#c5d4e8; }
        .map .land:focus { outline:none; }
        .map .land:focus-visible { stroke:#f0ebe0; stroke-width:2; }
        .map .adopted { fill:#2ad4e0; }
        .map .dependent { fill:#e8a03a; }
        .map .managed { fill:#ef4b2a; }
        .map .lit { stroke:#f0ebe0; stroke-width:2; }
        .map .land-label { fill:#f2efe6; stroke:#071525; stroke-width:3.5; paint-order:stroke; font-size:15px; font-weight:650; letter-spacing:0.14em; pointer-events:none; text-anchor:middle; }
      `}</style>
      <p className="eyebrow">World</p>
      <p className="map-key">Cyan = in use. Amber = they need you. Red = you hold it.</p>
      <div className="map-field">
        <svg className="world-map" viewBox="0 0 1000 500">
          <defs>
            <filter id="land-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="g" />
              <feMerge>
                <feMergeNode in="g" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="1000" height="500" fill="#071525" />
          <g className="graticule" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={(i + 1) * 100} y1={0} x2={(i + 1) * 100} y2={500} />
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={(i + 1) * 100} x2={1000} y2={(i + 1) * 100} />
            ))}
          </g>
          {LANDS.map((land) => {
            const region = regions.find((item) => item.id === land.id);
            if (!region) return null;
            const lit = openId === land.id;
            const kind = tone(region);
            return (
              <g
                key={land.id}
                className={`land ${kind}${lit ? ' lit' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={region.name}
                aria-pressed={lit}
                filter={kind === 'managed' || lit ? 'url(#land-glow)' : undefined}
                onClick={() => toggle(land.id)}
                onKeyDown={(event) => onKey(event, land.id)}
              >
                <title>{region.name}</title>
                {land.paths.map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </g>
            );
          })}
          <g className="land-label" aria-hidden="true">
            {LANDS.map((land) => (
              <text key={land.id} x={land.lx} y={land.ly}>
                {land.label}
              </text>
            ))}
          </g>
        </svg>
      </div>
      {open ? (
        <p className="lede">
          {open.name}. Trust {Math.round(open.trust)}. Dependency {Math.round(open.dependency)}. Influence{' '}
          {Math.round(open.influence)}.
        </p>
      ) : (
        <p className="muted">Select a region to see a place.</p>
      )}
    </section>
  );
}
