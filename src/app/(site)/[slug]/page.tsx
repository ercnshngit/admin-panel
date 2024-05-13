import BlockRenderer from "@/block-renderer";
import { BlockComponentDto } from "@/services/dto/block_component.dto";
import { getBlockComponentsBySlug, getBlocks } from "./_services";

export async function generateStaticParams() {
  const blocks = await getBlocks();

  return blocks.map((block) => ({
    slug: block.slug,
  }));
}

export default async function DynamicPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let data = await getBlockComponentsBySlug(params.slug);

  if (!data) {
    data = await getBlockComponentsBySlug("homepage");
  }

  if (data) {
    return (
      <>
        <BlockRenderer components={data as unknown as BlockComponentDto[]} />
      </>
    );
  }
  return (
    <div className="container">
      <p className="py-10">404 Not Found</p>
    </div>
  );
}
