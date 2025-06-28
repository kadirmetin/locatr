import geoip from "geoip-lite";

export const getLocationFromIp = (ip: string): string => {
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("::ffff:")
  ) {
    return "Localhost";
  }

  const geo = geoip.lookup(ip);

  if (geo) {
    return (
      `${geo.city || ""} ${geo.region || ""} ${geo.country || ""}`.trim() ||
      "Unknown"
    );
  }

  return "Unknown";
};
