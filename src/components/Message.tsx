import Link from "next/link";
import { VENDORS } from "@/lib/site";
import { when, postHandle, postUrl, type ResetEvent } from "@/lib/events";
import Badge from "./Badge";
import VendorLogo from "./VendorLogo";

/** One flat chat-style message: avatar on the left, bubble on the right. */
export default function Message({ e, link = true }: { e: ResetEvent; link?: boolean }) {
  const v = VENDORS[e.vendor];
  const handle = postHandle(e);
  const url = postUrl(e);
  return (
    <div className={`msg v-${e.vendor}`}>
      <span className="msg-avatar"><VendorLogo vendor={e.vendor} size={26} /></span>
      <div className="msg-bubble">
        <div className="msg-head">
          <b>{handle ? `@${handle}` : v.name}</b>
          <time dateTime={e.announced_at ?? e.date}>{when(e)}</time>
          {e.kind === "banked" ? <span className="tag">banked</span> : null}
          <Badge status={e.status} />
        </div>
        {link ? (
          <h3><Link href={`${v.path}/${e.date}`}>{e.title}</Link></h3>
        ) : null}
        {e.quote ? <blockquote className="msg-text">{e.quote.text}</blockquote> : e.postId ? null : <p className="msg-text">{e.summary}</p>}
        {url || e.quote?.via ? (
          <div className="msg-foot">
            {url ? <a href={url} target="_blank" rel="noopener nofollow">Open on X ↗</a> : null}
            {e.quote?.via ? <span>text via {e.quote.via}</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
