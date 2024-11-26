import { Suspense } from "react";
import Map from "./components/Map";
import InstructionsModal from "./components/InstructionsModal";

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="max-w-screen-lg m-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <InstructionsModal />
          <Map />
        </Suspense>
      </div>
    </main>
  );
}
