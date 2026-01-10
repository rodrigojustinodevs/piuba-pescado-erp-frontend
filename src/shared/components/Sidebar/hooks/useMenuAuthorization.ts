"use client";

import { useMemo } from "react";
import { useAuthContext } from "@/shared/contexts/AuthContext";
import type { MenuItemWithAuth } from "../menuConfig";
import { filterMenuItemsByAuth, toMenuItem } from "../utils/menuAuthorization";
import type { MenuItem } from "../types";

export function useMenuAuthorization(
  menuConfig: MenuItemWithAuth[]
): MenuItem[] {
  const { user } = useAuthContext();

  return useMemo(() => {
    const filteredItems = filterMenuItemsByAuth(menuConfig, user);
    return filteredItems.map(toMenuItem);
  }, [menuConfig, user]);
}



