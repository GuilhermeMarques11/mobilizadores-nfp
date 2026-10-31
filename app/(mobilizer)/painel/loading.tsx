import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl flex-1 space-y-4 px-4 py-5">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28"
          >
            <Skeleton className="w-8 h-8 rounded-full bg-gray-300" />
            <div className="space-y-2">
              <Skeleton className="w-24 h-3 bg-gray-300" />
              <Skeleton className="w-12 h-6 bg-gray-300" />
            </div>
          </div>
        ))}
      </section>

      <Skeleton className="w-full h-12 rounded-xl" />

      <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
        <Skeleton className="w-36 h-4" />

        <div className="space-y-3 pt-2">
          {[1, 2, 3].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between p-3 border-b border-gray-100"
            >
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
