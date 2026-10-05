import { createFileRoute } from "@tanstack/react-router";
import App from "../App";
import { AppProvider } from "../context/AppContext";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "KovsiePark | UFS Smart Parking & Permit Management" },
      {
        name: "description",
        content:
          "KovsiePark — University of the Free State smart parking, permit management, visitor reservations and ALPR compliance system.",
      },
      { property: "og:title", content: "KovsiePark | UFS Smart Parking & Permit Management" },
      {
        property: "og:description",
        content:
          "Apply for permits, manage parking zones, pre-register visitors and monitor ALPR compliance across UFS campuses.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
