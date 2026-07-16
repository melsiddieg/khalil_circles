import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Circle } from '../../types';
import { rotationReading } from '../../data/rotations';
import { polar, expandUnits, unitColor } from './geometry';
import { useLanguage } from '../../i18n/LanguageContext';

const R = 92;

/** One percussive hit: dum (low, round) for unit starts, tak (high, dry) otherwise. */
const hit = (ctx: AudioContext, time: number, isDum: boolean) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  if (isDum) {
    osc.frequency.setValueAtTime(165, time);
    osc.frequency.exponentialRampToValueAtTime(55, time + 0.12);
    gain.gain.setValueAtTime(0.55, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.17);
    osc.start(time);
    osc.stop(time + 0.19);
  } else {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
    osc.start(time);
    osc.stop(time + 0.07);
  }
};

const RhythmClock: React.FC<{ circle: Circle }> = ({ circle }) => {
  const { t, lang } = useLanguage();
  const seq = circle.atomicSequence;
  const letters = useMemo(() => expandUnits(seq), [seq]);
  const L = letters.length;

  const [playing, setPlaying] = useState(false);
  const [tempo, setTempo] = useState(170); // ms per prosodic letter
  const [cutUnit, setCutUnit] = useState(0);
  const [pos, setPos] = useState(-1); // currently sounding letter, -1 when silent

  const ctxRef = useRef<AudioContext | null>(null);
  const tempoRef = useRef(170);

  const cutLetter = useMemo(
    () => letters.findIndex((l) => l.unitIndex === cutUnit && l.unitInitial),
    [letters, cutUnit]
  );
  const reading = useMemo(() => rotationReading(circle, cutUnit), [circle, cutUnit]);
  const readingName =
    (lang === 'ar' ? reading.nameAr : reading.nameEn) ??
    (lang === 'ar' ? 'دورة مهملة' : 'a neglected rotation');

  // Lookahead scheduler + playhead loop, alive while playing.
  useEffect(() => {
    if (!playing) return;
    type Win = typeof window & { webkitAudioContext?: typeof AudioContext };
    const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext!;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    void ctx.resume();

    let letterIdx = 0;
    let nextTime = ctx.currentTime + 0.1;
    const queue: { time: number; idx: number }[] = [];

    const scheduler = setInterval(() => {
      while (nextTime < ctx.currentTime + 0.18) {
        const l = letters[letterIdx % L];
        if (l.sym === '1') hit(ctx, nextTime, l.unitInitial);
        queue.push({ time: nextTime, idx: letterIdx % L });
        nextTime += tempoRef.current / 1000;
        letterIdx += 1;
      }
    }, 30);

    let raf = 0;
    const loop = () => {
      while (queue.length > 1 && queue[1].time <= ctx.currentTime) queue.shift();
      if (queue.length && queue[0].time <= ctx.currentTime) setPos(queue[0].idx);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      clearInterval(scheduler);
      cancelAnimationFrame(raf);
      void ctx.suspend();
      setPos(-1);
    };
  }, [playing, letters, L]);

  // Release the audio context for good on unmount
  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    []
  );

  const handAngle = pos >= 0 ? -90 - (pos * 360) / L : -90 - (cutLetter * 360) / L;

  return (
    <div>
      {/* Transport */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={playing}
          className="px-5 py-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900
                     font-bold font-amiri text-sm hover:shadow-amber-500/40 hover:shadow-lg active:scale-95 transition-all"
        >
          {playing ? t.explore.clockStop : t.explore.clockPlay}
        </button>
        <label className="flex items-center gap-2">
          <span className="text-xs label-gold font-amiri">{t.explore.clockTempo}</span>
          <input
            type="range"
            min={110}
            max={260}
            step={10}
            value={370 - tempo}
            onChange={(e) => {
              const ms = 370 - Number(e.target.value);
              setTempo(ms);
              tempoRef.current = ms;
            }}
            dir="ltr"
            className="accent-amber-400 cursor-pointer w-36"
          />
        </label>
      </div>
      <p className="text-center text-xs text-gray-500 font-amiri mb-2">{t.explore.clockCutHint}</p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* The clock face: prosodic letters around the ring */}
        <svg
          viewBox="-120 -120 240 240"
          className="w-72 h-72 shrink-0"
          role="img"
          aria-label={t.explore.clockTitle}
        >
          <circle
            r={R}
            fill="none"
            stroke="var(--gold-hairline-soft, rgba(212,176,106,0.16))"
            strokeWidth="1"
          />

          {/* hand */}
          <g
            style={{
              transform: `rotate(${handAngle + 90}deg)`,
              transition: 'transform 120ms linear',
            }}
          >
            <line
              x1="0"
              y1="6"
              x2="0"
              y2={-R + 14}
              stroke="var(--gold-bright, #E9C87E)"
              strokeWidth="1.6"
            />
            <circle r="3.5" fill="var(--gold-bright, #E9C87E)" />
          </g>

          {letters.map((l, i) => {
            const { x, y } = polar(i, L, R);
            const color = unitColor(seq[l.unitIndex], circle);
            const active = pos === i;
            const isCut = i === cutLetter;
            return (
              <g
                key={i}
                onClick={() => setCutUnit(l.unitIndex)}
                className="cursor-pointer"
                aria-label={`letter ${i}`}
              >
                {l.sym === '1' ? (
                  <circle
                    cx={x}
                    cy={y}
                    r={l.unitInitial ? 7 : 5}
                    fill={color}
                    stroke={
                      active
                        ? '#ffffff'
                        : isCut
                          ? 'var(--gold-bright, #E9C87E)'
                          : 'rgba(13,18,32,0.9)'
                    }
                    strokeWidth={active || isCut ? 2.5 : 1.5}
                    style={active ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
                  />
                ) : (
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="none"
                    stroke={active ? '#ffffff' : 'rgba(139,147,167,0.6)'}
                    strokeWidth={active ? 2 : 1.2}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* The same time, laid flat: letters from the cut */}
        <div className="w-full max-w-sm">
          <p className="text-center font-amiri text-sm mb-2">
            <span className="text-gray-500">{t.explore.unrollResultLabel}</span>
            <span
              className="font-bold"
              style={{
                color: reading.kind === 'meter' ? circle.visualTheme.primaryColor : '#9CA3AF',
              }}
            >
              {readingName}
            </span>
          </p>
          <div className="overflow-x-auto">
            <div className="flex gap-1 justify-center min-w-max px-2" dir="rtl">
              {letters.map((_, j) => {
                const idx = (cutLetter + j) % L;
                const l = letters[idx];
                const color = unitColor(seq[l.unitIndex], circle);
                const active = pos === idx;
                return (
                  <span
                    key={j}
                    className="w-4 h-8 rounded-sm flex items-center justify-center transition-colors duration-100"
                    style={{
                      backgroundColor: active ? `${color}44` : 'rgba(13,18,32,0.6)',
                      border: `1px solid ${active ? color : 'var(--gold-hairline-soft, rgba(212,176,106,0.16))'}`,
                    }}
                  >
                    <span
                      className="text-[10px] font-mono font-bold"
                      style={{ color: l.sym === '1' ? color : '#6b7280' }}
                    >
                      {l.sym === '1' ? '●' : '·'}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
          {/* legend */}
          <div className="flex justify-center gap-5 text-xs text-gray-500 font-amiri mt-3">
            <span className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: circle.visualTheme.primaryColor }}
              />
              {t.explore.clockDum}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block bg-gray-500" />
              {t.explore.clockTak}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhythmClock;
