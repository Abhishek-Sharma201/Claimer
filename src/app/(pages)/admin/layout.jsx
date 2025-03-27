import "./style.css";
import ClientLayout from "./admin-layout";

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
  );
}
