'use client';

const MicrophoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);

interface DashboardBannerProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function DashboardBanner({
  title = 'Hello Devs!',
  message = 'We are on a mission to help developers like you to build beautiful projects for FREE.',
  buttonText = 'Announcements',
  onButtonClick,
  className = '',
}: DashboardBannerProps) {
  return (
    <div
      className={`bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 relative overflow-hidden rounded-2xl shadow-lg h-full w-full ${className}`}
      style={{ minHeight: '200px' }}
    >
      {/* Wave Pattern Background */}
      <div className="absolute inset-0 opacity-10 h-full w-full">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,20 600,100 900,60 C1050,40 1150,50 1200,60 L1200,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-white text-opacity-90 text-base md:text-lg">{message}</p>
        </div>

        {buttonText && (
          <button
            onClick={onButtonClick}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <MicrophoneIcon />
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
