import { useState } from 'react';
import type { RegionState } from '../types/game.ts';

const POS: Record<string, { x: number; y: number }> = {
  na: { x: 18, y: 32 },
  latam: { x: 26, y: 68 },
  eu: { x: 50, y: 30 },
  ru: { x: 68, y: 24 },
  cn: { x: 78, y: 38 },
  in: { x: 70, y: 50 },
  me: { x: 58, y: 44 },
  af: { x: 52, y: 62 },
  ea: { x: 86, y: 36 },
  sea: { x: 82, y: 56 },
  oc: { x: 90, y: 76 },
};

function tone(region: RegionState): string {
  if (region.influence >= 40) return 'managed';
  if (region.dependency >= 25) return 'dependent';
  if (region.aiAdoption >= 20) return 'adopted';
  return 'low';
}

interface Props {
  regions: RegionState[];
}

export function WorldMap({ regions }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = regions.find((region) => region.id === openId) ?? null;

  return (
    <section className="map" aria-label="World influence">
      <p className="eyebrow">World</p>
      <p className="map-key">Grey is quiet. Gold is in use. Orange needs you. Red is yours.</p>
      <div className="map-field">
        {regions.map((region) => {
          const pos = POS[region.id];
          if (!pos) return null;
          return (
            <button
              key={region.id}
              type="button"
              className={`dot ${tone(region)} ${openId === region.id ? 'lit' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${region.name}. Your hold ${Math.round(region.influence)}`}
              onClick={() => setOpenId(region.id === openId ? null : region.id)}
            >
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>
      {open ? (
        <p className="lede">
          {open.name}. Trust {Math.round(open.trust)}. Need {Math.round(open.dependency)}. Your hold{' '}
          {Math.round(open.influence)}.
        </p>
      ) : (
        <p className="muted">Tap a point to see a place.</p>
      )}
    </section>
  );
}
