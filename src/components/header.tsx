import { ListTodoIcon } from "lucide-react";
import { Separator } from "./ui/separator";

export function Header() {
    return (
        <div className="border-b ">
            <div className="flex h-16 items-center gap-6 px-6">
                <ListTodoIcon className="h-6 w-6" />
                <Separator orientation="vertical" className="h-6 v-[100vh] w-px " />
            </div>
        </div>
    )
}