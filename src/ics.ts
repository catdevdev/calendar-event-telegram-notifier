import ical from "node-ical";

export const icsString = `
BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:ИПЗ-5
X-WR-TIMEZONE:Europe/Kiev
BEGIN:VTIMEZONE
TZID:Europe/Helsinki
X-LIC-LOCATION:Europe/Helsinki
BEGIN:DAYLIGHT
TZOFFSETFROM:+0200
TZOFFSETTO:+0300
TZNAME:EEST
DTSTART:19700329T030000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0300
TZOFFSETTO:+0200
TZNAME:EET
DTSTART:19701025T040000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTART;TZID=Europe/Helsinki:20230904T115000
DTEND;TZID=Europe/Helsinki:20230904T151000
RRULE:FREQ=WEEKLY;BYDAY=MO
DTSTAMP:20230910T005424Z
UID:1694082535064-62985@ical.marudot.com
CREATED:20230907T103928Z
DESCRIPTION:https://github.com/gelin/calendar-bot
LAST-MODIFIED:20230907T110322Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Інформаційна безпека  інноваційної діяльності (ІБІД) Лк доц. Кононо
 вич В.Г.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Europe/Helsinki:20230905T115000
DTEND;TZID=Europe/Helsinki:20230905T143500
RRULE:FREQ=WEEKLY;BYDAY=TU
DTSTAMP:20230910T005424Z
UID:1694082671218-18927@ical.marudot.com
CREATED:20230907T103928Z
DESCRIPTION:https://github.com/gelin/calendar-bot
LAST-MODIFIED:20230907T110322Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Конфліктно-керовані системи (ККС)  Лк проф. Ісмаїлова Н.П.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Europe/Helsinki:20230906T115000
DTEND;TZID=Europe/Helsinki:20230906T143500
RRULE:FREQ=WEEKLY;BYDAY=WE
DTSTAMP:20230910T005424Z
UID:1694082760152-84402@ical.marudot.com
CREATED:20230907T103928Z
DESCRIPTION:https://github.com/gelin/calendar-bot
LAST-MODIFIED:20230907T110322Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Моделювання та верифікація програмного забезпечення  (МВПЗ)  Лк  до
 ц. Заврак М.В.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Europe/Helsinki:20230906T152000
DTEND;TZID=Europe/Helsinki:20230906T180500
RRULE:FREQ=WEEKLY;BYDAY=WE
DTSTAMP:20230910T005424Z
UID:1694082810618-23079@ical.marudot.com
CREATED:20230907T103928Z
LAST-MODIFIED:20230907T110322Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Основи наукових досліджень та  авторське право (ОНДАП) Лк проф. Гад
 жиєв М.М.      
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=Europe/Helsinki:20230908T094500
DTEND;TZID=Europe/Helsinki:20230908T110500
RRULE:FREQ=WEEKLY;BYDAY=FR
DTSTAMP:20230910T005424Z
UID:1694083117261-33501@ical.marudot.com
URL:https://github.com/gelin/calendar-bot
CREATED:20230907T103928Z
LAST-MODIFIED:20230907T110322Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Ділова іноземна мова (ДІМ)  пр  (1-15т.)  доц. Кузьменко Ю.О.      
  
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230907T065000Z
DTEND:20230907T102500Z
DTSTAMP:20230910T005424Z
UID:1694082971742-76255@ical.marudot.com
URL:https://github.com/gelin/calendar-bot
CREATED:20230907T103928Z
LAST-MODIFIED:20230907T161433Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Машине навчання (МН)  Лк  проф. Третяк О.І.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T094700Z
DTEND:20230908T104700Z
DTSTAMP:20230910T005424Z
UID:2d2i71a2ts9r5quc9o1h8fa2bd@google.com
CREATED:20230908T091911Z
DESCRIPTION:test
LAST-MODIFIED:20230908T093219Z
SEQUENCE:5
STATUS:CONFIRMED
SUMMARY:test
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T195200Z
DTEND:20230908T195500Z
DTSTAMP:20230910T005424Z
UID:5ut09n98j4colq0i6b0c92qhr3@google.com
CREATED:20230908T193754Z
DESCRIPTION:<a href="https://stackoverflow.com/questions/62600596/why-is-a-
 reserved-character-in-markdownv2-in-telegrams-bot-api">https://stackoverflo
 w.com/questions/62600596/why-is-a-reserved-character-in-markdownv2-in-teleg
 rams-bot-api</a>
LAST-MODIFIED:20230908T194652Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:test 4
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T195500Z
DTEND:20230908T195800Z
DTSTAMP:20230910T005424Z
UID:35jnaf3mh8qdbclsklbgshrivv@google.com
CREATED:20230908T193731Z
DESCRIPTION:<a href="https://chat.openai.com/">https://chat.openai.com/</a>
LAST-MODIFIED:20230908T194701Z
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:test 3
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T203000Z
DTEND:20230908T213500Z
DTSTAMP:20230910T005424Z
UID:5m3olas73vvitr719hc64d40ft@google.com
CREATED:20230908T201933Z
DESCRIPTION:https://stackoverflow.com/questions/31908527/php-telegram-bot-i
 nsert-line-break-to-text-message
LAST-MODIFIED:20230908T201933Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:Інформаційна безпека інноваційної діяльності (ІБІД) Лк доц. Кононов
 ич В.Г.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T202400Z
DTEND:20230908T212800Z
DTSTAMP:20230910T005424Z
UID:75g3hsirqk09ohk62sgljr1gv9@google.com
CREATED:20230908T134700Z
DESCRIPTION:https://github.com/telegraf/telegraf/issues/1242
LAST-MODIFIED:20230908T201945Z
SEQUENCE:4
STATUS:CONFIRMED
SUMMARY:Інформаційна безпека інноваційної діяльності (ІБІД) Лк доц. Кононов
 ич В.Г.
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230908T213000Z
DTEND:20230908T220000Z
DTSTAMP:20230910T005424Z
UID:68odh1l81404ulhutrku906ean@google.com
CREATED:20230908T212947Z
LAST-MODIFIED:20230908T212947Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:lesson starts!!
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230911T004500Z
DTEND:20230911T014500Z
DTSTAMP:20230910T005424Z
UID:1ovll7115lb9jgcc63mvkpn3cb@google.com
CREATED:20230910T004922Z
LAST-MODIFIED:20230910T005018Z
SEQUENCE:3
STATUS:CONFIRMED
SUMMARY:test
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230910T011500Z
DTEND:20230910T013500Z
DTSTAMP:20230910T005424Z
UID:3e2l1rqeaql0kq0eea2g81os7q@google.com
CREATED:20230910T005138Z
DESCRIPTION:<a href="https://www.google.com/url?q=https://stackoverflow.com
 /questions/67052338/gitlab-ci-cd-shell-executor-npm-command-not-found&amp\;
 sa=D&amp\;source=calendar&amp\;usd=2&amp\;usg=AOvVaw0NnQaak2w0kmYLcNSBCUjl"
  target="_blank">https://stackoverflow.com/questions/67052338/gitlab-ci-cd-
 shell-executor-npm-command-not-found</a>
LAST-MODIFIED:20230910T005138Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:tttttrsttrstrstttttrstrstrstrtrstrst
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230910T010000Z
DTEND:20230910T012000Z
DTSTAMP:20230910T005424Z
UID:1m8j9qaffhs041pdara9ndi2pc@google.com
CREATED:20230910T005042Z
DESCRIPTION:https://stackoverflow.com/questions/67052338/gitlab-ci-cd-shell
 -executor-npm-command-not-found
LAST-MODIFIED:20230910T005354Z
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:tttttrst
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART:20230910T010500Z
DTEND:20230910T012500Z
DTSTAMP:20230910T005424Z
UID:2ack7uhrakarap4f7p1fhtail8@google.com
CREATED:20230910T005107Z
DESCRIPTION:<a href="https://stackoverflow.com/questions/67052338/gitlab-ci
 -cd-shell-executor-npm-command-not-found">https://stackoverflow.com/questio
 ns/67052338/gitlab-ci-cd-shell-executor-npm-command-not-found</a>
LAST-MODIFIED:20230910T005405Z
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:tttttrsttrstrst
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR

`;
