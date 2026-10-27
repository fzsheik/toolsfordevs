import { SITE } from "@/lib/site";

const HOST = new URL(SITE.url).host;
const ICS = `https://${HOST}/resets.ics`;

export default function AlertsBlock() {
  return (
    <section className="card alerts" aria-labelledby="alerts-title">
      <h2 id="alerts-title">Get reset alerts</h2>
      <ul>
        <li><b>RSS:</b> <a href="/feed.xml">all news</a> · <a href="/resets.xml">resets only</a></li>
        <li><b>Calendar:</b> <a href={`webcal://${HOST}/resets.ics`}>subscribe (webcal)</a> · <a href={`https://calendar.google.com/calendar/r?cid=${encodeURIComponent(`webcal://${HOST}/resets.ics`)}`} rel="nofollow noopener" target="_blank">add to Google Calendar</a></li>
        <li><b>JSON:</b> <a href="/resets.json">/resets.json</a></li>
      </ul>
      <p className="muted">Calendar file: <code>{ICS}</code></p>
    </section>
  );
}
