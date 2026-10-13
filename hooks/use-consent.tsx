"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearCookieStrings,
  consentCookie,
  linkedinCookieNames,
  readConsent,
  type ConsentChoice,
} from "@/lib/consent";

interface ConsentContextType {
  /** `undefined` until the cookie has been read, `null` when the visitor has not chosen. */
  choice: ConsentChoice | null | undefined;
  /** True while the banner is showing (no choice yet, or reopened from "Cookie settings"). */
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

function removeLinkedInCookies() {
  for (const name of linkedinCookieNames(document.cookie)) {
    for (const cookie of clearCookieStrings(name, window.location.hostname)) {
      document.cookie = cookie;
    }
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const [reopened, setReopened] = useState(false);

  // The cookie only exists in the browser: read it after mount so the server
  // HTML and the first client render match and nothing tracking-related runs early.
  useEffect(() => {
    setChoice(readConsent(document.cookie)?.choice ?? null);
  }, []);

  const save = useCallback(
    (next: ConsentChoice) => {
      document.cookie = consentCookie(next, new Date(), {
        secure: window.location.protocol === "https:",
      });
      if (choice === "accepted" && next === "rejected") {
        // The tag is already running in this page: remove its cookies and
        // reload so it does not outlive the withdrawal.
        removeLinkedInCookies();
        window.location.reload();
        return;
      }
      setReopened(false);
      setChoice(next);
    },
    [choice],
  );

  const value = useMemo<ConsentContextType>(
    () => ({
      choice,
      bannerOpen: choice === null || (choice !== undefined && reopened),
      accept: () => save("accepted"),
      reject: () => save("rejected"),
      openSettings: () => setReopened(true),
    }),
    [choice, reopened, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
