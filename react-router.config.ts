import type { Config } from "@react-router/dev/config";

export default {
  // This is the ONLY configuration option that Parcel currently supports.
  // All other options are ignored.
  appDirectory: "app",
  future: {
    unstable_middleware: true,
  },
} satisfies Config;
