// Begrundelser bag hvert designvalg. "f" henviser til fund-numre i UX-reviewet, "n" til Esbens egne noter.
// sev = severity 0-4 efter NN/g. Hvert valg viser problem (før), beslutning (nu) og evidens.
window.WHY = {
  librarybar: {
    t: "Bibliotekvælger i menuen, med label",
    f: [1, 9, 12, 19], sev: 3, n: "Noter: forældre og lærere hjælper barnet",
    before: "Første skærm var en dialog med fokus på \"Fortsæt uden at vælge\". Efter valget kunne man ikke ændre det uden at gå via et skjult ikon og en side mere.",
    now: "Vælgeren ligger fast til venstre i hovedmenuen med label \"Vælg skole eller bibliotek\" og viser det valgte sted. Ét tryk åbner en søgbar liste med det samme. Ingen separat skolevælger-side. Valget bekræftes med en kort besked, der kan fortrydes, i stedet for en infoboks ovenpå indholdet.",
    why: "Barnet (og de voksne, der hjælper) kan altid se og skifte sted. Placeringen er ligestillet med navigationen, så den ikke kan misforstås som et lukkeknap-kryds."
  },
  onboarding: {
    t: "\"Hvor er du?\" på forsiden i stedet for en dialog",
    f: [1, 12, 14, 19], sev: 3, n: "Noter: vis skoler på forsiden, slet skolesiden",
    before: "Fuldskærmsdialog, fokus på \"Fortsæt uden\", 234 poster i én kolonne, testposter, ingen forklaring på hvorfor man skal vælge.",
    now: "Et kort på forsiden, der ikke blokerer indholdet. Primær handling er \"Brug min placering\" eller at søge. Løftet i barnets sprog: \"så viser vi kun bøger, der står på hylden lige nu\". Listen er grupperet efter kommune/skole, har nærmeste øverst og ingen testposter.",
    why: "Casen: Buggi bruges primært, mens barnet står på biblioteket. Uden valgt sted mister barnet hylde og udlånsstatus – det er hele kernen i produktet. Derfor er valget forfremmet, men ikke tvunget."
  },
  search: {
    t: "Søgefelt med label, stavetolerance og emner",
    f: [5, 18], sev: 3, n: "Noter: label \"Søg efter bøger\"",
    before: "\"hary poter\" gav \"Øv bøv, ingen resultater\". Kun titel og forfatter kunne søges. Feltet kunne forveksles med søgning efter skoler.",
    now: "Label \"Søg efter bøger\". Fejltolerant søgning: \"Viser resultater for Harry Potter\". Søg også på emne (fx \"heste\", \"fodbold\"). Ingen resultater giver forslag, ikke en undskyldning.",
    why: "Målgruppen omfatter ordblinde børn. En søgning, der straffer stavefejl, ekskluderer netop dem, Buggi skal hjælpe."
  },
  rows: {
    t: "Karruseller med overskrift i ord",
    f: [16, 10], sev: 2, n: "Noter: karruseller mangler overskrift, siden mangler h1",
    before: "Rækkerne havde kun emojis som overskrift. Brugeren kunne ikke se, om det var sæson, alder eller genre. Siden havde ingen h1. Bøger for 11–16 år lå øverst til 8–12-årige.",
    now: "H1 \"Find din næste bog\" og en h2 pr. række, der forklarer hvorfor bøgerne vises: \"Uhyggelige bøger til Halloween\", \"Fordi du kan lide Percy Jackson\". aldersfilter 8–12 som standard. Hver bog har titel, type (Fakta eller Fortælling) og forfatter som tekst under omslaget, så barnet kan se, om bogen er skrevet af eller handler om en person, og så oplæsningsværktøjer kan læse den.",
    why: "Skærmlæsere og læsetrænede børn har brug for ord. Overskriften afkoder intentionen (genkendelse frem for genkaldelse, H6)."
  },
  seasonal: {
    t: "Sæsontema bevaret som farver, ikke som bevægelse",
    f: [20], sev: 1, n: "Noter: Halloween virker opdateret. Buggi skal ikke blive tung eller animeret",
    before: "Travl Halloween-baggrund og animationer konkurrerede med bogcovers. Et spøgelse viste og skjulte en scrollbar.",
    now: "Halloween-farver, ikoner og tekst bevares. Der er ingen animeret baggrund og ingen animationer, der ændrer layoutet.",
    why: "Barnet skal hurtigt hen til hylden og være til stede med de voksne og de andre børn. Sæsonen gør siden levende, men bevægelse trækker tid og opmærksomhed på telefonen, som er det modsatte af formålet."
  },
  nav: {
    t: "Tekst og ikon i menuen på både PC og mobil",
    f: [13], sev: 2, n: "",
    before: "Mobilmenuen viste kun ikoner (hus, smiley, lup) uden tekst og uden tilgængelige navne.",
    now: "Fast tabbar i bunden på mobil med ikon og tekst: Hjem, Opdag, Søg. Samme tekst på PC.",
    why: "Konsistens mellem enheder (H4) og tommelfingerzone på mobil. Ikoner alene er svære for børn at afkode."
  },
  moods: {
    t: "Emoji-filter med synlige navne i et fast gitter",
    f: [4, 15, 16], sev: 3, n: "Noter: emojis uden labels, forskellige på Android og iOS",
    before: "En sky af overlappende emojis, der omarrangerede sig ved første klik. Navnet kun ved hover. 16 af 21 emojis overlappede på mobil.",
    now: "Et fast gitter med store knapper (mindst 56 px). Navnet står under hver emoji, og en kort forklaring vises ved valg. To grupper med overskrift: \"Hvordan skal bogen føles?\" og \"Hvad skal den handle om?\". Navnene løser også forskellen mellem fx Magi og Fabeldyr.",
    why: "Emojis ser forskellige ud på Android og iOS (din note), og hover findes ikke på touch. Ord gør filteret læseligt og kan læses højt for børn."
  },
  filterrule: {
    t: "Flere valg giver færre bøger – og det står der",
    f: [3, 17], sev: 3, n: "",
    before: "Ekstra emoji øgede antallet fra 1.255 til 1.332, modsat filterkonventionen. Skyderne viste ikke valgt værdi.",
    now: "Valg afgrænser (OG-logik). Teksten \"Jo flere du vælger, jo færre bøger\" står ved filteret. Længde og sværhed er knapper med ord (\"Kort\", \"Mellem\", \"Lang\") i stedet for skydere. Fakta/Fiktion er også knapper i stedet for lagkagediagram.",
    why: "Systemet skal følge brugerens mentale model (H4). Knapper med ord kan læses højt og kræver ikke finmotorik."
  },
  stickycta: {
    t: "Filterpanel og resultater side om side, valgte filtre synlige",
    f: [7], sev: 2, n: "",
    before: "Resultaterne startede under skærmkanten. Børn scroller sjældent uden tydeligt signal.",
    now: "På PC ligger filtrene i et fast panel til venstre og resultaterne til højre, så man ser effekten af hvert valg uden at scrolle. Over resultaterne vises de valgte filtre som chips, der kan fjernes ét ad gangen. På mobil, hvor der ikke er plads til to kolonner, er der en fast knap i bunden: \"Vis 7 bøger\".",
    why: "Systemstatus (H1) og genkendelse frem for genkaldelse (H6): man skal ikke huske sine valg, når kun få bøger vises. Fast panel på PC, fast knap på mobil – hver enhed får det mønster, der passer til pladsen."
  },
  book: {
    t: "Egen bogside med lokkende tekst og forslag til næste bog",
    f: [], sev: 2, n: "Noter: bog skal have egen side med beskrivelse og relaterede bøger",
    before: "Et tryk på en bog under \"Har du læst?\" sendte brugeren ned ad siden via et anker-link.",
    now: "Hver bog har en side med resumé, humør og emner med navne, alder, længde og læsbarhed. Nederst vises beslægtede bøger.",
    why: "Barnet skal lokkes til at læse bogen. Gør bogen ikke det, skal næste forslag være ét tryk væk."
  },
  related: {
    t: "Beslægtede bøger efter emne, genre, læsbarhed og alder",
    f: [], sev: 2, n: "Noter: relateres med emneord, kategori, lix, aldersgruppe. Inspiration: Bibblix \"lettere/sværere\"",
    before: "Ingen relaterede forslag, hvis bogen ikke var den rigtige.",
    now: "Hvert forslag viser hvorfor det passer (\"Samme emne: Magi\", \"Lidt lettere\"). Knapper skifter mellem \"Lidt lettere\", \"Samme niveau\", \"Lidt sværere\" (lix).",
    why: "Brugeren forstår, hvorfor et forslag vises, og får kontrol over niveauet. Mønstret er lånt fra Bibblix i konkurrentanalysen."
  },
  shelf: {
    t: "Find på hylden: bevaret og styrket",
    f: [8], sev: 2, n: "Review: sidens stærkeste element",
    before: "Illustrationen var stærk, men den grønne prik blev ikke forklaret og lå kun på bogsiden.",
    now: "Samme idé, men prikken har en forklaring (\"Grøn prik: står på hylden lige nu\"), og knappen er stor og først i handlingsrækkefølgen. Skiltene vises som trin: BØRN → FANTASY → R.",
    why: "Det er kernen i casen: barnet står på biblioteket og skal gå hen og tage bogen."
  },
  avail: {
    t: "Fra bog til hylde: alle biblioteker med status på bogsiden",
    f: [1, 8, 12, 19], sev: 3, n: "Noter: Zombiejagt fandtes ikke på Nørrebro, men på Nørre Snede. Fire tryk for at søge bibliotek",
    before: "For at se, hvor en bog står, skulle man trykke Find bog, derefter en knap for at vælge skole eller bibliotek, så trykke i søgefeltet og skrive. Bøger, der ikke fandtes på det valgte sted, forsvandt uden forklaring.",
    now: "Bogsiden viser straks \"Du kan finde bogen på disse biblioteker\": dit bibliotek øverst, derefter de steder, hvor bogen står på hylden, så udlånt, så ikke i samlingen. Hver række har statustekst, ikke kun farve (\"Står på hylden\", \"Udlånt\", \"Ikke i samlingen\"), kommune og postnummer. Feltet kan søge på navn eller postnummer. Ét tryk på \"Find på hylden\" fører til hylden og gør stedet til dit bibliotek.",
    why: "Casen: barnet står på biblioteket og vil hen til bogen. Statussen skal vise sig uden ekstra valg (H1, H6), og en bog, der ikke findes her, skal forklares i stedet for at forsvinde (H9). Eksempeldata: tilgængeligheden er opfundet i prototypen."
  },
  cookie: {
    t: "Cookie-kort i børnesprog med ligeværdige valg",
    f: [11], sev: 2, n: "",
    before: "Første skærm på mobil var et cookievindue i fuld højde med voksensprog og en dominerende blå \"Tillad alle\".",
    now: "Et lille kort nederst, der ikke blokerer siden. Forklaring i korte sætninger. To lige store knapper: \"Kun det nødvendige\" og \"Ja, husk mit bibliotek\".",
    why: "På en fælles kiosk-PC og for børn må samtykke ikke føles som en forhindring eller et pres. Det første, barnet ser, skal være bøger."
  },
  about: {
    t: "Om-side, tilgængelighed og feedback",
    f: [19, 21], sev: 2, n: "Review: ingen synlig feedbackkanal; dialogen forklarer ikke hvorfor man skal vælge",
    before: "Kun en mailadresse under Om. Ingen forklaring i trin og ingen vej for børn og forældre til at give feedback.",
    now: "En Om-side i tre trin, med afsnit til børn, voksne og biblioteker (QR-koder og kiosktilstand), en tilgængelighedsforklaring og en feedbackformular med labels.",
    why: "Fejl og ønsker opdages først, når brugerne kan fortælle dem. Bibliotekerne får samtidig en praktisk vej til at sætte QR-plakater op."
  },
  tweaks: {
    t: "Tilgængelighed som standard",
    f: [], sev: 2, n: "WCAG 2.2 AA-stikprøven i reviewet",
    before: "Overskrifter kun med emojis, filtre der ikke kan nås med tastatur, ens sidetitler og skip-links, der peger på en ubrugt rute. Se rapportens ekstrasektion om WCAG 2.1 AA.",
    now: "Atkinson Hyperlegible-skrifttype, synligt fokus, labels på alle felter, store knapper, reducér-bevægelse respekteret, og alle filtre er rigtige knapper med tilstand.",
    why: "Målgruppen omfatter ordblinde og børn med dansk som andetsprog."
  }
};
