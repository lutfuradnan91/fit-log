import Link from "next/link";
import Image from "next/image";

const Footer = () => {
return ( <footer className="border-t border-white/10 bg-black text-white"> <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row">
 <Link href="/" className="flex items-center gap-3"> <Image src="/logo.png" alt="FitLog logo"  width={36} height={36}
         className="h-9 w-9 object-contain"/>


      <span className="text-lg font-black tracking-wider">FIT<span className="text-lime-400">LOG</span>
      </span></Link>

    
    <p className="text-center text-sm text-gray-400">© 2026 FitLog — Workout Library. Train hard, log honest.</p>
  </div>
</footer>

);
};

export default Footer;
