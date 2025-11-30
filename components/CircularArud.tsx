import React, { useMemo } from 'react';
import { Circle, Meter, Tafila } from '../types';

interface CircularArudProps {
    circle: Circle;
    activeMeter: Meter;
    activePattern: Tafila[];
}

const COLORS = [
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
];

// Helper to calculate point on circle
const getCoordinatesForPercent = (percent: number, radius: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x * radius, y * radius];
};

const CircularArud: React.FC<CircularArudProps> = ({ circle, activeMeter, activePattern }) => {
    const sequence = circle.atomicSequence;
    const totalUnits = sequence.length;
    const radius = 160;
    const innerRadius = 80; // Donut hole
    const outerGroupRadius = 190; // Radius for the grouping arcs

    // Calculate rotation to align active meter's start offset to top (-90 degrees in SVG space, but we'll rotate the group)
    // Each unit is (360 / totalUnits) degrees.
    // We want the start of the active meter (index startOffset) to be at -90deg (top).
    // By default, index 0 starts at 0deg (3 o'clock) or -90deg (12 o'clock) depending on how we draw.
    // Let's draw index 0 starting at -90deg (12 o'clock).
    // Then to bring index K to the top, we rotate by -K * (360/totalUnits).

    const anglePerUnit = 360 / totalUnits;
    // To reverse direction, we simply invert the rotation logic.
    // If we want it to move anti-clockwise, we might need to change how we map the index to angle OR just the rotation.
    // Let's try inverting the rotation first.
    const rotation = (activeMeter.startOffset * anglePerUnit);

    // Format unit text (e.g., "0//" -> "//0")
    const formatUnit = (unit: string) => {
        return unit.split('').reverse().join('');
    };

    return (
        <div className="relative flex items-center justify-center py-8">
            {/* Main SVG */}
            <svg
                width="450"
                height="450"
                viewBox="-300 -300 600 600"
                className="transition-transform duration-1000 ease-in-out"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Segments */}
                {sequence.map((unit, index) => {
                    // Calculate start and end angles
                    // We start at -90deg (top).
                    // For CCW arrangement, we SUBTRACT the angle.
                    const startAngle = -90 - (index * anglePerUnit);
                    const endAngle = -90 - ((index + 1) * anglePerUnit);

                    // Convert to radians
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    // Calculate path coordinates
                    const x1 = Math.cos(startRad) * radius;
                    const y1 = Math.sin(startRad) * radius;
                    const x2 = Math.cos(endRad) * radius;
                    const y2 = Math.sin(endRad) * radius;

                    const x3 = Math.cos(endRad) * innerRadius;
                    const y3 = Math.sin(endRad) * innerRadius;
                    const x4 = Math.cos(startRad) * innerRadius;
                    const y4 = Math.sin(startRad) * innerRadius;

                    // SVG Path command
                    // For CCW, we are drawing from start to end (which is "backwards" in angle).
                    // SVG Arc command: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
                    // sweep-flag 1 is positive angle direction (CW), 0 is negative (CCW).
                    // We are going from startAngle (e.g. -90) to endAngle (e.g. -120).
                    // So we want sweep-flag 0.
                    const largeArcFlag = anglePerUnit > 180 ? 1 : 0;
                    const pathData = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x2} ${y2}`,
                        `L ${x3} ${y3}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x4} ${y4}`,
                        'Z'
                    ].join(' ');

                    // Text position (midpoint of the slice)
                    const midAngle = startAngle - (anglePerUnit / 2);
                    const midRad = (midAngle * Math.PI) / 180;
                    const textRadius = (radius + innerRadius) / 2;
                    const textX = Math.cos(midRad) * textRadius;
                    const textY = Math.sin(midRad) * textRadius;

                    // Determine which Tafila group this unit belongs to
                    // Calculate relative index from startOffset
                    // We need to handle the wrapping correctly.
                    // The sequence is displayed starting from -90deg (top) which corresponds to startOffset.
                    // So visually, the first segment at top is startOffset.

                    let relativeIndex = (index - activeMeter.startOffset);
                    if (relativeIndex < 0) relativeIndex += totalUnits;

                    // Find group index
                    let currentGroupIndex = 0;
                    let accumulatedUnits = 0;
                    let groupColor = 'transparent'; // Default

                    for (let i = 0; i < activeMeter.parsingInstructions.length; i++) {
                        const groupSize = activeMeter.parsingInstructions[i];
                        if (relativeIndex >= accumulatedUnits && relativeIndex < accumulatedUnits + groupSize) {
                            currentGroupIndex = i;
                            // Alternating colors for groups
                            // Even groups: Primary Color (with opacity)
                            // Odd groups: Accent Color (with opacity)
                            // Or just alternate opacity of primary color
                            const isEven = i % 2 === 0;
                            groupColor = isEven
                                ? (circle.visualTheme.primaryColor || '#FBBF24')
                                : (circle.visualTheme.accentColor || '#F59E0B');
                            break;
                        }
                        accumulatedUnits += groupSize;
                    }

                    return (
                        <g key={index} className="group cursor-pointer hover:opacity-90 transition-opacity">
                            <path
                                d={pathData}
                                fill={groupColor}
                                fillOpacity="0.3" // Semi-transparent
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="1"
                                className="transition-all duration-300"
                            />
                            {/* Unit Text */}
                            <text
                                x={textX}
                                y={textY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontSize="20"
                                fontWeight="bold"
                                className="font-mono pointer-events-none select-none"
                                style={{
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                    transform: `rotate(${midAngle + 90}deg)`
                                }}
                            >
                                {formatUnit(unit)}
                            </text>
                        </g>
                    );
                })}

                {/* Outer Groupings (Tafilat Labels Only) */}
                {activePattern.map((tafila, index) => {
                    // Find the start index for this tafila in the sequence
                    const previousUnits = activeMeter.parsingInstructions
                        .slice(0, index)
                        .reduce((sum, val) => sum + val, 0);

                    const startIndex = (activeMeter.startOffset + previousUnits) % totalUnits;
                    const groupSize = activeMeter.parsingInstructions[index];

                    // Calculate angles
                    // Calculate angles
                    const startAngle = -90 - (startIndex * anglePerUnit);
                    const endAngle = startAngle - (groupSize * anglePerUnit);

                    // Convert to radians for coordinates
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    // Coordinates for perimeter path
                    const x1 = Math.cos(startRad) * radius;
                    const y1 = Math.sin(startRad) * radius;
                    const x2 = Math.cos(endRad) * radius;
                    const y2 = Math.sin(endRad) * radius;

                    const x3 = Math.cos(endRad) * innerRadius;
                    const y3 = Math.sin(endRad) * innerRadius;
                    const x4 = Math.cos(startRad) * innerRadius;
                    const y4 = Math.sin(startRad) * innerRadius;

                    // Arc flags
                    const largeArc = (groupSize * anglePerUnit) > 180 ? 1 : 0;

                    const perimeterPath = [
                        `M ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`,
                        `L ${x3} ${y3}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x4} ${y4}`,
                        `Z`
                    ].join(' ');

                    // Radii for the label positioning
                    // We want the label to be outside the circle
                    const labelRadius = radius + 40; // Position for label center

                    // Text position
                    const midAngle = startAngle - ((groupSize * anglePerUnit) / 2);
                    const midRad = (midAngle * Math.PI) / 180;

                    const textX = Math.cos(midRad) * labelRadius;
                    const textY = Math.sin(midRad) * labelRadius;

                    return (
                        <g
                            key={`group-${activeMeter.id}-${index}`}
                            className="animate-fade-in"
                            style={{ animationDuration: '0.5s', animationFillMode: 'both' }}
                        >
                            {/* Perimeter Outline */}
                            <path
                                d={perimeterPath}
                                fill="none"
                                stroke={circle.visualTheme.accentColor || '#F59E0B'}
                                strokeWidth="2"
                                className="opacity-80 drop-shadow-sm"
                            />

                            {/* Tafila Name - No Box */}
                            <text
                                x={textX}
                                y={textY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={circle.visualTheme.primaryColor || '#FBBF24'}
                                fontSize="18"
                                fontWeight="bold"
                                className="font-amiri select-none pointer-events-none drop-shadow-md"
                                style={{
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                    transform: `rotate(${midAngle + 90}deg)`
                                }}
                            >
                                {tafila.merged}
                            </text>
                        </g>
                    );
                })}

                {/* Meter Start Markers - Only show the active one or all?
            The user asked for groupings "like the linear vis", which implies showing the breakdown of the CURRENT meter.
            Showing all meter markers might be cluttering if we also show groupings.
            Let's keep the markers but maybe make them more subtle or move them further out?
            Or maybe only show the active one?
            Let's keep them for now but push them out further if needed.
            Actually, the groupings are at radius 190. Markers were at radius + 25 = 185.
            Let's push markers to 240 to avoid overlap.
        */}
                {/* Re-render Loop for Markers to separate Line and Label */}
                {circle.meters.map((meter) => {
                    const startAngle = -90 - (meter.startOffset * anglePerUnit);
                    const markerRadius = 240; // Pushed out
                    const rad = (startAngle * Math.PI) / 180;
                    const x = Math.cos(rad) * markerRadius;
                    const y = Math.sin(rad) * markerRadius;

                    const isActive = meter.id === activeMeter.id;

                    return (
                        <React.Fragment key={meter.id}>
                            {/* Connector Line - No rotation */}
                            <line
                                x1={Math.cos(rad) * radius}
                                y1={Math.sin(rad) * radius}
                                x2={x}
                                y2={y}
                                stroke={isActive ? 'white' : 'rgba(255,255,255,0.3)'}
                                strokeWidth={isActive ? 2 : 1}
                                strokeDasharray={isActive ? '0' : '4 2'}
                            />

                            {/* Label Box - Counter Rotated */}
                            <g transform={`rotate(${-rotation} ${x} ${y})`}>
                                <foreignObject
                                    x={x - 60}
                                    y={y - 15}
                                    width="120"
                                    height="30"
                                    className="overflow-visible"
                                >
                                    <div
                                        className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-500 ${isActive
                                            ? 'bg-white text-gray-900 shadow-lg scale-110'
                                            : 'bg-gray-800/80 text-gray-400 border border-gray-700'
                                            }`}
                                        style={{ direction: 'rtl' }}
                                    >
                                        {meter.name}
                                    </div>
                                </foreignObject>
                            </g>
                        </React.Fragment>
                    );
                })}
            </svg>

            {/* Central Hub (Static, does not rotate with SVG) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-36 h-36 rounded-full bg-gray-900 border-4 border-gray-700 flex flex-col items-center justify-center text-center p-2 shadow-2xl z-10">
                    <h3 className="text-amber-400 font-amiri font-bold text-xl mb-1">
                        {circle.name}
                    </h3>
                    <div className="text-gray-400 text-xs font-inter">
                        {activeMeter.nameTransliteration}
                    </div>
                    <div className="mt-2 text-emerald-400 font-mono text-lg">
                        {formatUnit(sequence[activeMeter.startOffset])}
                    </div>
                </div>
            </div>

            {/* Top Indicator (Static) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                <div className="flex flex-col items-center animate-bounce">
                    <span className="text-white text-xs font-bold mb-1 bg-amber-600 px-2 py-0.5 rounded-full shadow-lg">
                        START
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22L12 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 22L6 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 22L18 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CircularArud;
