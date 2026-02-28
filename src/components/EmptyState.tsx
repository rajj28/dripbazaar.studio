import { Package, ShoppingCart, Search, AlertCircle } from 'lucide-react';
import './EmptyState.css';

interface EmptyStateProps {
  type: 'orders' | 'cart' | 'search' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ type, title, message, actionLabel, onAction }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'orders':
        return <Package size={64} strokeWidth={1.5} />;
      case 'cart':
        return <ShoppingCart size={64} strokeWidth={1.5} />;
      case 'search':
        return <Search size={64} strokeWidth={1.5} />;
      case 'error':
        return <AlertCircle size={64} strokeWidth={1.5} />;
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{getIcon()}</div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
