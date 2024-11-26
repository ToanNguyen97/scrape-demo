/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { columns, Task } from "@/components/Tasks/column";
import { TaskForm } from "@/components/Tasks/form";
import { DataTable } from "@/components/Tasks/table";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleFetchTasks = async () => {
    try {
      const { data } = await supabase
      .from('tasks')
      .select()
      .order('created_at', { ascending: false })
      if (data?.length) {
        setTasks(data)
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    handleFetchTasks()
    const channel = supabase.channel('tasks')
    channel
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
      console.log('realtime', payload);

      handleFetchTasks()
    })
    .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="container mx-auto py-8">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <TaskForm/>
        <section className="w-full">
          <h2 className="font-bold mb-3">Tasks</h2>
          <DataTable data={tasks} columns={columns}/>
        </section>
      </main>
    </div>
  );
}
