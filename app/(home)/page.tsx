'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState('')
  const handleScrape = async () => {
    try {
      if (!url) return
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      console.log('data', data);
    } catch (error) {
      console.log('error', error);
    }
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="enter url" />
        <Button onClick={handleScrape}>Scrape</Button>
      </main>
    </div>
  );
}
