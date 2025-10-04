import React from 'react'
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeSwitcher } from './theme-switcher'

const PageTitle = () => {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="w-full flex items-center justify-between gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <ThemeSwitcher />
            </div>
        </header>
    )
}

export default PageTitle