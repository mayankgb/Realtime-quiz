import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Brain, Trophy, Users, Zap } from 'lucide-react'
import github from "@/public/github.png"
import Image from 'next/image'
import React from 'react'
const Quizes = React.lazy(() => import("./Quizes"))

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">QuizMaster</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm w-28 px-2 py-1 h-full bg-white flex items-center font-medium  rounded-md shadow-md hover:bg-slate-300"
            href="https://github.com/mayankgb/Realtime-quiz"
          >
            <div className="mr-2">
              <Image
                src={github}
                alt="GitHub Logo"
                height={44}
                width={44}
                className="rounded-full"
              />
            </div>
            <div className="text-gray-800 font-bold">GitHub</div>
          </Link>

        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className=" px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master Knowledge, Compete in Real-Time
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create quizzes, compete with friends, and climb the leaderboard. Experience the thrill of real-time knowledge battles!
                </p>
              </div>
              <div className="space-x-4 flex ">
                <Quizes />
                <Link href={"/join"} className='border border-1 border-white text-center hover:bg-white hover:bg-opacity-10 pt-1 rounded-lg px-4 font-bold'>Join a quiz</Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Zap className="h-10 w-10 text-blue-500 dark:text-blue-300" />
                </div>
                <h2 className="text-xl font-bold">Create Quizzes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily create engaging quizzes on any topic. Share with friends or the world.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Users className="h-10 w-10 text-green-500 dark:text-green-300" />
                </div>
                <h2 className="text-xl font-bold">Compete in Real-Time</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Join live quiz sessions and compete against players from around the globe.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                  <Trophy className="h-10 w-10 text-orange-500 dark:text-orange-300" />
                </div>
                <h2 className="text-xl font-bold">Real-Time Leaderboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Watch rankings update live as you play. Climb to the top and claim your glory!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Challenge Your Knowledge?</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join thousands of quiz enthusiasts. Create, compete, and conquer in the world of real-time quizzes!
                </p>
              </div>
              <Button size="lg">
                Start Quizzing Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 QuizMaster. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

