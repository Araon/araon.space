import Image, { StaticImageData } from "next/image";
import { Metadata } from "next";
import stand from "public/gear/stand.webp";
import laptop from "public/gear/laptop.jpg"

export const metadata: Metadata = {
  title: "Gear | Araon",
  description: "My toolbox. This is gear I actually own and recommend.",
};

interface ItemProps {
  title: string;
  description: string;
  image: string | StaticImageData;
  link: string;
  sponsored?: boolean;
  get: boolean | undefined;
}

const Item = ({
  title,
  description,
  image,
  link,
  sponsored,
  get = false,
}: ItemProps) => (
  <li className="flex items-center gap-4 transition-opacity">
    <a
      className="relative aspect-square h-[4rem] w-[4rem] min-w-[4rem] overflow-hidden rounded-xl bg-tertiary shadow"
      href={link}
      target="_blank"
    >
      <Image
        src={image}
        alt={title}
        className="h-full w-full object-cover object-center"
        fill
      />
    </a>
    <div className="flex grow items-center justify-between gap-2">
      <div className="space-y-1">
        <h3 className="line-clamp-2 font-medium leading-tight text-primary">
          {title}
        </h3>
        <p className="line-clamp-3 text-sm leading-tight text-secondary">
          {description}
        </p>
      </div>
      {get && (
        <div>
          <a
            className="ml-auto h-fit rounded-full bg-secondary px-4 py-1 text-sm"
            href={link}
            target="_blank"
          >
            Web
          </a>
          {sponsored && (
            <p className="mt-1 text-center text-xs text-tertiary">Sponsored</p>
          )}
        </div>
      )}
    </div>
  </li>
);

export default function Gear() {
  const categories = gear.reduce((acc, item) => {
    if (!acc.includes(item.category)) {
      acc.push(item.category);
    }
    return acc;
  }, [] as string[]);

  categories.sort();

  return (
    <>
      <div className="flex flex-col gap-16 md:gap-24">
        <div className="flex animate-in flex-col gap-8">
          <div>
            <h1 className="animate-in text-3xl font-bold tracking-tight">
              Gear
            </h1>
            <p
              className="animate-in text-secondary"
              style={{ "--index": 1 } as React.CSSProperties}
            >
              My toolbox.
            </p>
          </div>
          <p
            className="max-w-lg animate-in"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            These are my tools. The shack is quite humble at the moment.
          </p>
        </div>

        {categories.map((category, index) => (
          <section
            className="flex animate-in flex-col gap-8"
            key={index}
            style={{ "--index": 3 } as React.CSSProperties}
          >
            <h2 className="text-secondary">{category}</h2>
            <ul className="animated-list grid gap-x-6 gap-y-8 md:grid-cols-2">
              {gear.map((item, index) => {
                if (item.category === category) {
                  return (
                    <Item
                      key={index}
                      title={item.name}
                      description={item.description}
                      image={item.image}
                      link={item.link}
                      sponsored={item.sponsored}
                      get={item.get}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

const gear = [
  {
    name: "NeoVim",
    category: "Apps",
    image:
      "https://styles.redditmedia.com/t5_30kix/styles/communityIcon_n2hvyn96zwk81.png",
    description: "My config is built on top of NvChad, sprinkled with Catpuccin colours and nerdfonts. Here's my config",
    get: true,
    link: "https://github.com/phukon/nvim-config",
  },
  {
    name: "Notion",
    category: "Apps",
    image:
      "/gear/notion.png",
    description: "My second brain.",
    get: true,
    link: "https://code.visualstudio.com/",
  },
  {
    name: "VS Code",
    category: "Apps",
    image:
      "/gear/vscode.png",
    description: "This is hands down my fav.",
    get: true,
    link: "https://code.visualstudio.com/",
  },
  {
    name: "Asus x510u",
    category: "Machine",
    image: laptop,
    description: "Intel i3, 12 GB memory",
    link: "https://obsidian.md/",
  },
  {
    name: "Obsidian",
    category: "Apps",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2023_Obsidian_logo.svg/1200px-2023_Obsidian_logo.svg.png",
    description: "Minimal, fast and it's all markdown!",
    link: "https://obsidian.md/",
    get: true,
  },
  {
    name: "Portronics Portable Laptop Stand",
    category: "Other",
    image: stand,
    description: "Compact Laptop Stand",
    link: "https://www.amazon.in/gp/product/B0BV6ZW8KN/ref=ppx_yo_dt_b_asin_title_o02_s00?ie=UTF8&psc=1",
    sponsored: false,
    get: true,
  },
];
