// Eksempeldata til prototypen. Titler og beskrivelser er opfundet, undtagen to velkendte serier fra reviewet.
window.MOODS = [
  { id: "trist", e: "😢", label: "Trist", hint: "Bøger der må få dig til at græde" },
  { id: "sjov", e: "😂", label: "Sjov", hint: "Bøger du griner af" },
  { id: "uhyggelig", e: "😱", label: "Uhyggelig", hint: "Gys og spøgelser" },
  { id: "spaendende", e: "🤩", label: "Spændende", hint: "Du kan ikke lægge dem fra dig" },
  { id: "hjertevarm", e: "🥰", label: "Hjertevarm", hint: "Bøger der varmer" },
  { id: "tankevaekkende", e: "🤔", label: "Tankevækkende", hint: "Bøger du tænker over bagefter" }
];
window.THEMES = [
  { id: "magi", e: "🧙", label: "Magi", hint: "Troldmænd og trylleformularer" },
  { id: "fabeldyr", e: "🦄", label: "Fabeldyr", hint: "Enhjørninger, drager og andre væsner" },
  { id: "venskab", e: "👫", label: "Venskab", hint: "Venner, uvenner og nye venner" },
  { id: "dyr", e: "🐴", label: "Dyr", hint: "Heste, hunde og andre dyr" },
  { id: "sport", e: "⚽", label: "Sport", hint: "Fodbold og andre sportsgrene" },
  { id: "mysterium", e: "🕵️", label: "Mysterium", hint: "Gåder og detektiver" },
  { id: "rummet", e: "🚀", label: "Rummet", hint: "Planeter, raketter og astronauter" },
  { id: "historie", e: "🏛️", label: "Fortid", hint: "Vikinger, riddere og gamle dage" }
];
const ALL = [...MOODS, ...THEMES];
window.TAGS = Object.fromEntries(ALL.map(t => [t.id, t]));

