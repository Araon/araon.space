import { useMDXComponent } from "next-contentlayer/hooks";

import CustomImage from "@/app/blog/components/ui/Image";
import Link from "@/components/ui/Link";
import Alert from "../mdx/Alert";

interface CustomLinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

const CustomLink: React.FC<CustomLinkProps> = (props) => {
  const href = props?.href;
  const isInternalLink = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternalLink) {
    return (
      <Link {...props} href={href} underline>
        {props.children}
      </Link>
    );
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="font-normal text-link underline underline-offset-4"
      {...props}
    />
  );
};

const components = {
  Image: CustomImage,
  a: CustomLink,
  Link: CustomLink,
  Alert,
};

export default function MdxWrapper({ code }: { code: string }) {
  const Component = useMDXComponent(code, { components });

  return <Component components={components} />;
}
