// import SignUpForm from "@/components/auth/SignUpForm";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
//   // other metadata
// };

// export default function SignUp() {
//   return <SignUpForm />;
// }

// Admin dashboard - signup disabled
export default function SignUp() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Signup Disabled</h1>
        <p className="text-gray-600 dark:text-gray-400">This is an admin dashboard. Contact administrator for access.</p>
      </div>
    </div>
  );
}
