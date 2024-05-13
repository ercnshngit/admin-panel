import { Button } from "@/components/ui/button";
import { ComponentDto } from "@/services/dto/component.dto";
import { useDraggable } from "@dnd-kit/core";
import { Icons } from "../../utils/icons";

export default function SidebarComponent({
  component,
  ...props
}: {
  component: ComponentDto;
  [key: string]: any;
}) {
  const draggable = useDraggable({
    id: component.id + "-sidebar-drag-handler",
    data: {
      component: component,
      isSidebarComponent: true,
    },
  });
  const Icon =
    (component.icon && Icons[component.icon as keyof typeof Icons]) || null;
  return (
    <Button asChild>
      <div
        ref={draggable.setNodeRef}
        {...draggable.listeners}
        {...draggable.attributes}
        className="px-4 group relative py-2 border flex shadow-sm whitespace-pre-wrap flex-col justify-center items-center gap-4 rounded-md h-auto"
      >
        {Icon && <Icon />}
        <h1 className="text-center">{component.name}</h1>
        {/* <div className="hidden group-hover:block z-40 absolute top-0 right-full w-[80vw] bg-white p-2 border rounded-md">
          <Suspense fallback={<Loading />}>
            <Component
              component={
                {
                  component: component,
                } as any
              }
            />
          </Suspense>
        </div> */}
      </div>
    </Button>
  );
}
