import "dotenv/config";
import "websocket-polyfill";

import * as NostrTools from "nostr-tools";

const NOSTR_RELAY = `${process.env.NOSTR_RELAY}`;
const NOSTR_NSEC = `${process.env.NOSTR_NSEC}`;

type ResponseType = { pool: any; sk: Uint8Array };

type SendEventProps = {
  sk: Uint8Array;
  content?: string;
  tags?: string[][];
  kind?: number;
  coordinates?: { lat: number; lng: number };
  pool: any;
};

export const initNostr = async (): Promise<ResponseType> => {
  try {
    const { data } = NostrTools.nip19.decode(NOSTR_NSEC);
    const pk = NostrTools.getPublicKey(data as Uint8Array);

    const npub = NostrTools.nip19.npubEncode(pk);
    console.log(`https://iris.to/${npub}`);

    const pool = new NostrTools.SimplePool();

    return {
      pool,
      sk: data as Uint8Array,
    };
  } finally {
    console.log("Nostr connected");
  }
};

export const sendNostrEvent = async ({
  sk,
  content = "",
  pool,
}: SendEventProps): Promise<any> => {
  const relays = NOSTR_RELAY.split(",");

  const event = NostrTools.finalizeEvent(
    {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content,
    },
    sk
  );

  const verified = NostrTools.verifyEvent(event);

  if (!verified) {
    throw new Error("Failed to verify event");
  }

  const signedEvent = NostrTools.finalizeEvent(event, sk);

  await pool.publish(relays, signedEvent);

  return signedEvent;
};
