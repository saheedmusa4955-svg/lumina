import { useState } from 'react';
import { CURRENCY_PAIRS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function CurrencyFeed() {
  const [toggled, setToggled] = useState<Set<number>>(new Set());

  const togglePair = (index: number) => {
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const allPairs = [...CURRENCY_PAIRS, ...CURRENCY_PAIRS];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-lumina-surface/95 backdrop-blur-md border-t border-lumina-border h-12 overflow-hidden">
      <div className="flex items-center h-full">
        <div className="shrink-0 px-4 text-[11px] text-lumina-text-tertiary border-r border-lumina-border hidden sm:block">
          Live rates
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-scroll whitespace-nowrap">
            {allPairs.map((pair, i) => {
              const originalIndex = i % CURRENCY_PAIRS.length;
              const isToggled = toggled.has(originalIndex);
              const displayFrom = isToggled ? pair.to : pair.from;
              const displayTo = isToggled ? pair.from : pair.to;
              const displayRate = isToggled ? (1 / pair.rate) : pair.rate;

              return (
                <button
                  key={`${originalIndex}-${i}`}
                  onClick={() => togglePair(originalIndex)}
                  className="inline-flex items-center gap-2 px-5 h-12 text-[13px] hover:bg-lumina-surface-light transition-colors shrink-0"
                >
                  <span className="text-lumina-text-secondary font-medium">
                    {displayFrom}/{displayTo}
                  </span>
                  <span className="text-white tabular-nums font-medium">
                    {displayRate.toFixed(4)}
                  </span>
                  <span
                    className={cn(
                      'text-[11px] tabular-nums',
                      pair.change >= 0 ? 'text-lumina-accent' : 'text-lumina-danger'
                    )}
                  >
                    {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
