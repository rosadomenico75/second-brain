# Second brain

Archivio personale di link, foto, appunti e vocali. Funziona come app installabile
sul telefono, salva tutto in locale (IndexedDB) e non manda niente a nessun server.

## Pubblicare

1. Carica nella root del repository i file: `index.html`, `manifest.webmanifest`,
   `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`.
2. Settings → Pages → Source: `Deploy from a branch`, branch `main`, cartella `/ (root)`.
3. Attendi un paio di minuti e apri l'indirizzo che compare
   (`https://TUONOME.github.io/NOME-REPO/`).

I percorsi sono tutti relativi: l'app funziona in qualsiasi sottocartella senza modifiche.

## Installare sul telefono

Apri l'indirizzo in Chrome su Android → menu ⋮ → **Installa app**.
Da quel momento compare nel menu Condividi di YouTube, Instagram, WhatsApp e Chrome.

Prima cosa da fare dopo l'installazione: Impostazioni (ingranaggio in alto a destra) →
**Chiedi ad Android di non cancellare i dati**.

## Aggiornare

Modifichi i file, fai push, riapri l'app. I dati restano: sono legati all'indirizzo,
non al codice. Non spostare l'app a un altro indirizzo senza prima fare un backup.

## Backup

Impostazioni → **Esporta backup JSON**. Il file contiene anche foto e vocali
(codificati), quindi può diventare pesante. Serve per cambiare indirizzo o
per sicurezza.

## Struttura dei dati

Database `secondbrain-v1`, tre store:

- `items` — `{id, t, ti, tg[], a, s, d, blob, dur}` dove `t` è link/foto/nota/vocale,
  `ti` la descrizione, `tg` i tag, `a` l'area, `s` l'URL o la durata, `d` la data.
- `areas` — `{n, c}` nome e colore.
- `pending` — appoggio temporaneo per i contenuti in arrivo dal menu Condividi.

Per aggiungere campi in futuro basta alzare la versione in `indexedDB.open` e
gestire `onupgradeneeded`: i dati esistenti non si toccano.
