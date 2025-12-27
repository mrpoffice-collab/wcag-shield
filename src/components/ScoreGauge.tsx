'use client';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, size = 'md' }: ScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-600', text: 'text-green-700', ring: 'ring-green-200' };
    if (score >= 60) return { bg: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-200' };
    return { bg: 'bg-red-600', text: 'text-red-700', ring: 'ring-red-200' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Needs Work';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  const colors = getScoreColor(score);

  const sizeClasses = {
    sm: { container: 'w-20 h-20', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-4xl', label: 'text-sm' },
    lg: { container: 'w-40 h-40', text: 'text-5xl', label: 'text-base' },
  };

  const sizes = sizeClasses[size];

  // Calculate stroke dasharray for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizes.container}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={colors.text}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${sizes.text} font-bold text-gray-900`}>{score}</span>
        </div>
      </div>
      <span className={`mt-2 ${sizes.label} font-medium ${colors.text}`}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
}
