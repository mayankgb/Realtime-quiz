"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeSwitcher() {

    const {theme, setTheme} = useTheme()

    return(
        <div className="">
            <Button></Button>
        </div>
    )

}