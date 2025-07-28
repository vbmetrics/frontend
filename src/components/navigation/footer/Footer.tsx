import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-footer">
      <div className="flex w-full items-center justify-center px-6 py-6 md:h-24 md:py-0">
        <p className="text-sm text-muted-foreground">
          &copy; <Link href="https://skublin.me/" className=""><span>Szymon Kublin</span></Link> {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

{/*
TODO: design bigger footer with more information

<Link
    href="/about"
    className="text-foreground/60 transition-colors hover:text-foreground/80"
>
    About
</Link>
<Link
    href="/about"
    className="text-foreground/60 transition-colors hover:text-foreground/80"
>
    Github
</Link>
<Link
    href="/about"
    className="text-foreground/60 transition-colors hover:text-foreground/80"
>
    Contact
</Link>
*/}