// shelf: skilt på reolen. av = står på hylden lige nu
window.BOOKS = [
  { id: "percy", title: "Percy Jackson og lyntyven", author: "Rick Riordan", age: [10, 13], pages: 380, lix: 31, cat: "Fantasy", tags: ["spaendende", "magi", "venskab"], topics: ["guder", "myter", "eventyr"], shelf: ["BØRN", "FANTASY", "R"], av: true, c: ["#2b6cb0", "#63b3ed"], d: "Percy opdager, at han er søn af en græsk gud. Nu skal han finde en stjålet lyn, før gudernes krig begynder." },
  { id: "hp1", title: "Harry Potter og De Vises Sten", author: "J.K. Rowling", age: [9, 13], pages: 270, lix: 28, cat: "Fantasy", tags: ["magi", "spaendende", "venskab"], topics: ["troldmænd", "skole", "eventyr"], shelf: ["BØRN", "FANTASY", "R"], av: true, c: ["#742a2a", "#f6ad55"], d: "Harry får at vide, at han er troldmand, og starter på Hogwarts. Der venter venner, hemmeligheder og en stor fare." },
  { id: "hp-cursed", title: "Harry Potter og det forbandede barn", author: "J. Tiffany, J.K. Rowling", age: [11, 16], pages: 330, lix: 35, cat: "Fantasy", tags: ["magi", "tankevaekkende"], topics: ["troldmænd", "teater"], shelf: ["UNGE", "FANTASY", "R"], av: false, c: ["#2d3748", "#a0aec0"], d: "Et teaterstykke om Harrys søn Albus og en rejse tilbage i tiden." },
  { id: "enhjorning", title: "Enhjørningen i Egeskoven", author: "Maja Lindholm", age: [7, 10], pages: 120, lix: 14, cat: "Fantasy", tags: ["fabeldyr", "hjertevarm", "venskab"], topics: ["skov", "enhjørninger"], shelf: ["BØRN", "FANTASY", "L"], av: true, c: ["#9f7aea", "#fbb6ce"], d: "Ida finder en lille enhjørning i skoven. Men hvorfor er den så alene, og hvem leder efter den?" },
  { id: "drage", title: "Dragen der ikke kunne spy ild", author: "Peter Brandt", age: [7, 10], pages: 96, lix: 12, cat: "Fantasy", tags: ["fabeldyr", "sjov"], topics: ["drager", "mod"], shelf: ["BØRN", "FANTASY", "B"], av: true, c: ["#276749", "#9ae6b4"], d: "Alle drager i bjerget kan spy ild. Alle undtagen Ulrik, der kun kan hikke gnister." },
  { id: "troldmand", title: "Troldmanden i kælderen", author: "Sofie Aagaard", age: [8, 11], pages: 150, lix: 18, cat: "Fantasy", tags: ["magi", "sjov", "mysterium"], topics: ["troldmænd", "kælder"], shelf: ["BØRN", "FANTASY", "A"], av: true, c: ["#553c9a", "#d6bcfa"], d: "Der bor en gammel troldmand under Noahs hus. Han har glemt alle sine trylleformularer." },
  { id: "spogelse", title: "Spøgelset i skolekælderen", author: "Anne Holm Jensen", age: [8, 11], pages: 110, lix: 16, cat: "Gys", tags: ["uhyggelig", "sjov", "mysterium"], topics: ["spøgelser", "skole"], shelf: ["BØRN", "GYS", "H"], av: true, c: ["#1a202c", "#a0aec0"], d: "Noget hvisker i skolens kælder, når lyset er slukket. Lærke og Mehmet vil finde ud af hvad." },
  { id: "graesk", title: "Græskarhuset", author: "Ole Strand", age: [9, 12], pages: 140, lix: 20, cat: "Gys", tags: ["uhyggelig", "spaendende"], topics: ["halloween", "hus"], shelf: ["BØRN", "GYS", "S"], av: true, c: ["#c05621", "#fbd38d"], d: "På Halloween-aftenen lyser et græskar i et hus, der har stået tomt i 30 år." },
  { id: "skelet", title: "Skelettet der blev væk", author: "Line Bjerre", age: [7, 10], pages: 80, lix: 11, cat: "Gys", tags: ["uhyggelig", "sjov"], topics: ["skeletter", "halloween"], shelf: ["BØRN", "GYS", "B"], av: false, c: ["#4a5568", "#edf2f7"], d: "Skolens skelet er forsvundet fra biologilokalet. Hvem har taget det, og hvorfor?" },
  { id: "bedste", title: "Min bedste ven flytter", author: "Camilla Dahl", age: [8, 11], pages: 100, lix: 15, cat: "Fiktion", tags: ["trist", "venskab", "hjertevarm"], topics: ["flytning", "savn"], shelf: ["BØRN", "FIKTION", "D"], av: true, c: ["#2c5282", "#90cdf4"], d: "Da Sami skal flytte til Aarhus, opdager Noor hvor meget en ven fylder. En stille bog om at sige farvel." },
  { id: "vinterfugl", title: "Vinterfuglen", author: "Katrine Moe", age: [9, 12], pages: 160, lix: 22, cat: "Fiktion", tags: ["trist", "dyr", "tankevaekkende"], topics: ["sorg", "fugle"], shelf: ["BØRN", "FIKTION", "M"], av: true, c: ["#2a4365", "#bee3f8"], d: "Efter morfars død finder Karl en såret fugl. At passe den hjælper ham med at forstå savnet." },
  { id: "hest", title: "Hesten i Rosenhaven", author: "Mie Skov", age: [8, 11], pages: 130, lix: 17, cat: "Fiktion", tags: ["dyr", "hjertevarm", "venskab"], topics: ["heste", "ridning"], shelf: ["BØRN", "FIKTION", "S"], av: true, c: ["#975a16", "#faf089"], d: "Emma får lov at passe en gammel hest på et ridecenter. Men hesten har sine egne regler." },
  { id: "fodbold", title: "Målmanden fra Nr. 9", author: "Jonas Vest", age: [8, 12], pages: 140, lix: 19, cat: "Fiktion", tags: ["sport", "sjov", "venskab"], topics: ["fodbold", "hold"], shelf: ["BØRN", "FIKTION", "V"], av: true, c: ["#22543d", "#9ae6b4"], d: "Ali er ikke den bedste på holdet. Men han er den eneste, der tør stå i mål til finalen." },
  { id: "fodbold2", title: "Straffespark", author: "Jonas Vest", age: [9, 12], pages: 150, lix: 21, cat: "Fiktion", tags: ["sport", "spaendende"], topics: ["fodbold", "mod"], shelf: ["BØRN", "FIKTION", "V"], av: true, c: ["#1c4532", "#c6f6d5"], d: "Sidste kamp i sæsonen. Én straffe, hele holdet ser på." },
  { id: "detektiv", title: "Detektivbureauet på loftet", author: "Hanne Krog", age: [8, 11], pages: 120, lix: 16, cat: "Krimi", tags: ["mysterium", "spaendende", "sjov"], topics: ["detektiver", "gåder"], shelf: ["BØRN", "KRIMI", "K"], av: true, c: ["#744210", "#fefcbf"], d: "Tre børn åbner et detektivbureau på et loft. Deres første sag handler om en forsvundet kat." },
  { id: "rummet", title: "Rejsen til Måne 7", author: "Frederik Lund", age: [9, 12], pages: 170, lix: 24, cat: "Science fiction", tags: ["spaendende", "tankevaekkende"], topics: ["rummet", "rumskibe"], shelf: ["BØRN", "SCI-FI", "L"], av: false, c: ["#1a365d", "#7f9cf5"], d: "Nova er den yngste, der nogensinde har fået lov at rejse til månen. Men noget er galt på Måne 7." },
  { id: "mormor", title: "Mormors hemmelige have", author: "Sara Winther", age: [7, 10], pages: 90, lix: 12, cat: "Fiktion", tags: ["hjertevarm", "tankevaekkende"], topics: ["familie", "haver"], shelf: ["BØRN", "FIKTION", "W"], av: true, c: ["#2f855a", "#fed7e2"], d: "Hos mormor gror der ting, der ikke burde kunne gro. Og hun vil ikke fortælle hvorfor." },
  { id: "kogebog", title: "Harry Potter-kogebogen", author: "Dinah Bucholz", age: [12, 99], pages: 200, lix: 30, cat: "Fakta", tags: [], topics: ["mad", "kogebog"], shelf: ["VOKSEN", "MAD", "B"], av: false, c: ["#744210", "#fbd38d"], d: "Opskrifter fra troldmandsverdenen." }
];

