import { Plane } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Plane className="h-6 w-6" />
      </div>
      <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">
        BDA AssetInsight
      </span>
    </div>
  );
}
