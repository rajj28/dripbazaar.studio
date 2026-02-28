import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ size = 'medium', message, fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className={`loading-spinner-wrapper ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  return content;
}
