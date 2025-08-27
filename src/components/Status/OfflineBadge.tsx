import { useEffect, useState } from "react";

export const OfflineBadge = () => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={
          online
            ? 'inline-block w-2.5 h-2.5 rounded-full bg-green-500'
            : 'inline-block w-2.5 h-2.5 rounded-full bg-red-500'
        }
      />
      <span className="text-muted-foreground">
        {online ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};


