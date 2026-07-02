import { allCodes} from ".contentlayer/generated";
import Mdx from "@/app/blog/components/ui/MdxWrapper";


export default function Coderenderer() {

  return (
    <div className="flex flex-col gap-20">
      <article>
        <div
          className="project prose animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <Mdx code={allCodes[0].body.code} />
        </div>
      </article>
      <div />
    </div>
  );
}
