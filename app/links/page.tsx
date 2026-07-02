import Image from "next/image";
import ConnectLinksList from "@/components/ConnectLinksList";
import avatar from "public/avatar.jpg";

export default function Links() {
  return (
    <>
      <div className="flex flex-col gap-16 md:gap-24">
        <div className="flex animate-in flex-col gap-8">
          <Image
            src={avatar}
            width={100}
            height={100}
            alt="avatar"
            className="mx-auto animate-in rounded-full bg-secondary"
            style={{ "--index": 1 } as React.CSSProperties}
          />
          <div
            className="animate-in space-y-1"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            <h1 className="text-center text-2xl font-bold tracking-tight">
              Araon
            </h1>
            <p className="mx-auto max-w-sm text-center text-secondary">
              Loves building cool things with code. Find me elsewhere @Araon
            </p>
          </div>
        </div>

        <ConnectLinksList />
      </div>
    </>
  );
}
