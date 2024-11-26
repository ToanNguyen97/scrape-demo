/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { TaskFormValues, taskSchema } from "./schema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { supabase } from "@/lib/supabase"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"


export const TaskForm = () => {
  // 1. Define your form.
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      email: "toannguyen210597@gmail.com",
      password: "Toan123456!",
      url: "https://drivetime.wd1.myworkdayjobs.com/en-US/DriveTime/job/Dallas-Headquarters/Product-Manager--Servicing_R10155/",
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    if (!values.url) return
    const payload: any = {
      email: values.email,
      password: values.password,
      url: values.url,
    }
    if (values.cover_letter) {
      payload.cover_letter = values.cover_letter
    }
    if (values.resume_url) {
      const resumeURL = await uploadFiles(values.resume_url)
      payload.resume_url = resumeURL
    }
    try {
      const { data, error } = await supabase.from('tasks').insert({
        ...payload,
        status: 'Pending'
      }).select().single()
      if (error) {
        throw error
      }
      payload.taskId = (data as any).id
      const res = await fetch('/api/apify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      await res.json()
      toast.success('Task has been created')
    } catch (error) {
      console.log('error', error);
      toast.error(error instanceof Error ? error.message : JSON.stringify(error))
    }
  }

  const uploadFiles = async (file: File) => {
    const nameFile = `resume/${new Date().getTime()}-${file.name}`
    const res = await fetch(`/api/upload?name=${encodeURIComponent(nameFile)}`)
    const result = await res.json()
    const presignedURL = result.data.url
    if (presignedURL) {
      const res = await fetch(presignedURL, {
        method: 'PUT',
        body: file
      })
      if (!res.ok) {
        throw new Error('Failed to upload file')
      }
      return `${process.env.NEXT_PUBLIC_STORAGE_DOMAIN}/${nameFile}`
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="resume_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) {
                        return
                      }
                      field.onChange(file)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="cover_letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Form>
  )
}