// Flere bøger, serier og faktabøger
BOOKS.push(
  { id: "drage2", title: "Dragen og den store storm", author: "Peter Brandt", age: [7, 10], pages: 104, lix: 13, cat: "Fantasy", tags: ["fabeldyr", "sjov", "spaendende"], topics: ["drager", "storm"], shelf: ["BØRN", "FANTASY", "B"], av: true, c: ["#2f855a", "#faf089"], d: "Ulrik har lært at hikke gnister med stil. Så kommer en storm, og kun en drage med gnister kan lyse vejen hjem." },
  { id: "detektiv2", title: "Detektivbureauet og guldfisken", author: "Hanne Krog", age: [8, 11], pages: 126, lix: 16, cat: "Krimi", tags: ["mysterium", "sjov", "spaendende"], topics: ["detektiver", "gåder"], shelf: ["BØRN", "KRIMI", "K"], av: false, c: ["#975a16", "#fefcbf"], d: "Skolens guldfisk er væk fra akvariet. Bureauet har tre mistænkte og kun én eftermiddag." },
  { id: "heks", title: "Heksen fra nr. 13", author: "Pia Nørgaard", age: [8, 11], pages: 118, lix: 15, cat: "Fantasy", tags: ["magi", "sjov", "uhyggelig"], topics: ["hekse", "nabo", "halloween"], shelf: ["BØRN", "FANTASY", "N"], av: true, c: ["#44337a", "#fbb6ce"], d: "Naboen i nr. 13 har sort kat, spidst hat og en kedel. Men er hun virkelig en heks, eller bare dårlig til at lave mad?" },
  { id: "larver", title: "Lysende larver", author: "Ditte Winge", age: [7, 10], pages: 88, lix: 11, cat: "Fiktion", tags: ["dyr", "sjov"], topics: ["insekter", "have"], shelf: ["BØRN", "FIKTION", "W"], av: true, c: ["#48bb78", "#faf089"], d: "Mads finder larver, der lyser i mørket. Det er sjovt, indtil de begynder at følge efter ham." },
  { id: "hund", title: "Hundevagten", author: "Mikkel Overgaard", age: [9, 12], pages: 150, lix: 20, cat: "Fiktion", tags: ["dyr", "spaendende", "hjertevarm"], topics: ["hunde", "redning"], shelf: ["BØRN", "FIKTION", "O"], av: true, c: ["#744210", "#fbd38d"], d: "Da en eftermiddagstur med hunden ender i skoven, må Sara stole på, at hun kan stole på Bjørn." },
  { id: "nypige", title: "Den nye i klassen", author: "Camilla Dahl", age: [8, 11], pages: 112, lix: 14, cat: "Fiktion", tags: ["venskab", "tankevaekkende", "hjertevarm"], topics: ["skole", "nye venner", "dansk som andetsprog"], shelf: ["BØRN", "FIKTION", "D"], av: true, c: ["#2b6cb0", "#fed7e2"], d: "Leyla taler ikke meget dansk endnu. Det gør ikke noget, mener Emil. Det gør det næsten lettere at blive venner." },
  { id: "sorg", title: "Månen over Bedstes hus", author: "Katrine Moe", age: [10, 13], pages: 180, lix: 24, cat: "Fiktion", tags: ["trist", "tankevaekkende", "hjertevarm"], topics: ["sorg", "familie"], shelf: ["BØRN", "FIKTION", "M"], av: true, c: ["#2a4365", "#e9d8fd"], d: "Bedste er blevet syg. Månen er den samme, men alt andet er ændret for Alma." },
  { id: "ven2", title: "Rebecca og Kasper", author: "Sofie Aagaard", age: [8, 11], pages: 98, lix: 13, cat: "Fiktion", tags: ["venskab", "trist", "sjov"], topics: ["uvenner", "forsoning"], shelf: ["BØRN", "FIKTION", "A"], av: false, c: ["#d69e2e", "#bee3f8"], d: "Rebecca og Kasper har været bedste venner siden børnehaven. Nu skændes de om en bold, og ingen vil sige undskyld først." },
  { id: "rum", title: "Rummet for børn", author: "Anders Bro", age: [9, 12], pages: 96, lix: 26, cat: "Fakta", tags: ["rummet", "spaendende", "tankevaekkende"], topics: ["planeter", "astronauter", "rummet"], shelf: ["BØRN", "FAKTA", "B"], av: true, c: ["#1a365d", "#90cdf4"], d: "Hvor langt er der til månen? Hvad spiser astronauter? Svar på 50 spørgsmål om rummet, med store billeder." },
  { id: "heste", title: "Alt om heste", author: "Mie Skov", age: [8, 12], pages: 80, lix: 19, cat: "Fakta", tags: ["dyr"], topics: ["heste", "ridning", "pleje"], shelf: ["BØRN", "FAKTA", "S"], av: true, c: ["#975a16", "#c6f6d5"], d: "Racer, farver, sprog og pleje. Alt, du skal vide, før du møder din første hest." },
  { id: "fodhist", title: "Fodboldens historie", author: "Jonas Vest", age: [9, 12], pages: 110, lix: 27, cat: "Fakta", tags: ["sport", "historie"], topics: ["fodbold", "historie"], shelf: ["BØRN", "FAKTA", "V"], av: true, c: ["#22543d", "#fefcbf"], d: "Fra lerbolde til VM-finaler. Hvordan blev fodbold verdens største sport?" },
  { id: "viking", title: "Vikinger: fakta og fup", author: "Henrik Dal", age: [8, 12], pages: 104, lix: 23, cat: "Fakta", tags: ["historie", "spaendende", "sjov"], topics: ["vikinger", "historie"], shelf: ["BØRN", "FAKTA", "D"], av: false, c: ["#742a2a", "#fbd38d"], d: "Havde vikinger virkelig horn på hjelmen? Sandt eller falsk – du gætter, bogen svarer." },
  { id: "dybhav", title: "Dyr i dybhavet", author: "Ditte Winge", age: [9, 12], pages: 92, lix: 25, cat: "Fakta", tags: ["dyr", "uhyggelig", "spaendende"], topics: ["hav", "fisk", "dybhavet"], shelf: ["BØRN", "FAKTA", "W"], av: true, c: ["#1a365d", "#4fd1c5"], d: "I mørket dybt nede lever fisk med lys på hovedet og tænder som knive. Mød dem her." },
  { id: "knogler", title: "Skeletter og knogler", author: "Line Bjerre", age: [8, 11], pages: 72, lix: 18, cat: "Fakta", tags: ["uhyggelig", "spaendende"], topics: ["krop", "skelet", "halloween"], shelf: ["BØRN", "FAKTA", "B"], av: true, c: ["#4a5568", "#e2e8f0"], d: "Du har 206 knogler. Hvad laver de, og hvorfor knager de, når du bøjer fingeren?" }
);
// Serier
const SER = { "Dragerne fra Bjerget": ["drage", "drage2"], "Detektivbureauet": ["detektiv", "detektiv2"], "Målmanden": ["fodbold", "fodbold2"] };
Object.entries(SER).forEach(([name, ids]) => ids.forEach((id, i) => { const b = BOOKS.find(x => x.id === id); b.series = { name, n: i + 1, ids }; }));
BOOKS.forEach((b, i) => { b.year = 2012 + (i * 7) % 13; });

