import { ReactNode } from "react";

export default function RoomsLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="">{children}</main>
        </div>
    );
}
