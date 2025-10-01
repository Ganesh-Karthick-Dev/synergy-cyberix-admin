import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CyberScan Pro Security Dashboard",
  description: "Access the CyberScan Pro security scanning dashboard for vulnerability assessment",
};

export default function SignIn() {
  return <SignInForm />;
}
