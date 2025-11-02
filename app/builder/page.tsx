// app/builder/page.tsx

import FieldProperties from "@/components/builder-page/ FieldProperties";
import FormCanvas from "@/components/builder-page/ FormCanvas";
import SidebarFields from "@/components/builder-page/SidebarFields";

export default function BuilderPage() {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-[20%] border-r border-gray-200 dark:border-neutral-800 p-4">
        <SidebarFields />
      </aside>

      {/* Center Canvas */}
      <main className="flex-1 p-8 overflow-y-auto">
        <FormCanvas />
      </main>

      {/* Right Sidebar */}
      <aside className="w-[20%] border-l border-gray-200 dark:border-neutral-800 p-4">
        <FieldProperties />
      </aside>
    </div>
  );
}
