import { Suspense } from "react";
import Map from "./components/Map";

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <div className="max-w-screen-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <Map />
        </Suspense>
      </div>
    </main>
  );
}
