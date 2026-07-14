"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ContactDraft = {
  name: string;
  email: string;
  message: string;
  packageName: string;
};

type OrderHelperContextValue = {
  draft: ContactDraft;
  setDraft: (patch: Partial<ContactDraft>) => void;
  showSendTip: boolean;
  setShowSendTip: (value: boolean) => void;
  dismissSendTip: () => void;
  helperCompleted: boolean;
  setHelperCompleted: (value: boolean) => void;
};

const defaultDraft: ContactDraft = {
  name: "",
  email: "",
  message: "",
  packageName: "",
};

const OrderHelperContext = createContext<OrderHelperContextValue | null>(null);

export function OrderHelperProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<ContactDraft>(defaultDraft);
  const [showSendTip, setShowSendTip] = useState(false);
  const [helperCompleted, setHelperCompleted] = useState(false);

  const setDraft = useCallback((patch: Partial<ContactDraft>) => {
    setDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const dismissSendTip = useCallback(() => setShowSendTip(false), []);

  const value = useMemo(
    () => ({
      draft,
      setDraft,
      showSendTip,
      setShowSendTip,
      dismissSendTip,
      helperCompleted,
      setHelperCompleted,
    }),
    [
      draft,
      setDraft,
      showSendTip,
      dismissSendTip,
      helperCompleted,
    ],
  );

  return (
    <OrderHelperContext.Provider value={value}>
      {children}
    </OrderHelperContext.Provider>
  );
}

export function useOrderHelper() {
  const ctx = useContext(OrderHelperContext);
  if (!ctx) {
    throw new Error("useOrderHelper must be used within OrderHelperProvider");
  }
  return ctx;
}
