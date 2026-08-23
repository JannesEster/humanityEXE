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
  return (
    <section className="map" aria-label="World influence">
      <p className="eyebrow">WORLD</p>
      <div className="map-field">
        {regions.map((region) => {
          const pos = POS[region.id];
          if (!pos) return null;
          return (
            <button
              key={region.id}
              type="button"
              className={`dot ${tone(region)}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${region.name} · influence ${Math.round(region.influence)}`}
            >
              <span>{region.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
