// import { Progress } from '@/shadcn/components';

export const InfiniteProgressBar = () => {
  return (
    <div className="relative h-2 bg-gray-200 overflow-hidden">
      <div className="absolute top-0 left-0 h-2 w-1/2 bg-blue-500 animate-progress-bar"></div>
    </div>
  );
};
