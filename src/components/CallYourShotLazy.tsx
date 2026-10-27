"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type CallYourShot from "./CallYourShot";

const Widget = dynamic(() => import("./CallYourShot"), { ssr: false });

/** Interactive widget only; the answer sentence and log stay server-rendered. */
export default function CallYourShotLazy(props: ComponentProps<typeof CallYourShot>) {
  return <Widget {...props} />;
}
