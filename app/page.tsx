import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="max-w-[1000px] mt-10 mx-auto">
      <Navbar />
      <Hero />
      <footer className="mt-10">
        <div className="border-t-2 flex justify-center py-2 text-xl">
          Created By Yogesh Singh Chilwal ✌️
        </div>
      </footer>
    </div>
  );
}