window.LIBRARIES = [
  { id: "kbh-nord", zip: "2200", name: "Nørrebro Bibliotek", group: "Københavns Biblioteker", near: true, dist: "0,4 km" },
  { id: "kbh-hoved", zip: "1620", name: "Hovedbiblioteket", group: "Københavns Biblioteker", dist: "2,1 km" },
  { id: "kbh-ama", zip: "2300", name: "Amager Bibliotek", group: "Københavns Biblioteker", dist: "4,3 km" },
  { id: "kbh-ves", zip: "1620", name: "Vesterbro Bibliotek", group: "Københavns Biblioteker", dist: "3,0 km" },
  { id: "aarhus", zip: "8000", name: "Dokk1, Aarhus", group: "Aarhus Kommune" },
  { id: "aarhus-gellerup", zip: "8220", name: "Gellerup Bibliotek", group: "Aarhus Kommune" },
  { id: "odense", zip: "5000", name: "Odense Hovedbibliotek", group: "Odense Kommune" },
  { id: "htk", zip: "2630", name: "Høje-Taastrup Bibliotek", group: "Høje-Taastrup Kommune" },
  { id: "arden", zip: "9510", name: "Arden Skole", group: "Skoler", school: true },
  { id: "birkerod", zip: "3460", name: "Birkerød Skole", group: "Skoler", school: true }
];

window.LIB_ZIPS = { "Københavns Biblioteker": [1000, 2500], "Aarhus Kommune": [8000, 8270], "Odense Kommune": [5000, 5270], "Høje-Taastrup Kommune": [2630, 2630] };
