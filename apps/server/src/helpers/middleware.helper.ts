function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length > 1) {
        cookies[parts[0].trim()] = parts.slice(1).join("=").trim();
      }
    });
  }
  return cookies;
}

export { parseCookies };
