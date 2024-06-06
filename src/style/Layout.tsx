//import React from "react";

type LayoutProps = {
  children: any
}

export const Layout: React.FC<LayoutProps>= ({ children }) => {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>{children}</body>
    </>
  );
};
