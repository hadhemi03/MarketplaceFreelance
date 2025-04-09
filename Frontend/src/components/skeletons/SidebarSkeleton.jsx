import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-100 w-100 d-flex flex-column border-end">
      {/* Header */}
      <div className="border-bottom p-4">
        <div className="d-flex align-items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-weight-bold d-none d-lg-block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-auto py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="d-flex align-items-center gap-3 p-3">
            {/* Avatar skeleton */}
            <div className="position-relative">
              <div className="skeleton w-4 h-4 rounded-circle bg-light" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="d-none d-lg-block text-left flex-grow-1">
              <div className="skeleton h-4 w-50 mb-2 bg-light" />
              <div className="skeleton h-3 w-25 bg-light" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
