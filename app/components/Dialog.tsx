"use client";

import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";

interface DialogProps {
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
}

export default function Dialog({ setOpen, children }: DialogProps) {
    return (
        <div className="w-screen h-screen bg-white/25 fixed top-0 left-0 flex items-center justify-center"
            onClick={() => { setOpen(false); }}>
            { children }
        </div>
    );
}