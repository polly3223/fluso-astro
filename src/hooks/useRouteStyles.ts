import { useInsertionEffect } from "react";

export function useRouteStyles(hrefs: string[]) {
  const key = hrefs.join("|");
  useInsertionEffect(() => {
    const links = hrefs.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.routeStyle = "";
      document.head.appendChild(link);
      return link;
    });
    return () => {
      for (const link of links) link.remove();
    };

  }, [key]);
}
