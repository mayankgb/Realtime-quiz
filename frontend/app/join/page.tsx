import React from "react"

const QuizEntry = React.lazy(() => import("@/app/_components/EntryForm"))

export default function Join() {

    return (
        <div className="flex bg-gradient-to-b from-gray-50 to-gray-300 justify-center items-center h-screen">
            <QuizEntry/>
        </div>
    )

}